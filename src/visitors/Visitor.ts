import type * as nodes from '../nodes';

export interface Visitor<T = void> {
  // Root.
  visitRoot: (root: nodes.RootNode) => T;

  // Components.
  visitAccount: (account: nodes.AccountNode) => T;
  visitInstruction: (instruction: nodes.InstructionNode) => T;
  visitDefinedType: (definedType: nodes.DefinedTypeNode) => T;
  visitError: (error: nodes.ErrorNode) => T;

  // Types.
  visitTypeArray: (typeArray: nodes.TypeArrayNode) => T;
  visitTypeDefinedLink: (typeDefinedLink: nodes.TypeDefinedLinkNode) => T;
  visitTypeEnum: (typeEnum: nodes.TypeEnumNode) => T;
  visitTypeLeaf: (typeLeaf: nodes.TypeLeafNode) => T;
  visitTypeMap: (typeMap: nodes.TypeMapNode) => T;
  visitTypeOption: (typeOption: nodes.TypeOptionNode) => T;
  visitTypeSet: (typeSet: nodes.TypeSetNode) => T;
  visitTypeStruct: (typeStruct: nodes.TypeStructNode) => T;
  visitTypeTuple: (typeTuple: nodes.TypeTupleNode) => T;
  visitTypeVec: (typeVec: nodes.TypeVecNode) => T;
}
