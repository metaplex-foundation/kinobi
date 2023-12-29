import type { AccountDataNode } from './AccountDataNode';
import type { AccountNode } from './AccountNode';
import type { DefinedTypeNode } from './DefinedTypeNode';
import type { ErrorNode } from './ErrorNode';
import type { InstructionAccountNode } from './InstructionAccountNode';
import type { InstructionDataArgsNode } from './InstructionDataArgsNode';
import type { InstructionExtraArgsNode } from './InstructionExtraArgsNode';
import type { InstructionNode } from './InstructionNode';
import type { ProgramNode } from './ProgramNode';
import type { RootNode } from './RootNode';
import { REGISTERED_SIZE_NODES } from './sizeNodes';
import { REGISTERED_TYPE_NODES } from './typeNodes';

const REGISTERED_NODES = {
  rootNode: {} as RootNode,
  programNode: {} as ProgramNode,
  accountNode: {} as AccountNode,
  accountDataNode: {} as AccountDataNode,
  instructionNode: {} as InstructionNode,
  instructionAccountNode: {} as InstructionAccountNode,
  instructionDataArgsNode: {} as InstructionDataArgsNode,
  instructionExtraArgsNode: {} as InstructionExtraArgsNode,
  errorNode: {} as ErrorNode,
  definedTypeNode: {} as DefinedTypeNode,

  // Groups.
  ...REGISTERED_TYPE_NODES,
  ...REGISTERED_SIZE_NODES,
};

export const REGISTERED_NODES_KEYS = Object.keys(
  REGISTERED_NODES
) as (keyof RegisteredNodes)[];

export type RegisteredNodes = typeof REGISTERED_NODES;

export type Node = RegisteredNodes[keyof RegisteredNodes];

export const assertNodeFilter =
  <T extends Node>(
    assertCallback: (node: Node | null) => asserts node is T
  ): ((node: Node | null | null) => node is T) =>
  (node): node is T => {
    assertCallback(node);
    return true;
  };

export const removeNullAndAssertNodeFilter =
  <T extends Node>(
    assertCallback: (node: Node | null) => asserts node is T
  ): ((node: Node | null) => node is T) =>
  (node): node is T => {
    if (node) assertCallback(node);
    return node !== null;
  };
