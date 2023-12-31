import { InvalidKinobiTreeError, MainCaseString, mainCase } from '../shared';
import { DefinedTypeLinkNode } from './linkNodes';
import { StructTypeNode } from './typeNodes';

export type InstructionExtraArgsNode = {
  readonly kind: 'instructionExtraArgsNode';
  readonly name: MainCaseString;
  readonly struct: StructTypeNode;
  readonly link?: DefinedTypeLinkNode;
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
