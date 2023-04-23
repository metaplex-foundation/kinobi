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
          selector: { kind: 'instructionNode', stack, name },
          transformer: (node) => {
            nodes.assertInstructionNode(node);
            const discriminatorField = nodes.structFieldTypeNode({
              name: discriminator.name ?? 'discriminator',
              child: discriminator.type ?? nodes.numberTypeNode('u8'),
              docs: discriminator.docs ?? [],
              defaultsTo: {
                strategy: discriminator.strategy ?? 'omitted',
                value: discriminator.value,
              },
            });

            return nodes.instructionNode({
              ...node,
              dataArgs: nodes.instructionDataArgsNode({
                ...node.dataArgs,
                struct: nodes.structTypeNode([
                  discriminatorField,
                  ...node.dataArgs.struct.fields,
                ]),
              }),
            });
          },
        };
      }
    );

    super(transforms);
  }
}
