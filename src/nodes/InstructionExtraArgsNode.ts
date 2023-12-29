import { InvalidKinobiTreeError, MainCaseString, mainCase } from '../shared';
import { LinkTypeNode } from './typeNodes/LinkTypeNode';
import type { Node } from './Node';
import { StructTypeNode } from './typeNodes/StructTypeNode';

export type InstructionExtraArgsNode = {
  readonly kind: 'instructionExtraArgsNode';
  readonly name: MainCaseString;
  readonly struct: StructTypeNode;
  readonly link?: LinkTypeNode;
};

export type InstructionExtraArgsNodeInput = Omit<
  InstructionExtraArgsNode,
  'kind' | 'name'
> & {
  readonly name: string;
};

export function instructionExtraArgsNode(
  input: InstructionExtraArgsNodeInput
): InstructionExtraArgsNode {
  if (!input.name) {
    throw new InvalidKinobiTreeError(
      'InstructionExtraArgsNode must have a name.'
    );
  }
  return {
    kind: 'instructionExtraArgsNode',
    name: mainCase(input.name),
    struct: input.struct,
    link: input.link,
  };
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
      `Expected instructionExtraArgsNode, got ${node?.kind ?? 'null'}.`
    );
  }
}
