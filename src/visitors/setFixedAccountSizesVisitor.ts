import {
  accountNode,
  assertAccountNode,
  getAllDefinedTypes,
  isAccountNode,
} from '../nodes';
import { getByteSizeVisitor } from './getByteSizeVisitor';
import { topDownTransformerVisitor } from './topDownTransformerVisitor';
import { visit } from './visitor';

export function setFixedAccountSizesVisitor() {
  let byteSizeVisitor = getByteSizeVisitor([]);

  const visitor = topDownTransformerVisitor(
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
    ['rootNode', 'programNode', 'accountNode']
  );

  const baseVisitor = { ...visitor };
  visitor.visitRoot = (node) => {
    byteSizeVisitor = getByteSizeVisitor(getAllDefinedTypes(node));
    return baseVisitor.visitRoot.bind(visitor)(node);
  };

  return visitor;
}
