import type { IdlTypeSet } from '../../idl';
import {
  CountNode,
  fixedCountNode,
  prefixedCountNode,
  remainderCountNode,
} from '../countNodes';
import { numberTypeNode } from './NumberTypeNode';
import { TypeNode, createTypeNodeFromIdl } from './TypeNode';

export interface SetTypeNode {
  readonly kind: 'setTypeNode';

  // Children.
  readonly item: TypeNode;
  readonly count: CountNode;

  // Data.
  readonly idlSet: 'hashSet' | 'bTreeSet';
}

export function setTypeNode(
  item: TypeNode,
  count?: CountNode,
  idlSet?: SetTypeNode['idlSet']
): SetTypeNode {
  return {
    kind: 'setTypeNode',
    item,
    count: count ?? prefixedCountNode(numberTypeNode('u32')),
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
