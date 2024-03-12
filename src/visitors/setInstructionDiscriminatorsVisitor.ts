import {
  TypeNode,
  ValueNode,
  assertIsNode,
  fieldDiscriminatorNode,
  instructionArgumentNode,
  instructionNode,
  numberTypeNode,
} from '../nodes';
import {
  BottomUpNodeTransformerWithSelector,
  bottomUpTransformerVisitor,
} from './bottomUpTransformerVisitor';

type Discriminator = {
  value: ValueNode;
  /** @defaultValue `numberTypeNode('u8')` */
  type?: TypeNode;
  /** @defaultValue `"discriminator"` */
  name?: string;
  /** @defaultValue `"omitted"` */
  strategy?: 'optional' | 'omitted';
  /** @defaultValue `[]` */
  docs?: string[];
};

export function setInstructionDiscriminatorsVisitor(
  map: Record<string, Discriminator>
) {
  return bottomUpTransformerVisitor(
    Object.entries(map).map(
      ([selector, discriminator]): BottomUpNodeTransformerWithSelector => ({
        select: ['[instructionNode]', selector],
        transform: (node) => {
          assertIsNode(node, 'instructionNode');
          const discriminatorArgument = instructionArgumentNode({
            name: discriminator.name ?? 'discriminator',
            type: discriminator.type ?? numberTypeNode('u8'),
            docs: discriminator.docs ?? [],
            defaultValue: discriminator.value,
            defaultValueStrategy: discriminator.strategy ?? 'omitted',
          });

          return instructionNode({
            ...node,
            discriminators: [
              fieldDiscriminatorNode(discriminator.name ?? 'discriminator'),
              ...(node.discriminators ?? []),
            ],
            arguments: [discriminatorArgument, ...node.arguments],
          });
        },
      })
    )
  );
}
