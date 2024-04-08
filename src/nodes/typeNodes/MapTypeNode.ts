import type { IdlTypeMap } from '../../idl';
import {
  CountNode,
  PrefixedCountNode,
  fixedCountNode,
  prefixedCountNode,
  remainderCountNode,
} from '../countNodes';
import { NumberTypeNode, numberTypeNode } from './NumberTypeNode';
import { TypeNode, createTypeNodeFromIdl } from './TypeNode';

export interface MapTypeNode<
  TKey extends TypeNode = TypeNode,
  TValue extends TypeNode = TypeNode,
  TCount extends CountNode = CountNode,
> {
  readonly kind: 'mapTypeNode';

  // Children.
  readonly key: TKey;
  readonly value: TValue;
  readonly count: TCount;

  // Data.
  readonly idlMap: 'hashMap' | 'bTreeMap';
}

export function mapTypeNode<
  TKey extends TypeNode = TypeNode,
  TValue extends TypeNode = TypeNode,
  TCount extends CountNode = PrefixedCountNode<NumberTypeNode<'u32'>>,
>(
  key: TKey,
  value: TValue,
  count?: TCount,
  idlMap?: MapTypeNode['idlMap']
): MapTypeNode<TKey, TValue, TCount> {
  return {
    kind: 'mapTypeNode',
    key,
    value,
    count: (count ?? prefixedCountNode(numberTypeNode('u32'))) as TCount,
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
