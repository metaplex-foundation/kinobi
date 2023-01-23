import { pascalCase } from '../utils';
import type { IdlAccount } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { createTypeNodeFromIdl, TypeNode } from './TypeNode';
import { assertTypeStructNode, TypeStructNode } from './TypeStructNode';
import type { InstructionNodeAccountDefaultsSeed } from './InstructionNode';
import { isTypeLeafNode } from './TypeLeafNode';

export type AccountNodeMetadata = {
  readonly name: string;
  readonly idlName: string;
  readonly docs: string[];
  readonly internal: boolean;
  readonly size: number | null;
  readonly seeds: AccountNodeSeed[];
};

export type AccountNodeSeed =
  | { kind: 'programId' }
  | { kind: 'literal'; value: string }
  | { kind: 'variable'; name: string; description: string; type: TypeNode };

export class AccountNode implements Visitable {
  readonly nodeClass = 'AccountNode' as const;

  constructor(
    readonly metadata: AccountNodeMetadata,
    readonly type: TypeStructNode
  ) {}

  static fromIdl(idl: Partial<IdlAccount>): AccountNode {
    const idlName = idl.name ?? '';
    const name = pascalCase(idlName);
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
      idlName,
      docs: idl.docs ?? [],
      internal: false,
      size: idl.size ?? null,
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
