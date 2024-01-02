import { InvalidKinobiTreeError, MainCaseString, mainCase } from '../shared';
import { DefinedTypeLinkNode } from './linkNodes';
import { StructTypeNode } from './typeNodes';

export type InstructionExtraArgsNode = {
  readonly kind: 'instructionExtraArgsNode';

  // Children.
  readonly struct: StructTypeNode;
  readonly link?: DefinedTypeLinkNode;

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
    struct: input.struct,
    link: input.link,
  };
}
