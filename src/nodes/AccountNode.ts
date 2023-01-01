import { pascalCase } from '../utils';
import type { IdlAccount } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { createTypeNodeFromIdl } from './TypeNode';
import { assertTypeStructNode, TypeStructNode } from './TypeStructNode';

export type AccountNodeMetadata = {
  name: string;
  idlName: string;
  docs: string[];
};

export class AccountNode implements Visitable {
  readonly nodeClass = 'AccountNode' as const;

  constructor(
    readonly metadata: AccountNodeMetadata,
    readonly type: TypeStructNode
  ) {}

  static fromIdl(idl: Partial<IdlAccount>): AccountNode {
    const idlName = idl.name ?? '';
    const name = pascalCase(idlName);
    const docs = idl.docs ?? [];
    const idlStruct = idl.type ?? { kind: 'struct', fields: [] };
    const type = createTypeNodeFromIdl({ name, ...idlStruct });
    assertTypeStructNode(type);
    return new AccountNode({ name, idlName, docs }, type);
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
