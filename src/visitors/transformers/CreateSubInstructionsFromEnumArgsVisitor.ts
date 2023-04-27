import { mainCase } from '../../shared';
import { logWarn } from '../../shared/logs';
import * as nodes from '../../nodes';
import { NodeTransform, TransformNodesVisitor } from './TransformNodesVisitor';
import { flattenStruct } from './FlattenStructVisitor';

export class CreateSubInstructionsFromEnumArgsVisitor extends TransformNodesVisitor {
  protected allDefinedTypes = new Map<string, nodes.DefinedTypeNode>();

  constructor(readonly map: Record<string, string>) {
    const transforms = Object.entries(map).map(
      ([selector, argNameInput]): NodeTransform => {
        const selectorStack = selector.split('.');
        const name = selectorStack.pop();
        return {
          selector: { kind: 'instructionNode', stack: selectorStack, name },
          transformer: (node) => {
            nodes.assertInstructionNode(node);

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

            let argType: nodes.EnumTypeNode;
            if (nodes.isEnumTypeNode(argField.child)) {
              argType = argField.child;
            } else if (
              nodes.isLinkTypeNode(argField.child) &&
              this.allDefinedTypes.has(argField.child.name)
            ) {
              const linkedType =
                this.allDefinedTypes.get(argField.child.name)?.data ?? null;
              nodes.assertEnumTypeNode(linkedType);
              argType = linkedType;
            } else {
              logWarn(
                `Could not find an enum type for ` +
                  `instruction argument [${argName}].`
              );
              return node;
            }

            const subInstructions = argType.variants.map(
              (variant, index): nodes.InstructionNode => {
                const subName = mainCase(`${node.name} ${variant.name}`);
                const subFields = argFields.slice(0, argFieldIndex);
                subFields.push(
                  nodes.structFieldTypeNode({
                    name: `${subName}Discriminator`,
                    child: nodes.numberTypeNode('u8'),
                    defaultsTo: {
                      strategy: 'omitted',
                      value: nodes.vScalar(index),
                    },
                  })
                );
                if (nodes.isEnumStructVariantTypeNode(variant)) {
                  subFields.push(
                    nodes.structFieldTypeNode({
                      ...argField,
                      child: variant.struct,
                    })
                  );
                } else if (nodes.isEnumTupleVariantTypeNode(variant)) {
                  subFields.push(
                    nodes.structFieldTypeNode({
                      ...argField,
                      child: variant.tuple,
                    })
                  );
                }
                subFields.push(...argFields.slice(argFieldIndex + 1));

                return nodes.instructionNode({
                  ...node,
                  name: subName,
                  dataArgs: nodes.instructionDataArgsNode({
                    ...node.dataArgs,
                    name: `${subName}InstructionData`,
                    struct: flattenStruct(nodes.structTypeNode(subFields)),
                  }),
                  extraArgs: nodes.instructionExtraArgsNode({
                    ...node.extraArgs,
                    name: `${subName}InstructionExtra`,
                  }),
                });
              }
            );

            return nodes.instructionNode({
              ...node,
              subInstructions: [...node.subInstructions, ...subInstructions],
            });
          },
        };
      }
    );

    super(transforms);
  }

  visitRoot(root: nodes.RootNode): nodes.Node | null {
    nodes.getAllDefinedTypes(root).forEach((type) => {
      this.allDefinedTypes.set(type.name, type);
    });
    return super.visitRoot(root);
  }
}
