import { pascalCase } from '../utils';
import type { IdlAccount } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { createTypeNodeFromIdl, TypeNode } from './TypeNode';
import { assertTypeStructNode, TypeStructNode } from './TypeStructNode';

export type AccountNodeMetadata = {
  name: string;
  idlName: string;
  docs: string[];
  internal: boolean;
};

export type AccountNodeSeed =
  | { kind: 'programId' }
  | { kind: 'literal'; value: string }
  | { kind: 'variable'; name: string; description: string; type: TypeNode };

export class AccountNode implements Visitable {
  readonly nodeClass = 'AccountNode' as const;

  constructor(
    readonly metadata: AccountNodeMetadata,
    readonly type: TypeStructNode,
    readonly seeds: AccountNodeSeed[]
  ) {}

  static fromIdl(idl: Partial<IdlAccount>): AccountNode {
    const idlName = idl.name ?? '';
    const name = pascalCase(idlName);
    const idlStruct = idl.type ?? { kind: 'struct', fields: [] };
    const type = createTypeNodeFromIdl({ name, ...idlStruct });
    assertTypeStructNode(type);
    const metadata = { name, idlName, docs: idl.docs ?? [], internal: false };
    const seeds = (idl.seeds ?? []).map((seed) => {
      if (seed.kind === 'variable') {
        return { ...seed, type: createTypeNodeFromIdl(seed.type) };
      }
      return seed;
    });
    return new AccountNode(metadata, type, seeds);
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
    return this.seeds.filter(
      (seed): seed is Extract<AccountNodeSeed, { kind: 'variable' }> =>
        seed.kind === 'variable'
    );
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
