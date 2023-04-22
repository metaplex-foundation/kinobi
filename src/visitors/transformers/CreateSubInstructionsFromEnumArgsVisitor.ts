import { mainCase } from '../../utils';
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
          selector: { type: 'InstructionNode', stack: selectorStack, name },
          transformer: (node) => {
            nodes.assertInstructionNode(node);
            if (nodes.isLinkTypeNode(node.args)) return node;

            const argFields = node.args.fields;
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
            if (nodes.isEnumTypeNode(argField.type)) {
              argType = argField.type;
            } else if (
              nodes.isLinkTypeNode(argField.type) &&
              this.allDefinedTypes.has(argField.type.name)
            ) {
              const linkedType =
                this.allDefinedTypes.get(argField.type.name)?.type ?? null;
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
                  nodes.structFieldTypeNode(
                    {
                      name: `${subName}Discriminator`,
                      docs: [],
                      defaultsTo: {
                        strategy: 'omitted',
                        value: nodes.vScalar(index),
                      },
                    },
                    nodes.numberTypeNode('u8')
                  )
                );
                if (nodes.isEnumStructVariantTypeNode(variant)) {
                  subFields.push(
                    nodes.structFieldTypeNode(argField.metadata, variant.struct)
                  );
                } else if (nodes.isEnumTupleVariantTypeNode(variant)) {
                  subFields.push(
                    nodes.structFieldTypeNode(argField.metadata, variant.tuple)
                  );
                }
                subFields.push(...argFields.slice(argFieldIndex + 1));

                return nodes.instructionNode(
                  { ...node.metadata, name: subName },
                  node.accounts,
                  flattenStruct(
                    nodes.structTypeNode(`${subName}InstructionData`, subFields)
                  ),
                  node.extraArgs,
                  []
                );
              }
            );

            return nodes.instructionNode(
              node.metadata,
              node.accounts,
              node.args,
              node.extraArgs,
              [...node.subInstructions, ...subInstructions]
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
