import type { AccountNode } from './AccountNode';
import type { DefinedTypeNode } from './DefinedTypeNode';
import type { ErrorNode } from './ErrorNode';
import type { InstructionNode } from './InstructionNode';
import type { ProgramNode } from './ProgramNode';
import type { RootNode } from './RootNode';
import type { EnumVariantTypeNode } from './EnumVariantTypeNode';
import type { TypeNode } from './TypeNode';
import type { StructFieldTypeNode } from './StructFieldTypeNode';

export type Node =
  | RootNode
  | ProgramNode
  | AccountNode
  | InstructionNode
  | ErrorNode
  | DefinedTypeNode
  | TypeNode
  // The following are not in `TypeNode`
  // as they are not valid standalone types.
  | StructFieldTypeNode
  | EnumVariantTypeNode;

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
  ): ((node: Node | null | null) => node is T) =>
  (node): node is T => {
    if (node) assertCallback(node);
    return node !== null;
  };
