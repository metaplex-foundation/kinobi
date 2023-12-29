import {
  ArrayTypeNode,
  arrayTypeNode,
  assertTypeNode,
  bytesTypeNode,
  isNumberTypeNode,
} from '../nodes';
import { fixedSize, pipe } from '../shared';
import { extendVisitor } from './extendVisitor';
import { identityVisitor } from './identityVisitor';
import { visit } from './visitor';

export function transformU8ArraysToBytesVisitor(
  sizes: number[] | '*' = [32, 64]
) {
  const hasRequiredSize = (size: ArrayTypeNode['size']): boolean => {
    if (size.kind !== 'fixed') return false;
    return sizes === '*' || sizes.includes(size.value);
  };

  return pipe(identityVisitor(), (v) =>
    extendVisitor(v, {
      visitArrayType(node, { self }) {
        const child = visit(node.child, self);
        assertTypeNode(child);

        if (
          isNumberTypeNode(child) &&
          child.format === 'u8' &&
          node.size.kind === 'fixed' &&
          hasRequiredSize(node.size)
        ) {
          return bytesTypeNode(fixedSize(node.size.value));
        }

        return arrayTypeNode(child, { ...node });
      },
    })
  );
}
