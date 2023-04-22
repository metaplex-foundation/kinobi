import { LinkTypeNode } from './LinkTypeNode';
import type { Node } from './Node';
import { StructTypeNode } from './StructTypeNode';

export type InstructionExtraArgsNode = {
  readonly __instructionExtraArgsNode: unique symbol;
  readonly nodeClass: 'InstructionExtraArgsNode';
  readonly structNode: StructTypeNode;
  readonly linkNode: LinkTypeNode | null;
};

export function instructionExtraArgsNode(
  structNode: StructTypeNode,
  linkNode?: LinkTypeNode | null
): InstructionExtraArgsNode {
  return {
    nodeClass: 'InstructionExtraArgsNode',
    structNode,
    linkNode: linkNode ?? null,
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
