import { InstructionArgumentNode } from './InstructionArgumentNode';

export type InstructionDataArgsNode = {
  readonly kind: 'instructionDataArgsNode';

  // Children.
  readonly dataArguments: InstructionArgumentNode[];
};

export type InstructionDataArgsNodeInput = Omit<
  InstructionDataArgsNode,
  'kind'
>;

export function instructionDataArgsNode(
  input: InstructionDataArgsNodeInput
): InstructionDataArgsNode {
  return {
    kind: 'instructionDataArgsNode',
    dataArguments: input.dataArguments,
  };
}
