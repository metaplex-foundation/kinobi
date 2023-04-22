import type { IdlAccount } from '../idl';
import { InvalidKinobiTreeError, PartialExcept, mainCase } from '../shared';
import type { InstructionNodeAccountDefaultsSeed } from './InstructionNode';
import { LinkTypeNode, isLinkTypeNode } from './LinkTypeNode';
import type { Node } from './Node';
import { isPublicKeyTypeNode } from './PublicKeyTypeNode';
import { StructTypeNode, assertStructTypeNode } from './StructTypeNode';
import { TypeNode, createTypeNodeFromIdl } from './TypeNode';
import { ValueNode } from './ValueNode';

export type AccountNodeSeed =
  | { type: 'programId' }
  | { type: 'literal'; value: string }
  | {
      type: 'variable';
      name: string;
      description: string;
      variableNode: TypeNode;
    };

export type AccountNodeDiscriminator =
  | { type: 'field'; name: string; value: ValueNode | null }
  | { type: 'size' };

export type AccountNodeGpaField = {
  name: string;
  offset: number | null;
  type: TypeNode;
};

export type AccountNode = {
  readonly __accountNode: unique symbol;
  readonly nodeClass: 'AccountNode';
  readonly name: string;
  readonly dataNode: StructTypeNode | LinkTypeNode;
  readonly idlName: string;
  readonly docs: string[];
  readonly internal: boolean;
  readonly size: number | null;
  readonly seeds: AccountNodeSeed[];
  readonly discriminator: AccountNodeDiscriminator | null;
  readonly gpaFields: AccountNodeGpaField[];
};

export type AccountNodeInput = Omit<
  PartialExcept<AccountNode, 'name' | 'dataNode'>,
  '__accountNode' | 'nodeClass'
>;

export function accountNode(input: AccountNodeInput): AccountNode {
  if (!input.name) {
    throw new InvalidKinobiTreeError('DefinedTypeNodeInput must have a name.');
  }
  return {
    nodeClass: 'AccountNode',
    name: mainCase(input.name),
    seeds: input.seeds.map((seed) =>
      'name' in seed ? { ...seed, name: mainCase(seed.name) } : seed
    ),
  } as AccountNode;
}

export function accountNodeFromIdl(idl: Partial<IdlAccount>): AccountNode {
  const name = idl.name ?? '';
  const idlStruct = idl.type ?? { kind: 'struct', fields: [] };
  const type = createTypeNodeFromIdl({ name, ...idlStruct });
  assertStructTypeNode(type);
  const seeds = (idl.seeds ?? []).map((seed) => {
    if (seed.type === 'variable') {
      return { ...seed, type: createTypeNodeFromIdl(seed.type) };
    }
    return seed;
  });
  const metadata = {
    name,
    idlName: name,
    docs: idl.docs ?? [],
    internal: false,
    size: idl.size ?? null,
    seeds,
    discriminator: null,
    gpaFields: [],
  };
  return accountNode(metadata, type);
}

export class OldAccountNode {
  get isLinked(): boolean {
    return isLinkTypeNode(this.type);
  }

  get variableSeeds(): Extract<AccountNodeSeed, { type: 'variable' }>[] {
    return this.metadata.seeds.filter(
      (seed): seed is Extract<AccountNodeSeed, { type: 'variable' }> =>
        seed.type === 'variable'
    );
  }

  get hasVariableSeeds(): boolean {
    return this.variableSeeds.length > 0;
  }

  get instructionAccountDefaultSeeds(): Record<
    string,
    InstructionNodeAccountDefaultsSeed
  > {
    return this.metadata.seeds.reduce((acc, seed) => {
      if (seed.type !== 'variable') return acc;
      if (isPublicKeyTypeNode(seed.type)) {
        acc[seed.name] = { type: 'account', name: seed.name };
      } else {
        acc[seed.name] = { type: 'arg', name: seed.name };
      }
      return acc;
    }, {} as Record<string, InstructionNodeAccountDefaultsSeed>);
  }
}

export function isAccountNode(node: Node | null): node is AccountNode {
  return !!node && node.nodeClass === 'AccountNode';
}

export function assertAccountNode(
  node: Node | null
): asserts node is AccountNode {
  if (!isAccountNode(node)) {
    throw new Error(`Expected AccountNode, got ${node?.nodeClass ?? 'null'}.`);
  }
}
