import * as nodes from '../../nodes';
import { NodeTransform, TransformNodesVisitor } from './TransformNodesVisitor';

export class SetInstructionBytesCreatedOnChainVisitor extends TransformNodesVisitor {
  constructor(
    readonly map: Record<string, nodes.InstructionNodeBytesCreatedOnChain>
  ) {
    const transforms = Object.entries(map).map(
      ([selectorStack, bytesCreatedOnChain]): NodeTransform => {
        const stack = selectorStack.split('.');
        const name = stack.pop();
        return {
          selector: { type: 'instruction', stack, name },
          transformer: (node) => {
            nodes.assertInstructionNode(node);
            return new nodes.InstructionNode(
              { ...node.metadata, bytesCreatedOnChain },
              node.accounts,
              node.args
            );
          },
        };
      }
    );

    super(transforms);
  }
}
