import {
  ProgramNode,
  accountNode,
  arrayTypeNode,
  fieldDiscriminatorNode,
  fixedSizeNode,
  instructionArgumentNode,
  instructionNode,
  numberTypeNode,
  structFieldTypeNode,
  structTypeNode,
} from '../nodes';
import {
  getAnchorAccountDiscriminator,
  getAnchorInstructionDiscriminator,
  pipe,
} from '../shared';
import { extendVisitor } from './extendVisitor';
import { nonNullableIdentityVisitor } from './nonNullableIdentityVisitor';

export function setAnchorDiscriminatorsVisitor() {
  let program: ProgramNode | null = null;
  return pipe(
    nonNullableIdentityVisitor([
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
            discriminators: [
              fieldDiscriminatorNode('discriminator'),
              ...(node.discriminators ?? []),
            ],
            data: structTypeNode([discriminatorArgument, ...node.data.fields]),
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
            discriminators: [
              fieldDiscriminatorNode('discriminator'),
              ...(node.discriminators ?? []),
            ],
            arguments: [discriminatorArgument, ...node.arguments],
          });
        },
      })
  );
}
