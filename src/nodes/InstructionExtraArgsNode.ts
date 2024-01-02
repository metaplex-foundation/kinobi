import { InvalidKinobiTreeError, MainCaseString, mainCase } from '../shared';
import { InstructionArgumentNode } from './InstructionArgumentNode';

export type InstructionExtraArgsNode = {
  readonly kind: 'instructionExtraArgsNode';

  // Children.
  readonly extraArguments: InstructionArgumentNode[];

  // Data.
  readonly name: MainCaseString;
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
    extraArguments: input.extraArguments,
  };
}
