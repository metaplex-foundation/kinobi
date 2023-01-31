import { mainCase } from '../utils';
import type { IdlAccount } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { createTypeNodeFromIdl, TypeNode } from './TypeNode';
import { assertTypeStructNode, TypeStructNode } from './TypeStructNode';
import type { InstructionNodeAccountDefaultsSeed } from './InstructionNode';
import { isTypeLeafNode } from './TypeLeafNode';
import { TypeStructFieldNode } from './TypeStructFieldNode';

export type AccountNodeMetadata = {
  readonly name: string;
  readonly idlName: string;
  readonly docs: string[];
  readonly internal: boolean;
  readonly size: number | null;
  readonly discriminator: AccountNodeDiscriminator | null;
  readonly seeds: AccountNodeSeed[];
};

export type AccountNodeDiscriminator =
  | { kind: 'field'; name: string }
  | { kind: 'size' };

export type AccountNodeSeed =
  | { kind: 'programId' }
  | { kind: 'literal'; value: string }
  | { kind: 'variable'; name: string; description: string; type: TypeNode };

export class AccountNode implements Visitable {
  readonly nodeClass = 'AccountNode' as const;

  readonly metadata: AccountNodeMetadata;

  readonly type: TypeStructNode;

  constructor(metadata: AccountNodeMetadata, type: TypeStructNode) {
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
      discriminator: null,
      seeds,
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

  get discriminatorField(): TypeStructFieldNode | null {
    if (this.metadata.discriminator?.kind !== 'field') return null;
    const { name } = this.metadata.discriminator;
    return name ? this.type.fields.find((f) => f.name === name) ?? null : null;
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
      if (isTypeLeafNode(seed.type) && seed.type.type === 'publicKey') {
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
