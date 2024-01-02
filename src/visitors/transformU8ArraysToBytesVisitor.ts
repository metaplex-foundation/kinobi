import {
  ArrayTypeNode,
  TYPE_NODES,
  arrayTypeNode,
  assertIsNode,
  bytesTypeNode,
  fixedSizeNode,
  isNode,
} from '../nodes';
import { pipe } from '../shared';
import { extendVisitor } from './extendVisitor';
import { identityVisitor } from './identityVisitor';
import { visit } from './visitor';

export function transformU8ArraysToBytesVisitor(
  sizes: number[] | '*' = [32, 64]
) {
  const hasRequiredSize = (size: ArrayTypeNode['size']): boolean => {
    if (!isNode(size, 'fixedSizeNode')) return false;
    return sizes === '*' || sizes.includes(size.size);
  };

  return pipe(identityVisitor(), (v) =>
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
          return bytesTypeNode(fixedSizeNode(node.size.size));
        }

        return arrayTypeNode(child, node.size);
      },
    })
  );
}
