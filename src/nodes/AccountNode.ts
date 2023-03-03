import { mainCase } from '../utils';
import type { IdlAccount } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { createTypeNodeFromIdl, TypeNode } from './TypeNode';
import { assertTypeStructNode, TypeStructNode } from './TypeStructNode';
import type { InstructionNodeAccountDefaultsSeed } from './InstructionNode';
import { TypeStructFieldNode } from './TypeStructFieldNode';
import { isTypePublicKeyNode } from './TypePublicKeyNode';
import {
  isTypeDefinedLinkNode,
  TypeDefinedLinkNode,
} from './TypeDefinedLinkNode';
import { ValueNode } from './ValueNode';

export type AccountNodeMetadata = {
  readonly name: string;
  readonly idlName: string;
  readonly docs: string[];
  readonly internal: boolean;
  readonly size: number | null;
  readonly seeds: AccountNodeSeed[];
  readonly discriminator: AccountNodeDiscriminator | null;
  readonly gpaFields: AccountNodeGpaField[];
};

export type AccountNodeSeed =
  | { kind: 'programId' }
  | { kind: 'literal'; value: string }
  | { kind: 'variable'; name: string; description: string; type: TypeNode };

export type AccountNodeDiscriminator =
  | { kind: 'field'; name: string; value: ValueNode | null }
  | { kind: 'size' };

export type AccountNodeGpaField = {
  name: string;
  offset: number | null;
  type: TypeNode;
};

export class AccountNode implements Visitable {
  readonly nodeClass = 'AccountNode' as const;

  readonly metadata: AccountNodeMetadata;

  readonly type: TypeStructNode | TypeDefinedLinkNode;

  constructor(metadata: AccountNodeMetadata, type: AccountNode['type']) {
    this.metadata = {
      ...metadata,
      name: mainCase(metadata.name),
      seeds: metadata.seeds.map((seed) =>
        'name' in seed ? { ...seed, name: mainCase(seed.name) } : seed
      ),
    };
    this.type = type;
  }

  static fromIdl(idl: Partial<IdlAccount>): AccountNode {
    const name = idl.name ?? '';
    const idlStruct = idl.type ?? { kind: 'struct', fields: [] };
    const type = createTypeNodeFromIdl({ name, ...idlStruct });
    assertTypeStructNode(type);
    const seeds = (idl.seeds ?? []).map((seed) => {
      if (seed.kind === 'variable') {
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
    return new AccountNode(metadata, type);
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitAccount(this);
  }

  get name(): string {
    return this.metadata.name;
  }

  get docs(): string[] {
    return this.metadata.docs;
  }

  get isLinked(): boolean {
    return isTypeDefinedLinkNode(this.type);
  }

  get variableSeeds(): Extract<AccountNodeSeed, { kind: 'variable' }>[] {
    return this.metadata.seeds.filter(
      (seed): seed is Extract<AccountNodeSeed, { kind: 'variable' }> =>
        seed.kind === 'variable'
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
      if (seed.kind !== 'variable') return acc;
      if (isTypePublicKeyNode(seed.type)) {
        acc[seed.name] = { kind: 'account', name: seed.name };
      } else {
        acc[seed.name] = { kind: 'arg', name: seed.name };
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
