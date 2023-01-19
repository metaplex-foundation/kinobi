import * as nodes from '../../nodes';
import { NodeTransform, TransformNodesVisitor } from './TransformNodesVisitor';

type InstructionNodeBytesCreatedOnChainInput =
  | { kind: 'number'; value: number; includeHeader?: boolean }
  | { kind: 'arg'; name: string; includeHeader?: boolean }
  | {
      kind: 'account';
      name: string;
      dependency?: string;
      includeHeader?: boolean;
    }
  | { kind: 'none' };

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
            const bytes = {
              includeHeader: true,
              ...bytesCreatedOnChain,
            } as nodes.InstructionNodeBytesCreatedOnChain;
            if (bytes.kind === 'account') {
              bytes.dependency = bytes.dependency ?? 'generated';
            }
            return new nodes.InstructionNode(
              { ...node.metadata, bytesCreatedOnChain: bytes },
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
