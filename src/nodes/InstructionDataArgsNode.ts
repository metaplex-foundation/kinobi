import { LinkTypeNode } from './LinkTypeNode';
import type { Node } from './Node';
import { StructTypeNode } from './StructTypeNode';

export type InstructionDataArgsNode = {
  readonly __instructionDataArgsNode: unique symbol;
  readonly nodeClass: 'InstructionDataArgsNode';
  readonly structNode: StructTypeNode;
  readonly linkNode: LinkTypeNode | null;
};

export function instructionDataArgsNode(
  structNode: StructTypeNode,
  linkNode?: LinkTypeNode | null
): InstructionDataArgsNode {
  return {
    nodeClass: 'InstructionDataArgsNode',
    structNode,
    linkNode: linkNode ?? null,
  } as InstructionDataArgsNode;
}

export function isInstructionDataArgsNode(
  node: Node | null
): node is InstructionDataArgsNode {
  return !!node && node.nodeClass === 'InstructionDataArgsNode';
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
