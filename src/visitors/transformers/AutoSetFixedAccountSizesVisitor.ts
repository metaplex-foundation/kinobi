import * as nodes from '../../nodes';
import { BaseThrowVisitor } from '../BaseThrowVisitor';
import { visit } from '../visitor';
import { getByteSizeVisitor } from '../getByteSizeVisitor';
import { TransformNodesVisitor } from './TransformNodesVisitor';

export class AutoSetFixedAccountSizesVisitor extends BaseThrowVisitor<nodes.RootNode> {
  visitRoot(root: nodes.RootNode): nodes.RootNode {
    // Prepare the visitor that gets the byte size of a type.
    const byteSizeVisitor = getByteSizeVisitor(nodes.getAllDefinedTypes(root));

    // Prepare the visitor that transforms account nodes.
    const transformVisitor = new TransformNodesVisitor([
      {
        selector: (node) =>
          nodes.isAccountNode(node) && node.size === undefined,
        transformer: (node) => {
          nodes.assertAccountNode(node);
          const size = visit(node.data, byteSizeVisitor);
          if (size === null) return node;
          return nodes.accountNode({ ...node, size });
        },
      },
    ]);

    // Execute the transform visitor on the Root node.
    const transformedRoot = visit(root, transformVisitor);
    nodes.assertRootNode(transformedRoot);
    return transformedRoot;
  }
}
