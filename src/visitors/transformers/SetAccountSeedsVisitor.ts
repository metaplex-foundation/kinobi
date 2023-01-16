import * as nodes from '../../nodes';
import { NodeTransform, TransformNodesVisitor } from './TransformNodesVisitor';

export class SetAccountSeedsVisitor extends TransformNodesVisitor {
  constructor(readonly map: Record<string, nodes.AccountNodeSeed[]>) {
    const transforms = Object.entries(map).map(
      ([selectorStack, seeds]): NodeTransform => {
        const stack = selectorStack.split('.');
        const name = stack.pop();
        return {
          selector: { type: 'account', stack, name },
          transformer: (node) => {
            nodes.assertAccountNode(node);
            return new nodes.AccountNode(node.metadata, node.type, seeds);
          },
        };
      }
    );

    super(transforms);
  }
}
