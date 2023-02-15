import * as nodes from '../../nodes';
import { NodeTransform, TransformNodesVisitor } from './TransformNodesVisitor';

type Discriminator = {
  value: nodes.ValueNode;
  /** @defaultValue `new TypeLeafNode('u32')` */
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
          selector: { type: 'instruction', stack, name },
          transformer: (node) => {
            nodes.assertInstructionNode(node);
            const discriminatorField = new nodes.TypeStructFieldNode(
              {
                name: discriminator.name ?? 'discriminator',
                docs: discriminator.docs ?? [],
                defaultsTo: {
                  strategy: discriminator.strategy ?? 'omitted',
                  value: discriminator.value,
                },
              },
              discriminator.type ?? nodes.TypeLeafNode.fromIdl('u8')
            );

            return new nodes.InstructionNode(
              node.metadata,
              node.accounts,
              new nodes.TypeStructNode(node.args.name, [
                discriminatorField,
                ...node.args.fields,
              ]),
              node.subInstructions
            );
          },
        };
      }
    );

    super(transforms);
  }
}
