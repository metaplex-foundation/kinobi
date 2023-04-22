import { LinkTypeNode } from './LinkTypeNode';
import type { Node } from './Node';
import { StructTypeNode } from './StructTypeNode';

export type InstructionDataArgsNode = {
  readonly __instructionDataArgsNode: unique symbol;
  readonly nodeClass: 'instructionDataArgsNode';
  readonly struct: StructTypeNode;
  readonly link?: LinkTypeNode;
};

export function instructionDataArgsNode(
  struct: StructTypeNode,
  link?: LinkTypeNode | null
): InstructionDataArgsNode {
  return {
    nodeClass: 'instructionDataArgsNode',
    struct,
    link,
  } as InstructionDataArgsNode;
}

export function isInstructionDataArgsNode(
  node: Node | null
): node is InstructionDataArgsNode {
  return !!node && node.nodeClass === 'instructionDataArgsNode';
}

export function assertInstructionDataArgsNode(
  node: Node | null
): asserts node is InstructionDataArgsNode {
  if (!isInstructionDataArgsNode(node)) {
    throw new Error(
      `Expected InstructionDataArgsNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
