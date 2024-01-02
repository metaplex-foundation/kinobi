import {
  TypeNode,
  ValueNode,
  assertIsNode,
  instructionArgumentNode,
  instructionDataArgsNode,
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
      ([selectorStack, discriminator]): BottomUpNodeTransformerWithSelector => {
        const stack = selectorStack.split('.');
        const name = stack.pop();
        return {
          select: `${stack.join('.')}.[instructionNode]${name}`,
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
              dataArgs: instructionDataArgsNode({
                ...node.dataArgs,
                dataArguments: [
                  discriminatorArgument,
                  ...node.dataArgs.dataArguments,
                ],
              }),
            });
          },
        };
      }
    )
  );
}
