import { IdlTypeMap } from 'src/idl';
import type { Visitable, Visitor } from '../visitors';
import { createTypeNodeFromIdl, TypeNode } from './TypeNode';

export class TypeMapNode implements Visitable {
  readonly nodeType = 'map' as const;

  constructor(
    readonly mapType: 'hashMap' | 'bTreeMap',
    readonly keyType: TypeNode,
    readonly valueType: TypeNode,
  ) {}

  static fromIdl(idl: IdlTypeMap): TypeMapNode {
    const mapType = 'hashMap' in idl ? 'hashMap' : 'bTreeMap';
    const [key, value] = 'hashMap' in idl ? idl.hashMap : idl.bTreeMap;
    const keyType = createTypeNodeFromIdl(key);
    const valueType = createTypeNodeFromIdl(value);
    return new TypeMapNode(mapType, keyType, valueType);
  }

  visit(visitor: Visitor): void {
    visitor.visitTypeMap(this);
  }

  visitChildren(visitor: Visitor): void {
    this.keyType.visit(visitor);
    this.valueType.visit(visitor);
  }
}
