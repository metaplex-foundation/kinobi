import type { IdlTypeFixedSizeOption } from '../../idl';
import { TypeNode, createTypeNodeFromIdl } from './TypeNode';

export type FixedSizeOptionTypeNode = {
  readonly kind: 'fixedSizeOptionTypeNode';

  // Children.
  readonly item: TypeNode;

  // Data.
  readonly sentinel: number[];
};

export function fixedSizeOptionTypeNode(
  item: TypeNode,
  sentinel: number[]
): FixedSizeOptionTypeNode {
  return {
    kind: 'fixedSizeOptionTypeNode',
    item,
    sentinel,
  };
}

export function fixedSizeOptionTypeNodeFromIdl(
  idl: IdlTypeFixedSizeOption
): FixedSizeOptionTypeNode {
  const item = createTypeNodeFromIdl(idl.fixedSizeOption.inner);
  const { sentinel } = idl.fixedSizeOption;
  return fixedSizeOptionTypeNode(item, sentinel);
}
