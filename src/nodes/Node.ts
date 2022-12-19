import type { AccountNode } from './AccountNode';
import type { DefinedTypeNode } from './DefinedTypeNode';
import type { InstructionArgsNode } from './InstructionArgsNode';
import type { InstructionDiscriminatorNode } from './InstructionDiscriminatorNode';
import type { InstructionNode } from './InstructionNode';
import type { RootNode } from './RootNode';
import type { TypeNode } from './TypeNode';

export type Node =
  | RootNode
  | AccountNode
  | InstructionNode
  | InstructionArgsNode
  | InstructionDiscriminatorNode
  | DefinedTypeNode
  | TypeNode;
