import { accountNode, assertIsNode, isNode } from '../nodes';
import { getByteSizeVisitor } from './getByteSizeVisitor';
import { tapDefinedTypesVisitor } from './tapVisitor';
import { topDownTransformerVisitor } from './topDownTransformerVisitor';
import { visit } from './visitor';

export function setFixedAccountSizesVisitor() {
  let byteSizeVisitor = getByteSizeVisitor([]);

  const visitor = topDownTransformerVisitor(
    [
      {
        select: (node) =>
          isNode(node, 'accountNode') && node.size === undefined,
        transform: (node) => {
          assertIsNode(node, 'accountNode');
          const size = visit(node.data, byteSizeVisitor);
          if (size === null) return node;
          return accountNode({ ...node, size }) as typeof node;
        },
      },
    ],
    ['rootNode', 'programNode', 'accountNode']
  );

  return tapDefinedTypesVisitor(visitor, (definedTypes) => {
    byteSizeVisitor = getByteSizeVisitor(definedTypes);
  });
}
