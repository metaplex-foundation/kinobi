import * as nodes from '../../nodes';
import { NodeTransform, TransformNodesVisitor } from './TransformNodesVisitor';

export class SetAccountSizesVisitor extends TransformNodesVisitor {
  constructor(readonly map: Record<string, number>) {
    const transforms = Object.entries(map).map(
      ([selectorStack, size]): NodeTransform => {
        const stack = selectorStack.split('.');
        const name = stack.pop();
        return {
          selector: { type: 'account', stack, name },
          transformer: (node) => {
            nodes.assertAccountNode(node);
            return new nodes.AccountNode(
              { ...node.metadata, size },
              node.type,
              node.seeds
            );
          },
        };
      }
    );

    super(transforms);
  }
}
