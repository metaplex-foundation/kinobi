import { LinkTypeNode } from './LinkTypeNode';
import type { Node } from './Node';
import { StructTypeNode } from './StructTypeNode';

export type InstructionDataArgsNode = {
  readonly __instructionDataArgsNode: unique symbol;
  readonly kind: 'instructionDataArgsNode';
  readonly struct: StructTypeNode;
  readonly link?: LinkTypeNode;
};

export function instructionDataArgsNode(
  struct: StructTypeNode,
  link?: LinkTypeNode | null
): InstructionDataArgsNode {
  return {
    kind: 'instructionDataArgsNode',
    struct,
    link,
  } as InstructionDataArgsNode;
}

export function isInstructionDataArgsNode(
  node: Node | null
): node is InstructionDataArgsNode {
  return !!node && node.kind === 'instructionDataArgsNode';
}

export function assertInstructionDataArgsNode(
  node: Node | null
): asserts node is InstructionDataArgsNode {
  if (!isInstructionDataArgsNode(node)) {
    throw new Error(
      `Expected InstructionDataArgsNode, got ${node?.kind ?? 'null'}.`
    );
  }
}
