import type {
  AccountNode,
  DefinedTypeNode,
  InstructionNode,
  RootNode,
  TypeDefinedLinkNode,
  TypeLeafNode,
  TypeStructNode,
} from 'src/nodes';

export interface Visitor {
  // Root.
  visitRoot: (root: RootNode) => void;

  // Components.
  visitAccount: (account: AccountNode) => void;
  visitInstruction: (instruction: InstructionNode) => void;
  visitDefinedType: (definedType: DefinedTypeNode) => void;

  // Types.
  visitTypeDefinedLink: (typeDefinedLink: TypeDefinedLinkNode) => void;
  visitTypeLeaf: (typeLeaf: TypeLeafNode) => void;
  visitTypeStruct: (typeStruct: TypeStructNode) => void;
}
