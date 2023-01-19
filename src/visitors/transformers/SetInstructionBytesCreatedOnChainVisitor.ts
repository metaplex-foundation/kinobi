import * as nodes from '../../nodes';
import { NodeTransform, TransformNodesVisitor } from './TransformNodesVisitor';

type InstructionNodeBytesCreatedOnChainInput = Omit<
  nodes.InstructionNodeBytesCreatedOnChain,
  'includeHeader'
> & { includeHeader?: boolean };

export class SetInstructionBytesCreatedOnChainVisitor extends TransformNodesVisitor {
  constructor(
    readonly map: Record<string, InstructionNodeBytesCreatedOnChainInput>
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
              {
                ...node.metadata,
                bytesCreatedOnChain: {
                  includeHeader: true,
                  ...bytesCreatedOnChain,
                } as nodes.InstructionNodeBytesCreatedOnChain,
              },
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
