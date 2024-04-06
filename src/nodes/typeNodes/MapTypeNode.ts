import type { IdlTypeMap } from '../../idl';
import {
  CountNode,
  fixedCountNode,
  prefixedCountNode,
  remainderCountNode,
} from '../countNodes';
import { numberTypeNode } from './NumberTypeNode';
import { TypeNode, createTypeNodeFromIdl } from './TypeNode';

export type MapTypeNode = {
  readonly kind: 'mapTypeNode';

  // Children.
  readonly key: TypeNode;
  readonly value: TypeNode;
  readonly count: CountNode;

  // Data.
  readonly idlMap: 'hashMap' | 'bTreeMap';
};

export function mapTypeNode(
  key: TypeNode,
  value: TypeNode,
  count?: CountNode,
  idlMap?: MapTypeNode['idlMap']
): MapTypeNode {
  return {
    kind: 'mapTypeNode',
    key,
    value,
    count: count ?? prefixedCountNode(numberTypeNode('u32')),
    idlMap: idlMap ?? 'hashMap',
  };
}

export function mapTypeNodeFromIdl(idl: IdlTypeMap): MapTypeNode {
  const [key, value] = 'hashMap' in idl ? idl.hashMap : idl.bTreeMap;
  let size: CountNode | undefined;
  if (idl.size === 'remainder') {
    size = remainderCountNode();
  } else if (typeof idl.size === 'number') {
    size = fixedCountNode(idl.size);
  } else if (idl.size) {
    size = prefixedCountNode(numberTypeNode(idl.size));
  }
  return mapTypeNode(
    createTypeNodeFromIdl(key),
    createTypeNodeFromIdl(value),
    size,
    'hashMap' in idl ? 'hashMap' : 'bTreeMap'
  );
}
