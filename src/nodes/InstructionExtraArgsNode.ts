import { LinkTypeNode } from './LinkTypeNode';
import type { Node } from './Node';
import { StructTypeNode } from './StructTypeNode';

export type InstructionExtraArgsNode = {
  readonly __instructionExtraArgsNode: unique symbol;
  readonly kind: 'instructionExtraArgsNode';
  readonly struct: StructTypeNode;
  readonly link?: LinkTypeNode;
};

export function instructionExtraArgsNode(
  struct: StructTypeNode,
  link?: LinkTypeNode | null
): InstructionExtraArgsNode {
  return {
    kind: 'instructionExtraArgsNode',
    struct,
    link,
  } as InstructionExtraArgsNode;
}

export function isInstructionExtraArgsNode(
  node: Node | null
): node is InstructionExtraArgsNode {
  return !!node && node.kind === 'instructionExtraArgsNode';
}

export function assertInstructionExtraArgsNode(
  node: Node | null
): asserts node is InstructionExtraArgsNode {
  if (!isInstructionExtraArgsNode(node)) {
    throw new Error(
      `Expected InstructionExtraArgsNode, got ${node?.kind ?? 'null'}.`
    );
  }
}
