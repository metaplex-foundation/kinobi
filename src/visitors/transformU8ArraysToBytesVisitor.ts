import {
  ArrayTypeNode,
  arrayTypeNode,
  assertTypeNode,
  bytesTypeNode,
  fixedSizeNode,
  isFixedSizeNode,
  isNumberTypeNode,
} from '../nodes';
import { pipe } from '../shared';
import { extendVisitor } from './extendVisitor';
import { identityVisitor } from './identityVisitor';
import { visit } from './visitor';

export function transformU8ArraysToBytesVisitor(
  sizes: number[] | '*' = [32, 64]
) {
  const hasRequiredSize = (size: ArrayTypeNode['size']): boolean => {
    if (!isFixedSizeNode(size)) return false;
    return sizes === '*' || sizes.includes(size.size);
  };

  return pipe(identityVisitor(), (v) =>
    extendVisitor(v, {
      visitArrayType(node, { self }) {
        const child = visit(node.child, self);
        assertTypeNode(child);

        if (
          isNumberTypeNode(child) &&
          child.format === 'u8' &&
          isFixedSizeNode(node.size) &&
          hasRequiredSize(node.size)
        ) {
          return bytesTypeNode(fixedSizeNode(node.size.size));
        }

        return arrayTypeNode(child, { ...node });
      },
    })
  );
}
