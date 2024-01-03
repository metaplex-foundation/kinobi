import { StructTypeNode } from './typeNodes';

export type AccountDataNode = {
  readonly kind: 'accountDataNode';

  // Children.
  readonly struct: StructTypeNode;
};

export type AccountDataNodeInput = {
  readonly struct: StructTypeNode;
};

export function accountDataNode(input: AccountDataNodeInput): AccountDataNode {
  return {
    kind: 'accountDataNode',
    struct: input.struct,
  };
}
