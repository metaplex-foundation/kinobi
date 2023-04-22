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
  visitTypeArray: (typeArray: nodes.ArrayTypeNode) => T;
  visitTypeDefinedLink: (typeDefinedLink: nodes.LinkTypeNode) => T;
  visitTypeEnum: (typeEnum: nodes.EnumTypeNode) => T;
  visitTypeEnumEmptyVariant: (
    typeEnumEmptyVariant: nodes.EnumEmptyVariantTypeNode
  ) => T;
  visitTypeEnumStructVariant: (
    typeEnumStructVariant: nodes.EnumStructVariantTypeNode
  ) => T;
  visitTypeEnumTupleVariant: (
    typeEnumTupleVariant: nodes.EnumTupleVariantTypeNode
  ) => T;
  visitTypeMap: (typeMap: nodes.MapTypeNode) => T;
  visitTypeOption: (typeOption: nodes.OptionTypeNode) => T;
  visitTypeSet: (typeSet: nodes.SetTypeNode) => T;
  visitTypeStruct: (typeStruct: nodes.StructTypeNode) => T;
  visitTypeStructField: (typeStructField: nodes.StructFieldTypeNode) => T;
  visitTypeTuple: (typeTuple: nodes.TupleTypeNode) => T;

  // Type leaves.
  visitTypeBool: (typeBool: nodes.BoolTypeNode) => T;
  visitTypeBytes: (typeBytes: nodes.BytesTypeNode) => T;
  visitTypeNumber: (typeNumber: nodes.NumberTypeNode) => T;
  visitTypeNumberWrapper: (typeNumberWrapper: nodes.NumberWrapperTypeNode) => T;
  visitTypePublicKey: (typePublicKey: nodes.PublicKeyTypeNode) => T;
  visitTypeString: (typeString: nodes.StringTypeNode) => T;
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
      return visitor.visitTypeArray(node);
    case 'linkTypeNode':
      return visitor.visitTypeDefinedLink(node);
    case 'enumTypeNode':
      return visitor.visitTypeEnum(node);
    case 'enumEmptyVariantTypeNode':
      return visitor.visitTypeEnumEmptyVariant(node);
    case 'enumStructVariantTypeNode':
      return visitor.visitTypeEnumStructVariant(node);
    case 'enumTupleVariantTypeNode':
      return visitor.visitTypeEnumTupleVariant(node);
    case 'mapTypeNode':
      return visitor.visitTypeMap(node);
    case 'optionTypeNode':
      return visitor.visitTypeOption(node);
    case 'setTypeNode':
      return visitor.visitTypeSet(node);
    case 'structTypeNode':
      return visitor.visitTypeStruct(node);
    case 'structFieldTypeNode':
      return visitor.visitTypeStructField(node);
    case 'tupleTypeNode':
      return visitor.visitTypeTuple(node);
    case 'boolTypeNode':
      return visitor.visitTypeBool(node);
    case 'bytesTypeNode':
      return visitor.visitTypeBytes(node);
    case 'numberTypeNode':
      return visitor.visitTypeNumber(node);
    case 'numberWrapperTypeNode':
      return visitor.visitTypeNumberWrapper(node);
    case 'publicKeyTypeNode':
      return visitor.visitTypePublicKey(node);
    case 'stringTypeNode':
      return visitor.visitTypeString(node);
    default:
      const nodeAsNever: never = node;
      throw new KinobiError(`Unrecognized node [${(nodeAsNever as any).kind}]`);
  }
}
