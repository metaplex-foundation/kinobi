import {
  DefinedTypeNode,
  EnumTypeNode,
  InstructionNode,
  assertInstructionNode,
  assertIsNode,
  instructionDataArgsNode,
  instructionExtraArgsNode,
  instructionNode,
  isNode,
  numberTypeNode,
  numberValueNode,
  structFieldTypeNode,
  structTypeNode,
} from '../nodes';
import { logWarn, mainCase } from '../shared';
import {
  BottomUpNodeTransformerWithSelector,
  bottomUpTransformerVisitor,
} from './bottomUpTransformerVisitor';
import { flattenStruct } from './flattenStructVisitor';
import { tapDefinedTypesVisitor } from './tapVisitor';

export function createSubInstructionsFromEnumArgsVisitor(
  map: Record<string, string>
) {
  let definedTypesMap = new Map<string, DefinedTypeNode>();

  const visitor = bottomUpTransformerVisitor(
    Object.entries(map).map(
      ([selector, argNameInput]): BottomUpNodeTransformerWithSelector => {
        const selectorStack = selector.split('.');
        const name = selectorStack.pop();
        return {
          select: `${selectorStack.join('.')}.[instructionNode]${name}`,
          transform: (node) => {
            assertInstructionNode(node);

            const argFields = node.dataArgs.struct.fields;
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
            if (isNode(argField.child, 'enumTypeNode')) {
              argType = argField.child;
            } else if (
              isNode(argField.child, 'linkTypeNode') &&
              definedTypesMap.has(argField.child.name)
            ) {
              const linkedType =
                definedTypesMap.get(argField.child.name)?.data ?? null;
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
                  structFieldTypeNode({
                    name: `${subName}Discriminator`,
                    child: numberTypeNode('u8'),
                    defaultsTo: {
                      strategy: 'omitted',
                      value: numberValueNode(index),
                    },
                  })
                );
                if (isNode(variant, 'enumStructVariantTypeNode')) {
                  subFields.push(
                    structFieldTypeNode({
                      ...argField,
                      child: variant.struct,
                    })
                  );
                } else if (isNode(variant, 'enumTupleVariantTypeNode')) {
                  subFields.push(
                    structFieldTypeNode({
                      ...argField,
                      child: variant.tuple,
                    })
                  );
                }
                subFields.push(...argFields.slice(argFieldIndex + 1));

                return instructionNode({
                  ...node,
                  name: subName,
                  dataArgs: instructionDataArgsNode({
                    ...node.dataArgs,
                    name: `${subName}InstructionData`,
                    struct: flattenStruct(structTypeNode(subFields)),
                  }),
                  extraArgs: instructionExtraArgsNode({
                    ...node.extraArgs,
                    name: `${subName}InstructionExtra`,
                  }),
                });
              }
            );

            return instructionNode({
              ...node,
              subInstructions: [...node.subInstructions, ...subInstructions],
            });
          },
        };
      }
    )
  );

  return tapDefinedTypesVisitor(visitor, (definedTypes) => {
    definedTypesMap = new Map<string, DefinedTypeNode>(
      definedTypes.map((type) => [type.name, type])
    );
  });
}
