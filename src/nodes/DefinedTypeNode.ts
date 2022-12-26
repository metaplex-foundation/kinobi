import type { IdlDefinedType } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import type { TypeEnumNode } from './TypeEnumNode';
import { assertTypeStructOrEnumNode, createTypeNodeFromIdl } from './TypeNode';
import type { TypeStructNode } from './TypeStructNode';

export class DefinedTypeNode implements Visitable {
  readonly nodeClass = 'DefinedTypeNode' as const;

  constructor(
    readonly name: string,
    readonly type: TypeStructNode | TypeEnumNode,
    readonly docs: string[]
  ) {}

  static fromIdl(idl: Partial<IdlDefinedType>): DefinedTypeNode {
    const name = idl.name ?? '';
    const idlType = idl.type ?? { kind: 'struct', fields: [] };
    const type = createTypeNodeFromIdl({ name, ...idlType });
    assertTypeStructOrEnumNode(type);
    const docs = idl.docs ?? [];
    return new DefinedTypeNode(name, type, docs);
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitDefinedType(this);
  }
}

export function isDefinedTypeNode(node: Node): node is DefinedTypeNode {
  return node.nodeClass === 'DefinedTypeNode';
}

export function assertDefinedTypeNode(
  node: Node
): asserts node is DefinedTypeNode {
  if (!isDefinedTypeNode(node)) {
    throw new Error(`Expected DefinedTypeNode, got ${node.nodeClass}.`);
  }
}
