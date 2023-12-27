import {
  DefinedTypeNode,
  accountNode,
  assertAccountNode,
  isAccountNode,
} from '../nodes';
import { getByteSizeVisitor } from './getByteSizeVisitor';
import { topDownTransformerVisitor } from './topDownTransformerVisitor';
import { visit } from './visitor';

export function setFixedAccountSizesVisitor(definedTypes: DefinedTypeNode[]) {
  const byteSizeVisitor = getByteSizeVisitor(definedTypes);

  return topDownTransformerVisitor(
    [
      {
        select: (node) => isAccountNode(node) && node.size === undefined,
        transform: (node) => {
          assertAccountNode(node);
          const size = visit(node.data, byteSizeVisitor);
          if (size === null) return node;
          return accountNode({ ...node, size }) as typeof node;
        },
      },
    ],
    { nodeKeys: ['rootNode', 'programNode', 'accountNode'] }
  );
}
