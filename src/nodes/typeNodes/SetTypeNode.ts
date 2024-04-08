import type { IdlTypeSet } from '../../idl';
import {
  CountNode,
  PrefixedCountNode,
  fixedCountNode,
  prefixedCountNode,
  remainderCountNode,
} from '../countNodes';
import { NumberTypeNode, numberTypeNode } from './NumberTypeNode';
import { TypeNode, createTypeNodeFromIdl } from './TypeNode';

export interface SetTypeNode<
  TItem extends TypeNode = TypeNode,
  TCount extends CountNode = CountNode,
> {
  readonly kind: 'setTypeNode';

  // Children.
  readonly item: TItem;
  readonly count: TCount;

  // Data.
  readonly idlSet: 'hashSet' | 'bTreeSet';
}

export function setTypeNode<
  TItem extends TypeNode = TypeNode,
  TCount extends CountNode = PrefixedCountNode<NumberTypeNode<'u32'>>,
>(
  item: TItem,
  count?: TCount,
  idlSet?: SetTypeNode['idlSet']
): SetTypeNode<TItem, TCount> {
  return {
    kind: 'setTypeNode',
    item,
    count: (count ?? prefixedCountNode(numberTypeNode('u32'))) as TCount,
    idlSet: idlSet ?? 'hashSet',
  };
}

export function setTypeNodeFromIdl(idl: IdlTypeSet): SetTypeNode {
  const child = 'hashSet' in idl ? idl.hashSet : idl.bTreeSet;
  let size: SetTypeNode['count'] | undefined;
  if (idl.size === 'remainder') {
    size = remainderCountNode();
  } else if (typeof idl.size === 'number') {
    size = fixedCountNode(idl.size);
  } else if (idl.size) {
    size = prefixedCountNode(numberTypeNode(idl.size));
  }
  return setTypeNode(
    createTypeNodeFromIdl(child),
    size,
    'hashSet' in idl ? 'hashSet' : 'bTreeSet'
  );
}
