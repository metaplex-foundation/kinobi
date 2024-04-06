import type { IdlTypeArray, IdlTypeVec } from '../../idl';
import {
  CountNode,
  fixedCountNode,
  prefixedCountNode,
  remainderCountNode,
} from '../countNodes';
import { numberTypeNode } from './NumberTypeNode';
import { TypeNode, createTypeNodeFromIdl } from './TypeNode';

export type ArrayTypeNode = {
  readonly kind: 'arrayTypeNode';

  // Children.
  readonly item: TypeNode;
  readonly count: CountNode;
};

export function arrayTypeNode(
  item: TypeNode,
  count?: CountNode
): ArrayTypeNode {
  return {
    kind: 'arrayTypeNode',
    item,
    count: count ?? prefixedCountNode(numberTypeNode('u32')),
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
