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
  visitTypeArray: (typeArray: nodes.TypeArrayNode) => T;
  visitTypeDefinedLink: (typeDefinedLink: nodes.TypeDefinedLinkNode) => T;
  visitTypeEnum: (typeEnum: nodes.TypeEnumNode) => T;
  visitTypeEnumEmptyVariant: (
    typeEnumEmptyVariant: nodes.TypeEnumEmptyVariantNode
  ) => T;
  visitTypeEnumStructVariant: (
    typeEnumStructVariant: nodes.TypeEnumStructVariantNode
  ) => T;
  visitTypeEnumTupleVariant: (
    typeEnumTupleVariant: nodes.TypeEnumTupleVariantNode
  ) => T;
  visitTypeMap: (typeMap: nodes.TypeMapNode) => T;
  visitTypeOption: (typeOption: nodes.TypeOptionNode) => T;
  visitTypeSet: (typeSet: nodes.TypeSetNode) => T;
  visitTypeStruct: (typeStruct: nodes.TypeStructNode) => T;
  visitTypeStructField: (typeStructField: nodes.TypeStructFieldNode) => T;
  visitTypeTuple: (typeTuple: nodes.TypeTupleNode) => T;

  // Type leaves.
  visitTypeBool: (typeBool: nodes.TypeBoolNode) => T;
  visitTypeBytes: (typeBytes: nodes.TypeBytesNode) => T;
  visitTypeNumber: (typeNumber: nodes.TypeNumberNode) => T;
  visitTypeNumberWrapper: (typeNumberWrapper: nodes.TypeNumberWrapperNode) => T;
  visitTypePublicKey: (typePublicKey: nodes.TypePublicKeyNode) => T;
  visitTypeString: (typeString: nodes.TypeStringNode) => T;
}
