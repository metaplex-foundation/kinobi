import { InvalidKinobiTreeError, MainCaseString, mainCase } from '../shared';
import { InstructionArgumentNode } from './InstructionArgumentNode';
import { DefinedTypeLinkNode } from './linkNodes';

export type InstructionDataArgsNode = {
  readonly kind: 'instructionDataArgsNode';

  // Children.
  readonly dataArguments: InstructionArgumentNode[];
  readonly link?: DefinedTypeLinkNode;

  // Data.
  readonly name: MainCaseString;
};

export type InstructionDataArgsNodeInput = Omit<
  InstructionDataArgsNode,
  'kind' | 'name'
> & {
  readonly name: string;
};

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
    dataArguments: input.dataArguments,
    link: input.link,
  };
}
