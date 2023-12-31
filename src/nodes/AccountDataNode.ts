import { InvalidKinobiTreeError, MainCaseString, mainCase } from '../shared';
import { LinkTypeNode } from './typeNodes/LinkTypeNode';
import { StructTypeNode } from './typeNodes/StructTypeNode';

export type AccountDataNode = {
  readonly kind: 'accountDataNode';
  readonly name: MainCaseString;
  readonly struct: StructTypeNode;
  readonly link?: LinkTypeNode;
};

export type AccountDataNodeInput = {
  readonly name: string;
  readonly struct: StructTypeNode;
  readonly link?: LinkTypeNode;
};

export function accountDataNode(input: AccountDataNodeInput): AccountDataNode {
  if (!input.name) {
    throw new InvalidKinobiTreeError('AccountDataNode must have a name.');
  }
  return {
    kind: 'accountDataNode',
    name: mainCase(input.name),
    struct: input.struct,
    link: input.link,
  };
}
