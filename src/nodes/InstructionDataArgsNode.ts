import { InvalidKinobiTreeError, MainCaseString, mainCase } from '../shared';
import { DefinedTypeLinkNode } from './linkNodes';
import { StructTypeNode } from './typeNodes';

export type InstructionDataArgsNode = {
  readonly kind: 'instructionDataArgsNode';
  readonly name: MainCaseString;
  readonly struct: StructTypeNode;
  readonly link?: DefinedTypeLinkNode;
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
    struct: input.struct,
    link: input.link,
  };
}
