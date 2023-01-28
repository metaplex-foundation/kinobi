import * as nodes from '../../nodes';
import { NodeTransform, TransformNodesVisitor } from './TransformNodesVisitor';

export class CreateSubInstructionsFromEnumArgsVisitor extends TransformNodesVisitor {
  protected allDefinedTypes = new Map<string, nodes.DefinedTypeNode>();

  constructor(readonly map: Record<string, string>) {
    const transforms = Object.entries(map).map(
      ([selector, argName]): NodeTransform => {
        const selectorStack = selector.split('.');
        const name = selectorStack.pop();
        return {
          selector: { type: 'instruction', stack: selectorStack, name },
          transformer: (node) => {
            nodes.assertInstructionNode(node);
            console.log(argName);
            return new nodes.InstructionNode(
              node.metadata,
              node.accounts,
              node.args,
              node.subInstructions
            );
          },
        };
      }
    );

    super(transforms);
  }

  visitRoot(root: nodes.RootNode): nodes.Node | null {
    root.allDefinedTypes.forEach((type) => {
      this.allDefinedTypes.set(type.name, type);
    });
    return super.visitRoot(root);
  }
}
