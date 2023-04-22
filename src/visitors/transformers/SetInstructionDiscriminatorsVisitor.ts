import * as nodes from '../../nodes';
import { NodeTransform, TransformNodesVisitor } from './TransformNodesVisitor';

type Discriminator = {
  value: nodes.ValueNode;
  /** @defaultValue `new NumberTypeNode('u8')` */
  type?: nodes.TypeNode;
  /** @defaultValue `"discriminator"` */
  name?: string;
  /** @defaultValue `"omitted"` */
  strategy?: 'optional' | 'omitted';
  /** @defaultValue `[]` */
  docs?: string[];
};

export class SetInstructionDiscriminatorsVisitor extends TransformNodesVisitor {
  constructor(readonly map: Record<string, Discriminator>) {
    const transforms = Object.entries(map).map(
      ([selectorStack, discriminator]): NodeTransform => {
        const stack = selectorStack.split('.');
        const name = stack.pop();
        return {
          selector: { type: 'InstructionNode', stack, name },
          transformer: (node) => {
            nodes.assertInstructionNode(node);
            if (nodes.isLinkTypeNode(node.args)) return node;
            const discriminatorField = nodes.structFieldTypeNode(
              {
                name: discriminator.name ?? 'discriminator',
                docs: discriminator.docs ?? [],
                defaultsTo: {
                  strategy: discriminator.strategy ?? 'omitted',
                  value: discriminator.value,
                },
              },
              discriminator.type ?? nodes.numberTypeNode('u8')
            );

            return nodes.instructionNode(
              node.metadata,
              node.accounts,
              nodes.structTypeNode(node.args.name, [
                discriminatorField,
                ...node.args.fields,
              ]),
              node.extraArgs,
              node.subInstructions
            );
          },
        };
      }
    );

    super(transforms);
  }
}
