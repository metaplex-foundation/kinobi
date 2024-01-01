import { accountNode, assertIsNode, isNode } from '../nodes';
import { LinkableDictionary } from '../shared';
import { getByteSizeVisitor } from './getByteSizeVisitor';
import { recordLinkablesVisitor } from './recordLinkablesVisitor';
import { topDownTransformerVisitor } from './topDownTransformerVisitor';
import { visit } from './visitor';

export function setFixedAccountSizesVisitor() {
  const linkables = new LinkableDictionary();
  const byteSizeVisitor = getByteSizeVisitor(linkables);

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

  return recordLinkablesVisitor(visitor, linkables);
}
