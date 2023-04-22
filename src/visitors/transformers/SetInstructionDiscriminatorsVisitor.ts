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
            const discriminatorField = new nodes.StructFieldTypeNode(
              {
                name: discriminator.name ?? 'discriminator',
                docs: discriminator.docs ?? [],
                defaultsTo: {
                  strategy: discriminator.strategy ?? 'omitted',
                  value: discriminator.value,
                },
              },
              discriminator.type ?? new nodes.NumberTypeNode('u8')
            );

            return new nodes.InstructionNode(
              node.metadata,
              node.accounts,
              new nodes.StructTypeNode(node.args.name, [
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
