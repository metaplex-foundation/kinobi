import type { IdlTypeMap } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { createTypeNodeFromIdl, TypeNode } from './TypeNode';
import { TypeNumberNode } from './TypeNumberNode';

export class TypeMapNode implements Visitable {
  readonly nodeClass = 'TypeMapNode' as const;

  readonly key: TypeNode;

  readonly value: TypeNode;

  readonly size:
    | { kind: 'fixed'; size: number }
    | { kind: 'prefixed'; prefix: TypeNumberNode }
    | { kind: 'remainder' };

  readonly idlType: 'hashMap' | 'bTreeMap';

  constructor(
    key: TypeNode,
    value: TypeNode,
    options: {
      size?: TypeMapNode['size'];
      idlType?: 'hashMap' | 'bTreeMap';
    } = {}
  ) {
    this.key = key;
    this.value = value;
    this.size = options.size ?? {
      kind: 'prefixed',
      prefix: new TypeNumberNode('u32'),
    };
    this.idlType = options.idlType ?? 'hashMap';
  }

  static fromIdl(idl: IdlTypeMap): TypeMapNode {
    const idlType = 'hashMap' in idl ? 'hashMap' : 'bTreeMap';
    const [key, value] = 'hashMap' in idl ? idl.hashMap : idl.bTreeMap;
    return new TypeMapNode(
      createTypeNodeFromIdl(key),
      createTypeNodeFromIdl(value),
      { idlType }
    );
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeMap(this);
  }
}

export function isTypeMapNode(node: Node | null): node is TypeMapNode {
  return !!node && node.nodeClass === 'TypeMapNode';
}

export function assertTypeMapNode(
  node: Node | null
): asserts node is TypeMapNode {
  if (!isTypeMapNode(node)) {
    throw new Error(`Expected TypeMapNode, got ${node?.nodeClass ?? 'null'}.`);
  }
}
