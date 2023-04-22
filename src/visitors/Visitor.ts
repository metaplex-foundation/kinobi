import type * as nodes from '../nodes';

export interface Visitor<T = void> {
  // Roots.
  visitRoot: (root: nodes.RootNode) => T;
  visitProgram: (program: nodes.ProgramNode) => T;

  // Components.
  visitAccount: (account: nodes.AccountNode) => T;
  visitInstruction: (instruction: nodes.InstructionNode) => T;
  visitDefinedType: (definedType: nodes.DefinedTypeNode) => T;
  visitError: (error: nodes.ErrorNode) => T;

  // Types.
  visitTypeArray: (typeArray: nodes.ArrayTypeNode) => T;
  visitTypeDefinedLink: (typeDefinedLink: nodes.DefinedLinkTypeNode) => T;
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
