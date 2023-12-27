import {
  accountNode,
  assertAccountNode,
  assertRootNode,
  getAllDefinedTypes,
  isAccountNode,
} from '../nodes';
import { getByteSizeVisitor } from './getByteSizeVisitor';
import { rootNodeVisitor } from './singleNodeVisitor';
import { topDownTransformerVisitor } from './topDownTransformerVisitor';
import { visit } from './visitor';

export function setFixedAccountSizesVisitor() {
  return rootNodeVisitor((root) => {
    // Prepare the visitor that gets the byte size of a type.
    const byteSizeVisitor = getByteSizeVisitor(getAllDefinedTypes(root));

    // Prepare the visitor that transforms account nodes.
    const transformVisitor = topDownTransformerVisitor([
      {
        select: (node) => isAccountNode(node) && node.size === undefined,
        transform: (node) => {
          assertAccountNode(node);
          const size = visit(node.data, byteSizeVisitor);
          if (size === null) return node;
          return accountNode({ ...node, size }) as typeof node;
        },
      },
    ]);

    // Execute the transform visitor on the Root node.
    const transformedRoot = visit(root, transformVisitor);
    assertRootNode(transformedRoot);
    return transformedRoot;
  });
}
