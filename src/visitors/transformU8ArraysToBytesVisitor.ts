import {
  ArrayTypeNode,
  TYPE_NODES,
  arrayTypeNode,
  assertIsNode,
  bytesTypeNode,
  fixedSizeTypeNode,
  isNode,
} from '../nodes';
import { pipe } from '../shared';
import { extendVisitor } from './extendVisitor';
import { nonNullableIdentityVisitor } from './nonNullableIdentityVisitor';
import { visit } from './visitor';

export function transformU8ArraysToBytesVisitor(
  sizes: number[] | '*' = [32, 64]
) {
  const hasRequiredSize = (size: ArrayTypeNode['size']): boolean => {
    if (!isNode(size, 'fixedSizeNode')) return false;
    return sizes === '*' || sizes.includes(size.size);
  };

  return pipe(nonNullableIdentityVisitor(), (v) =>
    extendVisitor(v, {
      visitArrayType(node, { self }) {
        const child = visit(node.item, self);
        assertIsNode(child, TYPE_NODES);

        if (
          isNode(child, 'numberTypeNode') &&
          child.format === 'u8' &&
          isNode(node.size, 'fixedSizeNode') &&
          hasRequiredSize(node.size)
        ) {
          return fixedSizeTypeNode(bytesTypeNode(), node.size.size);
        }

        return arrayTypeNode(child, node.size);
      },
    })
  );
}
