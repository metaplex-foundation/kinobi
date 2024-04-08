import type { IdlTypeArray, IdlTypeVec } from '../../idl';
import {
  CountNode,
  PrefixedCountNode,
  fixedCountNode,
  prefixedCountNode,
  remainderCountNode,
} from '../countNodes';
import { NumberTypeNode, numberTypeNode } from './NumberTypeNode';
import { TypeNode, createTypeNodeFromIdl } from './TypeNode';

export interface ArrayTypeNode<
  TItem extends TypeNode = TypeNode,
  TCount extends CountNode = CountNode,
> {
  readonly kind: 'arrayTypeNode';

  // Children.
  readonly item: TItem;
  readonly count: TCount;
}

export function arrayTypeNode<
  TItem extends TypeNode,
  TCount extends CountNode = PrefixedCountNode<NumberTypeNode<'u32'>>,
>(item: TItem, count?: TCount): ArrayTypeNode<TItem, TCount> {
  return {
    kind: 'arrayTypeNode',
    item,
    count: (count ?? prefixedCountNode(numberTypeNode('u32'))) as TCount,
  };
}

export function arrayTypeNodeFromIdl(
  idl: IdlTypeArray | IdlTypeVec
): ArrayTypeNode {
  if ('array' in idl) {
    const item = createTypeNodeFromIdl(idl.array[0]);
    return arrayTypeNode(item, fixedCountNode(idl.array[1]));
  }
  const item = createTypeNodeFromIdl(idl.vec);
  if (!idl.size) return arrayTypeNode(item);
  if (idl.size === 'remainder')
    return arrayTypeNode(item, remainderCountNode());
  return arrayTypeNode(item, prefixedCountNode(numberTypeNode(idl.size)));
}
