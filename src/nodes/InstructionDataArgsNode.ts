import { InvalidKinobiTreeError, mainCase } from '../shared';
import { LinkTypeNode } from './LinkTypeNode';
import type { Node } from './Node';
import { StructTypeNode } from './StructTypeNode';

export type InstructionDataArgsNode = {
  readonly __instructionDataArgsNode: unique symbol;
  readonly kind: 'instructionDataArgsNode';
  readonly name: string;
  readonly struct: StructTypeNode;
  readonly link?: LinkTypeNode;
};

export type InstructionDataArgsNodeInput = Omit<
  InstructionDataArgsNode,
  '__instructionDataArgsNode' | 'kind'
>;

export function instructionDataArgsNode(
  input: InstructionDataArgsNodeInput
): InstructionDataArgsNode {
  if (!input.name) {
    throw new InvalidKinobiTreeError(
      'InstructionDataArgsNode must have a name.'
    );
  }
  return {
    kind: 'instructionDataArgsNode',
    name: mainCase(input.name),
    struct: input.struct,
    link: input.link,
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
      `Expected instructionDataArgsNode, got ${node?.kind ?? 'null'}.`
    );
  }
}
