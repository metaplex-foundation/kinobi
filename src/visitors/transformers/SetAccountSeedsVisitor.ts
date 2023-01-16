import * as nodes from '../../nodes';
import { NodeTransform, TransformNodesVisitor } from './TransformNodesVisitor';

export class SetAccountSeedsVisitor extends TransformNodesVisitor {
  constructor(readonly map: Record<string, nodes.AccountNodeSeed[]>) {
    const transforms = Object.entries(map).map(
      ([selectorStack, seeds]): NodeTransform => ({
        selector: { type: 'account', stack: selectorStack },
        transformer: (node) => {
          nodes.assertAccountNode(node);
          return new nodes.AccountNode(node.metadata, node.type, seeds);
        },
      })
    );

    super(transforms);
  }
}
