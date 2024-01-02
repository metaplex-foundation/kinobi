import {
  ProgramNode,
  accountDataNode,
  accountNode,
  arrayTypeNode,
  fixedSizeNode,
  instructionArgumentNode,
  instructionDataArgsNode,
  instructionNode,
  numberTypeNode,
  structFieldTypeNode,
  structTypeNode,
} from '../nodes';
import {
  fieldAccountDiscriminator,
  getAnchorAccountDiscriminator,
  getAnchorInstructionDiscriminator,
  pipe,
} from '../shared';
import { extendVisitor } from './extendVisitor';
import { identityVisitor } from './identityVisitor';

export function setAnchorDiscriminatorsVisitor() {
  let program: ProgramNode | null = null;
  return pipe(
    identityVisitor([
      'rootNode',
      'programNode',
      'accountNode',
      'instructionNode',
    ]),
    (v) =>
      extendVisitor(v, {
        visitProgram(node, { next }) {
          program = node;
          const newNode = next(node);
          program = null;
          return newNode;
        },

        visitAccount(node) {
          const shouldAddDiscriminator = program?.origin === 'anchor';
          if (!shouldAddDiscriminator) return node;

          const discriminatorArgument = structFieldTypeNode({
            name: 'discriminator',
            type: arrayTypeNode(numberTypeNode('u8'), fixedSizeNode(8)),
            defaultValue: getAnchorAccountDiscriminator(node.idlName),
            defaultValueStrategy: 'omitted',
          });

          return accountNode({
            ...node,
            discriminator: fieldAccountDiscriminator('discriminator'),
            data: accountDataNode({
              ...node.data,
              struct: structTypeNode([
                discriminatorArgument,
                ...node.data.struct.fields,
              ]),
            }),
          });
        },

        visitInstruction(node) {
          const shouldAddDiscriminator = program?.origin === 'anchor';
          if (!shouldAddDiscriminator) return node;

          const discriminatorArgument = instructionArgumentNode({
            name: 'discriminator',
            type: arrayTypeNode(numberTypeNode('u8'), fixedSizeNode(8)),
            defaultValue: getAnchorInstructionDiscriminator(node.idlName),
            defaultValueStrategy: 'omitted',
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
      })
  );
}
