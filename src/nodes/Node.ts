import type { AccountNode } from './AccountNode';
import type { DefinedTypeNode } from './DefinedTypeNode';
import type { ErrorNode } from './ErrorNode';
import type { InstructionNode } from './InstructionNode';
import type { ProgramNode } from './ProgramNode';
import type { RootNode } from './RootNode';
import type { TypeNode } from './TypeNode';

export type Node =
  | RootNode
  | ProgramNode
  | AccountNode
  | InstructionNode
  | ErrorNode
  | DefinedTypeNode
  | TypeNode;
