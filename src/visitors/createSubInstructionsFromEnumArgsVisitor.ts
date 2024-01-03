import {
  EnumTypeNode,
  InstructionNode,
  assertIsNode,
  instructionArgumentNode,
  instructionNode,
  isNode,
  numberTypeNode,
  numberValueNode,
} from '../nodes';
import { LinkableDictionary, logWarn, mainCase } from '../shared';
import {
  BottomUpNodeTransformerWithSelector,
  bottomUpTransformerVisitor,
} from './bottomUpTransformerVisitor';
import { flattenInstructionArguments } from './flattenInstructionDataArgumentsVisitor';
import { recordLinkablesVisitor } from './recordLinkablesVisitor';

export function createSubInstructionsFromEnumArgsVisitor(
  map: Record<string, string>
) {
  const linkables = new LinkableDictionary();

  const visitor = bottomUpTransformerVisitor(
    Object.entries(map).map(
      ([selector, argNameInput]): BottomUpNodeTransformerWithSelector => {
        const selectorStack = selector.split('.');
        const name = selectorStack.pop();
        return {
          select: `${selectorStack.join('.')}.[instructionNode]${name}`,
          transform: (node) => {
            assertIsNode(node, 'instructionNode');

            const argFields = node.arguments;
            const argName = mainCase(argNameInput);
            const argFieldIndex = argFields.findIndex(
              (field) => field.name === argName
            );
            const argField =
              argFieldIndex >= 0 ? argFields[argFieldIndex] : null;
            if (!argField) {
              logWarn(`Could not find instruction argument [${argName}].`);
              return node;
            }

            let argType: EnumTypeNode;
            if (isNode(argField.type, 'enumTypeNode')) {
              argType = argField.type;
            } else if (
              isNode(argField.type, 'definedTypeLinkNode') &&
              linkables.has(argField.type)
            ) {
              const linkedType = linkables.get(argField.type)?.type ?? null;
              assertIsNode(linkedType, 'enumTypeNode');
              argType = linkedType;
            } else {
              logWarn(
                `Could not find an enum type for ` +
                  `instruction argument [${argName}].`
              );
              return node;
            }

            const subInstructions = argType.variants.map(
              (variant, index): InstructionNode => {
                const subName = mainCase(`${node.name} ${variant.name}`);
                const subFields = argFields.slice(0, argFieldIndex);
                subFields.push(
                  instructionArgumentNode({
                    name: `${subName}Discriminator`,
                    type: numberTypeNode('u8'),
                    defaultValue: numberValueNode(index),
                    defaultValueStrategy: 'omitted',
                  })
                );
                if (isNode(variant, 'enumStructVariantTypeNode')) {
                  subFields.push(
                    instructionArgumentNode({
                      ...argField,
                      type: variant.struct,
                    })
                  );
                } else if (isNode(variant, 'enumTupleVariantTypeNode')) {
                  subFields.push(
                    instructionArgumentNode({
                      ...argField,
                      type: variant.tuple,
                    })
                  );
                }
                subFields.push(...argFields.slice(argFieldIndex + 1));

                return instructionNode({
                  ...node,
                  name: subName,
                  arguments: flattenInstructionArguments(subFields),
                });
              }
            );

            return instructionNode({
              ...node,
              subInstructions: [
                ...(node.subInstructions ?? []),
                ...subInstructions,
              ],
            });
          },
        };
      }
    )
  );

  return recordLinkablesVisitor(visitor, linkables);
}
