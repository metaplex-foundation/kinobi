import { logWarn } from '../../logs';
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
            const argField = node.args.fields.find(
              (field) => field.name === argName
            );
            if (!argField) {
              logWarn(`Could not find instruction argument [${argName}].`);
              return node;
            }

            let argType: nodes.TypeEnumNode;
            if (nodes.isTypeEnumNode(argField.type)) {
              argType = argField.type;
            } else if (
              nodes.isTypeDefinedLinkNode(argField.type) &&
              this.allDefinedTypes.has(argField.type.name)
            ) {
              const linkedType =
                this.allDefinedTypes.get(argField.type.name)?.type ?? null;
              nodes.assertTypeEnumNode(linkedType);
              argType = linkedType;
            } else {
              logWarn(
                `Could not find an enum type for ` +
                  `instruction argument [${argName}].`
              );
              return node;
            }

            console.log(argType);
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
