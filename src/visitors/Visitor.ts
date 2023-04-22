import { KinobiError } from '../shared';
import type * as nodes from '../nodes';

export interface Visitor<T = void> {
  // Roots.
  visitRoot: (root: nodes.RootNode) => T;
  visitProgram: (program: nodes.ProgramNode) => T;

  // Components.
  visitAccount: (account: nodes.AccountNode) => T;
  visitAccountData: (accountData: nodes.AccountDataNode) => T;
  visitInstruction: (instruction: nodes.InstructionNode) => T;
  visitInstructionAccount: (
    instructionAccount: nodes.InstructionAccountNode
  ) => T;
  visitInstructionDataArgs: (
    instructionDataArgs: nodes.InstructionDataArgsNode
  ) => T;
  visitInstructionExtraArgs: (
    instructionExtraArgs: nodes.InstructionExtraArgsNode
  ) => T;
  visitDefinedType: (definedType: nodes.DefinedTypeNode) => T;
  visitError: (error: nodes.ErrorNode) => T;

  // Types.
  visitArrayType: (arrayType: nodes.ArrayTypeNode) => T;
  visitLinkType: (definedLinkType: nodes.LinkTypeNode) => T;
  visitEnumType: (enumType: nodes.EnumTypeNode) => T;
  visitEnumEmptyVariantType: (
    enumEmptyVariantType: nodes.EnumEmptyVariantTypeNode
  ) => T;
  visitEnumStructVariantType: (
    enumStructVariantType: nodes.EnumStructVariantTypeNode
  ) => T;
  visitEnumTupleVariantType: (
    enumTupleVariantType: nodes.EnumTupleVariantTypeNode
  ) => T;
  visitMapType: (mapType: nodes.MapTypeNode) => T;
  visitOptionType: (optionType: nodes.OptionTypeNode) => T;
  visitSetType: (setType: nodes.SetTypeNode) => T;
  visitStructType: (structType: nodes.StructTypeNode) => T;
  visitStructFieldType: (structFieldType: nodes.StructFieldTypeNode) => T;
  visitTupleType: (tupleType: nodes.TupleTypeNode) => T;

  // Type leaves.
  visitBoolType: (boolType: nodes.BoolTypeNode) => T;
  visitBytesType: (bytesType: nodes.BytesTypeNode) => T;
  visitNumberType: (numberType: nodes.NumberTypeNode) => T;
  visitNumberWrapperType: (numberWrapperType: nodes.NumberWrapperTypeNode) => T;
  visitPublicKeyType: (publicKeyType: nodes.PublicKeyTypeNode) => T;
  visitStringType: (stringType: nodes.StringTypeNode) => T;
}

export function visit<T>(node: nodes.Node, visitor: Visitor<T>): T {
  switch (node.kind) {
    case 'rootNode':
      return visitor.visitRoot(node);
    case 'programNode':
      return visitor.visitProgram(node);
    case 'accountNode':
      return visitor.visitAccount(node);
    case 'accountDataNode':
      return visitor.visitAccountData(node);
    case 'instructionNode':
      return visitor.visitInstruction(node);
    case 'instructionAccountNode':
      return visitor.visitInstructionAccount(node);
    case 'instructionDataArgsNode':
      return visitor.visitInstructionDataArgs(node);
    case 'instructionExtraArgsNode':
      return visitor.visitInstructionExtraArgs(node);
    case 'definedTypeNode':
      return visitor.visitDefinedType(node);
    case 'errorNode':
      return visitor.visitError(node);
    case 'arrayTypeNode':
      return visitor.visitArrayType(node);
    case 'linkTypeNode':
      return visitor.visitLinkType(node);
    case 'enumTypeNode':
      return visitor.visitEnumType(node);
    case 'enumEmptyVariantTypeNode':
      return visitor.visitEnumEmptyVariantType(node);
    case 'enumStructVariantTypeNode':
      return visitor.visitEnumStructVariantType(node);
    case 'enumTupleVariantTypeNode':
      return visitor.visitEnumTupleVariantType(node);
    case 'mapTypeNode':
      return visitor.visitMapType(node);
    case 'optionTypeNode':
      return visitor.visitOptionType(node);
    case 'setTypeNode':
      return visitor.visitSetType(node);
    case 'structTypeNode':
      return visitor.visitStructType(node);
    case 'structFieldTypeNode':
      return visitor.visitStructFieldType(node);
    case 'tupleTypeNode':
      return visitor.visitTupleType(node);
    case 'boolTypeNode':
      return visitor.visitBoolType(node);
    case 'bytesTypeNode':
      return visitor.visitBytesType(node);
    case 'numberTypeNode':
      return visitor.visitNumberType(node);
    case 'numberWrapperTypeNode':
      return visitor.visitNumberWrapperType(node);
    case 'publicKeyTypeNode':
      return visitor.visitPublicKeyType(node);
    case 'stringTypeNode':
      return visitor.visitStringType(node);
    default:
      const nodeAsNever: never = node;
      throw new KinobiError(`Unrecognized node [${(nodeAsNever as any).kind}]`);
  }
}
