import type { IdlAccount } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { createTypeNodeFromIdl } from './TypeNode';
import { assertTypeStructNode, TypeStructNode } from './TypeStructNode';

export class AccountNode implements Visitable {
  readonly nodeClass = 'AccountNode' as const;

  constructor(
    readonly name: string,
    readonly type: TypeStructNode,
    readonly docs: string[] = []
  ) {}

  static fromIdl(idl: Partial<IdlAccount>): AccountNode {
    const name = idl.name ?? '';
    const idlStruct = idl.type ?? { kind: 'struct', fields: [] };
    const type = createTypeNodeFromIdl({ name, ...idlStruct });
    assertTypeStructNode(type);
    const docs = idl.docs ?? [];
    return new AccountNode(name, type, docs);
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitAccount(this);
  }
}

export function isAccountNode(node: Node): node is AccountNode {
  return node.nodeClass === 'AccountNode';
}

export function assertAccountNode(node: Node): asserts node is AccountNode {
  if (!isAccountNode(node)) {
    throw new Error(`Expected AccountNode, got ${node.nodeClass}.`);
  }
}
