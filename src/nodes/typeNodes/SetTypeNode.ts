import type { IdlTypeSet } from '../../idl';
import {
  SizeNode,
  fixedSizeNode,
  prefixedSizeNode,
  remainderSizeNode,
} from '../sizeNodes';
import { numberTypeNode } from './NumberTypeNode';
import { TypeNode, createTypeNodeFromIdl } from './TypeNode';

export type SetTypeNode = {
  readonly kind: 'setTypeNode';

  // Children.
  readonly item: TypeNode;
  readonly size: SizeNode;

  // Data.
  readonly idlSet: 'hashSet' | 'bTreeSet';
};

export function setTypeNode(
  item: TypeNode,
  size?: SizeNode,
  idlSet?: SetTypeNode['idlSet']
): SetTypeNode {
  return {
    kind: 'setTypeNode',
    item,
    size: size ?? prefixedSizeNode(numberTypeNode('u32')),
    idlSet: idlSet ?? 'hashSet',
  };
}

export function setTypeNodeFromIdl(idl: IdlTypeSet): SetTypeNode {
  const child = 'hashSet' in idl ? idl.hashSet : idl.bTreeSet;
  let size: SetTypeNode['size'] | undefined;
  if (idl.size === 'remainder') {
    size = remainderSizeNode();
  } else if (typeof idl.size === 'number') {
    size = fixedSizeNode(idl.size);
  } else if (idl.size) {
    size = prefixedSizeNode(numberTypeNode(idl.size));
  }
  return setTypeNode(
    createTypeNodeFromIdl(child),
    size,
    'hashSet' in idl ? 'hashSet' : 'bTreeSet'
  );
}
