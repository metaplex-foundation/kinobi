import type * as nodes from '../nodes';

export interface Visitor {
  // Root.
  visitRoot: (root: nodes.RootNode) => void;

  // Components.
  visitAccount: (account: nodes.AccountNode) => void;
  visitInstruction: (instruction: nodes.InstructionNode) => void;
  visitDefinedType: (definedType: nodes.DefinedTypeNode) => void;

  // Types.
  visitTypeArray: (typeArray: nodes.TypeArrayNode) => void;
  visitTypeDefinedLink: (typeDefinedLink: nodes.TypeDefinedLinkNode) => void;
  visitTypeEnum: (typeEnum: nodes.TypeEnumNode) => void;
  visitTypeLeaf: (typeLeaf: nodes.TypeLeafNode) => void;
  visitTypeMap: (typeMap: nodes.TypeMapNode) => void;
  visitTypeOption: (typeOption: nodes.TypeOptionNode) => void;
  visitTypeSet: (typeSet: nodes.TypeSetNode) => void;
  visitTypeStruct: (typeStruct: nodes.TypeStructNode) => void;
  visitTypeTuple: (typeTuple: nodes.TypeTupleNode) => void;
  visitTypeVec: (typeVec: nodes.TypeVecNode) => void;
}
