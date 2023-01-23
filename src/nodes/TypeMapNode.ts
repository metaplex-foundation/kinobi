import type { IdlTypeMap } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import { createTypeNodeFromIdl, TypeNode } from './TypeNode';
import type { Node } from './Node';

export class TypeMapNode implements Visitable {
  readonly nodeClass = 'TypeMapNode' as const;

  readonly mapType: 'hashMap' | 'bTreeMap';

  readonly keyType: TypeNode;

  readonly valueType: TypeNode;

  constructor(
    mapType: 'hashMap' | 'bTreeMap',
    keyType: TypeNode,
    valueType: TypeNode
  ) {
    this.mapType = mapType;
    this.keyType = keyType;
    this.valueType = valueType;
  }

  static fromIdl(idl: IdlTypeMap): TypeMapNode {
    const mapType = 'hashMap' in idl ? 'hashMap' : 'bTreeMap';
    const [key, value] = 'hashMap' in idl ? idl.hashMap : idl.bTreeMap;
    const keyType = createTypeNodeFromIdl(key);
    const valueType = createTypeNodeFromIdl(value);
    return new TypeMapNode(mapType, keyType, valueType);
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
