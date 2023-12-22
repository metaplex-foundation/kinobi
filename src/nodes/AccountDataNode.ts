import { InvalidKinobiTreeError, MainCaseString, mainCase } from '../shared';
import { LinkTypeNode } from './typeNodes/LinkTypeNode';
import type { Node } from './Node';
import { StructTypeNode } from './typeNodes/StructTypeNode';

export type AccountDataNode = {
  readonly __accountDataNode: unique symbol;
  readonly kind: 'accountDataNode';
  readonly name: MainCaseString;
  readonly struct: StructTypeNode;
  readonly link?: LinkTypeNode;
};

export type AccountDataNodeInput = Omit<
  AccountDataNode,
  '__accountDataNode' | 'kind' | 'name'
> & {
  name: string;
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
  } as AccountDataNode;
}

export function isAccountDataNode(node: Node | null): node is AccountDataNode {
  return !!node && node.kind === 'accountDataNode';
}

export function assertAccountDataNode(
  node: Node | null
): asserts node is AccountDataNode {
  if (!isAccountDataNode(node)) {
    throw new Error(`Expected accountDataNode, got ${node?.kind ?? 'null'}.`);
  }
}
