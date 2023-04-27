import type { IdlError } from '../idl';
import { InvalidKinobiTreeError, PartialExcept, mainCase } from '../shared';
import type { Node } from './Node';

export type ErrorNode = {
  readonly __errorNode: unique symbol;
  readonly kind: 'errorNode';
  readonly name: string;
  readonly idlName: string;
  readonly code: number;
  readonly message: string;
  readonly docs: string[];
};

export type ErrorNodeInput = Omit<
  PartialExcept<ErrorNode, 'name' | 'code' | 'message'>,
  '__errorNode' | 'kind'
>;

export function errorNode(input: ErrorNodeInput): ErrorNode {
  if (!input.name) {
    throw new InvalidKinobiTreeError('ErrorNode must have a name.');
  }
  if (input.code < 0) {
    throw new InvalidKinobiTreeError('ErrorNode must have a code number.');
  }
  return {
    kind: 'errorNode',
    name: mainCase(input.name),
    idlName: input.idlName ?? input.name,
    code: input.code,
    message: input.message,
    docs: input.docs ?? [],
  } as ErrorNode;
}

export function errorNodeFromIdl(idl: Partial<IdlError>): ErrorNode {
  const name = idl.name ?? '';
  const msg = idl.msg ?? '';
  return errorNode({
    name,
    idlName: name,
    code: idl.code ?? -1,
    message: msg,
    docs: idl.docs ?? [msg ? `${name}: ${msg}` : `${name}`],
  });
}

export function isErrorNode(node: Node | null): node is ErrorNode {
  return !!node && node.kind === 'errorNode';
}

export function assertErrorNode(node: Node | null): asserts node is ErrorNode {
  if (!isErrorNode(node)) {
    throw new Error(`Expected errorNode, got ${node?.kind ?? 'null'}.`);
  }
}
