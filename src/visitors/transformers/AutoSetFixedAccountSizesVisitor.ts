import * as nodes from '../../nodes';
import { GetByteSizeVisitor } from '../aggregators';
import { BaseThrowVisitor } from '../BaseThrowVisitor';
import { TransformNodesVisitor } from './TransformNodesVisitor';

export class AutoSetFixedAccountSizesVisitor extends BaseThrowVisitor<nodes.RootNode> {
  visitRoot(root: nodes.RootNode): nodes.RootNode {
    // Prepare the visitor that gets the byte size of a type.
    const byteSizeVisitor = new GetByteSizeVisitor();
    byteSizeVisitor.registerDefinedTypes(root.allDefinedTypes);

    // Prepare the visitor that transforms account nodes.
    const transformVisitor = new TransformNodesVisitor([
      {
        selector: (node) =>
          nodes.isAccountNode(node) && node.metadata.size === null,
        transformer: (node) => {
          nodes.assertAccountNode(node);
          const size = node.type.accept(byteSizeVisitor);
          if (size === null) return node;
          return new nodes.AccountNode(
            { ...node.metadata, size },
            node.type,
            node.seeds
          );
        },
      },
    ]);

    // Execute the transform visitor on the Root node.
    const transformedRoot = root.accept(transformVisitor);
    nodes.assertRootNode(transformedRoot);
    return transformedRoot;
  }
}
