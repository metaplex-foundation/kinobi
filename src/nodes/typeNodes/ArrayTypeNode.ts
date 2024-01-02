import type { IdlTypeArray, IdlTypeVec } from '../../idl';
import {
  SizeNode,
  fixedSizeNode,
  prefixedSizeNode,
  remainderSizeNode,
} from '../sizeNodes';
import { numberTypeNode } from './NumberTypeNode';
import { TypeNode, createTypeNodeFromIdl } from './TypeNode';

export type ArrayTypeNode = {
  readonly kind: 'arrayTypeNode';

  // Children.
  readonly item: TypeNode;
  readonly size: SizeNode;
};

export function arrayTypeNode(item: TypeNode, size?: SizeNode): ArrayTypeNode {
  return {
    kind: 'arrayTypeNode',
    item,
    size: size ?? prefixedSizeNode(numberTypeNode('u32')),
  };
}

export function arrayTypeNodeFromIdl(
  idl: IdlTypeArray | IdlTypeVec
): ArrayTypeNode {
  if ('array' in idl) {
    const item = createTypeNodeFromIdl(idl.array[0]);
    return arrayTypeNode(item, fixedSizeNode(idl.array[1]));
  }
  const item = createTypeNodeFromIdl(idl.vec);
  if (!idl.size) return arrayTypeNode(item);
  if (idl.size === 'remainder') return arrayTypeNode(item, remainderSizeNode());
  return arrayTypeNode(item, prefixedSizeNode(numberTypeNode(idl.size)));
}
