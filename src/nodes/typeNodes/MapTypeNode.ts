import type { IdlTypeMap } from '../../idl';
import {
  SizeStrategy,
  fixedSize,
  prefixedSize,
  remainderSize,
} from '../../shared';
import type { Node } from '../Node';
import { numberTypeNode } from './NumberTypeNode';
import { TypeNode, createTypeNodeFromIdl } from './TypeNode';

export type MapTypeNode = {
  readonly __mapTypeNode: unique symbol;
  readonly kind: 'mapTypeNode';
  readonly key: TypeNode;
  readonly value: TypeNode;
  readonly size: SizeStrategy;
  readonly idlMap: 'hashMap' | 'bTreeMap';
};

export function mapTypeNode(
  key: TypeNode,
  value: TypeNode,
  options: {
    readonly size?: SizeStrategy;
    readonly idlMap?: MapTypeNode['idlMap'];
  } = {}
): MapTypeNode {
  return {
    kind: 'mapTypeNode',
    key,
    value,
    size: options.size ?? prefixedSize(),
    idlMap: options.idlMap ?? 'hashMap',
  } as MapTypeNode;
}

export function mapTypeNodeFromIdl(idl: IdlTypeMap): MapTypeNode {
  const [key, value] = 'hashMap' in idl ? idl.hashMap : idl.bTreeMap;
  let size: SizeStrategy | undefined;
  if (idl.size === 'remainder') {
    size = remainderSize();
  } else if (typeof idl.size === 'number') {
    size = fixedSize(idl.size);
  } else if (idl.size) {
    size = prefixedSize(numberTypeNode(idl.size));
  }
  return mapTypeNode(createTypeNodeFromIdl(key), createTypeNodeFromIdl(value), {
    size,
    idlMap: 'hashMap' in idl ? 'hashMap' : 'bTreeMap',
  });
}

export function isMapTypeNode(node: Node | null): node is MapTypeNode {
  return !!node && node.kind === 'mapTypeNode';
}

export function assertMapTypeNode(
  node: Node | null
): asserts node is MapTypeNode {
  if (!isMapTypeNode(node)) {
    throw new Error(`Expected mapTypeNode, got ${node?.kind ?? 'null'}.`);
  }
}
