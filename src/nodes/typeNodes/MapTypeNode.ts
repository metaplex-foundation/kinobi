import type { IdlTypeMap } from '../../idl';
import {
  SizeNode,
  fixedSizeNode,
  prefixedSizeNode,
  remainderSizeNode,
} from '../sizeNodes';
import { numberTypeNode } from './NumberTypeNode';
import { TypeNode, createTypeNodeFromIdl } from './TypeNode';

export type MapTypeNode = {
  readonly kind: 'mapTypeNode';
  readonly key: TypeNode;
  readonly value: TypeNode;
  readonly size: SizeNode;
  readonly idlMap: 'hashMap' | 'bTreeMap';
};

export function mapTypeNode(
  key: TypeNode,
  value: TypeNode,
  options: {
    readonly size?: MapTypeNode['size'];
    readonly idlMap?: MapTypeNode['idlMap'];
  } = {}
): MapTypeNode {
  return {
    kind: 'mapTypeNode',
    key,
    value,
    size: options.size ?? prefixedSizeNode(numberTypeNode('u32')),
    idlMap: options.idlMap ?? 'hashMap',
  };
}

export function mapTypeNodeFromIdl(idl: IdlTypeMap): MapTypeNode {
  const [key, value] = 'hashMap' in idl ? idl.hashMap : idl.bTreeMap;
  let size: SizeNode | undefined;
  if (idl.size === 'remainder') {
    size = remainderSizeNode();
  } else if (typeof idl.size === 'number') {
    size = fixedSizeNode(idl.size);
  } else if (idl.size) {
    size = prefixedSizeNode(numberTypeNode(idl.size));
  }
  return mapTypeNode(createTypeNodeFromIdl(key), createTypeNodeFromIdl(value), {
    size,
    idlMap: 'hashMap' in idl ? 'hashMap' : 'bTreeMap',
  });
}
