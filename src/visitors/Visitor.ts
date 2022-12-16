import type {
  AccountNode,
  InstructionNode,
  RootNode,
  TypeDefinedNode,
  TypeScalarNode,
} from 'src/nodes';

export interface Visitor {
  visitRoot: (root: RootNode) => void;
  visitAccount: (account: AccountNode) => void;
  visitInstruction: (instruction: InstructionNode) => void;
  visitTypeScalar: (typeScalar: TypeScalarNode) => void;
  visitTypeDefined: (typeDefined: TypeDefinedNode) => void;
}
