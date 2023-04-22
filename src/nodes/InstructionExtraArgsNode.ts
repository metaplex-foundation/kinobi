import { LinkTypeNode } from './LinkTypeNode';
import type { Node } from './Node';
import { StructTypeNode } from './StructTypeNode';

export type InstructionExtraArgsNode = {
  readonly __instructionExtraArgsNode: unique symbol;
  readonly nodeClass: 'InstructionExtraArgsNode';
  readonly struct: StructTypeNode;
  readonly link: LinkTypeNode | null;
};

export function instructionExtraArgsNode(
  struct: StructTypeNode,
  link?: LinkTypeNode | null
): InstructionExtraArgsNode {
  return {
    nodeClass: 'InstructionExtraArgsNode',
    struct,
    link: link ?? null,
  } as InstructionExtraArgsNode;
}

export function isInstructionExtraArgsNode(
  node: Node | null
): node is InstructionExtraArgsNode {
  return !!node && node.nodeClass === 'InstructionExtraArgsNode';
}

export function assertInstructionExtraArgsNode(
  node: Node | null
): asserts node is InstructionExtraArgsNode {
  if (!isInstructionExtraArgsNode(node)) {
    throw new Error(
      `Expected InstructionExtraArgsNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
