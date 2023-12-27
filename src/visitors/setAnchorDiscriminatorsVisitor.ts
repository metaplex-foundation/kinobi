import {
  ProgramNode,
  accountDataNode,
  accountNode,
  arrayTypeNode,
  instructionDataArgsNode,
  instructionNode,
  numberTypeNode,
  structFieldTypeNode,
  structTypeNode,
} from '../nodes';
import {
  fieldAccountDiscriminator,
  fixedSize,
  getAnchorAccountDiscriminator,
  getAnchorInstructionDiscriminator,
} from '../shared';
import { identityVisitor } from './identityVisitor';

export function setAnchorDiscriminatorsVisitor() {
  let program: ProgramNode | null = null;
  const visitor = identityVisitor([
    'rootNode',
    'programNode',
    'accountNode',
    'instructionNode',
  ]);

  const baseVisitor = { ...visitor };

  visitor.visitProgram = (node) => {
    program = node;
    const newNode = baseVisitor.visitProgram(node);
    program = null;
    return newNode;
  };

  visitor.visitAccount = (node) => {
    const shouldAddDiscriminator = program?.origin === 'anchor';
    if (!shouldAddDiscriminator) return node;

    const discriminatorField = structFieldTypeNode({
      name: 'discriminator',
      child: arrayTypeNode(numberTypeNode('u8'), {
        size: fixedSize(8),
      }),
      defaultsTo: {
        strategy: 'omitted',
        value: getAnchorAccountDiscriminator(node.idlName),
      },
    });

    return accountNode({
      ...node,
      discriminator: fieldAccountDiscriminator('discriminator'),
      data: accountDataNode({
        ...node.data,
        struct: structTypeNode([
          discriminatorField,
          ...node.data.struct.fields,
        ]),
      }),
    });
  };

  visitor.visitInstruction = (node) => {
    const shouldAddDiscriminator = program?.origin === 'anchor';
    if (!shouldAddDiscriminator) return node;

    const discriminatorField = structFieldTypeNode({
      name: 'discriminator',
      child: arrayTypeNode(numberTypeNode('u8'), {
        size: fixedSize(8),
      }),
      defaultsTo: {
        strategy: 'omitted',
        value: getAnchorInstructionDiscriminator(node.idlName),
      },
    });

    return instructionNode({
      ...node,
      dataArgs: instructionDataArgsNode({
        ...node.dataArgs,
        struct: structTypeNode([
          discriminatorField,
          ...node.dataArgs.struct.fields,
        ]),
      }),
    });
  };

  return visitor;
}
