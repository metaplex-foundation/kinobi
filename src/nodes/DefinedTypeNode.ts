import type { IdlDefinedType } from '../idl';
import { InvalidKinobiTreeError, MainCaseString, mainCase } from '../shared';
import type { Node } from './Node';
import { TypeNode, createTypeNodeFromIdl } from './typeNodes/TypeNode';

export type DefinedTypeNode = {
  readonly __definedTypeNode: unique symbol;
  readonly kind: 'definedTypeNode';
  readonly name: MainCaseString;
  readonly data: TypeNode;
  readonly idlName: string;
  readonly docs: string[];
  readonly internal: boolean;
};

export type DefinedTypeNodeInput = {
  readonly name: string;
  readonly data: TypeNode;
  readonly idlName?: string;
  readonly docs?: string[];
  readonly internal?: boolean;
};

export function definedTypeNode(input: DefinedTypeNodeInput): DefinedTypeNode {
  if (!input.name) {
    throw new InvalidKinobiTreeError('DefinedTypeNode must have a name.');
  }
  return {
    kind: 'definedTypeNode',
    name: mainCase(input.name),
    data: input.data,
    idlName: input.idlName ?? input.name,
    docs: input.docs ?? [],
    internal: input.internal ?? false,
  } as DefinedTypeNode;
}

export function definedTypeNodeFromIdl(
  idl: Partial<IdlDefinedType>
): DefinedTypeNode {
  const name = idl.name ?? '';
  const idlType = idl.type ?? { kind: 'struct', fields: [] };
  const data = createTypeNodeFromIdl(idlType);
  return definedTypeNode({ name, data, idlName: name, docs: idl.docs });
}

export function isDefinedTypeNode(node: Node | null): node is DefinedTypeNode {
  return !!node && node.kind === 'definedTypeNode';
}

export function assertDefinedTypeNode(
  node: Node | null
): asserts node is DefinedTypeNode {
  if (!isDefinedTypeNode(node)) {
    throw new Error(`Expected definedTypeNode, got ${node?.kind ?? 'null'}.`);
  }
}
