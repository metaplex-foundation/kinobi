import { InvalidKinobiTreeError, MainCaseString, mainCase } from '../shared';
import { StructTypeNode } from './typeNodes';

export type AccountDataNode = {
  readonly kind: 'accountDataNode';

  // Children.
  readonly struct: StructTypeNode;

  // Data.
  readonly name: MainCaseString;
};

export type AccountDataNodeInput = {
  readonly name: string;
  readonly struct: StructTypeNode;
};

export function accountDataNode(input: AccountDataNodeInput): AccountDataNode {
  if (!input.name) {
    throw new InvalidKinobiTreeError('AccountDataNode must have a name.');
  }
  return {
    kind: 'accountDataNode',
    name: mainCase(input.name),
    struct: input.struct,
  };
}
