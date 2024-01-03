import { InstructionArgumentNode } from './InstructionArgumentNode';

export type InstructionExtraArgsNode = {
  readonly kind: 'instructionExtraArgsNode';

  // Children.
  readonly extraArguments: InstructionArgumentNode[];
};

export type InstructionExtraArgsNodeInput = Omit<
  InstructionExtraArgsNode,
  'kind'
>;

export function instructionExtraArgsNode(
  input: InstructionExtraArgsNodeInput
): InstructionExtraArgsNode {
  return {
    kind: 'instructionExtraArgsNode',
    extraArguments: input.extraArguments,
  };
}
