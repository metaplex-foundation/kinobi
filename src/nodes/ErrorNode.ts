import type { IdlError } from '../idl';
import { InvalidKinobiTreeError, PartialExcept, mainCase } from '../shared';
import type { Node } from './Node';

export type ErrorNode = {
  readonly __errorNode: unique symbol;
  readonly nodeClass: 'errorNode';
  readonly name: string;
  readonly idlName: string;
  readonly code: number;
  readonly message: string;
  readonly docs: string[];
};

export type ErrorNodeInput = Omit<
  PartialExcept<ErrorNode, 'name' | 'code' | 'message'>,
  '__errorNode' | 'nodeClass'
>;

export function errorNode(input: ErrorNodeInput): ErrorNode {
  if (!input.name) {
    throw new InvalidKinobiTreeError('ErrorNode must have a name.');
  }
  if (input.code < 0) {
    throw new InvalidKinobiTreeError('ErrorNode must have a code number.');
  }
  return {
    nodeClass: 'errorNode',
    name: mainCase(input.name),
    idlName: input.idlName ?? input.name,
    code: input.code,
    message: input.message,
    docs: input.docs ?? [],
  } as ErrorNode;
}

export function errorNodeFromIdl(idl: Partial<IdlError>): ErrorNode {
  const name = idl.name ?? '';
  return errorNode({
    name,
    idlName: name,
    code: idl.code ?? -1,
    message: idl.msg ?? '',
    docs: idl.docs ?? [`${name}: '${idl.msg}'`],
  });
}

export function isErrorNode(node: Node | null): node is ErrorNode {
  return !!node && node.nodeClass === 'errorNode';
}

export function assertErrorNode(node: Node | null): asserts node is ErrorNode {
  if (!isErrorNode(node)) {
    throw new Error(`Expected ErrorNode, got ${node?.nodeClass ?? 'null'}.`);
  }
}
