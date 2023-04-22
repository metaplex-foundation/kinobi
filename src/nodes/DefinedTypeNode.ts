import type { IdlDefinedType } from '../idl';
import { InvalidKinobiTreeError, mainCase } from '../shared';
import type { Node } from './Node';
import { TypeNode, createTypeNodeFromIdl } from './TypeNode';

export type DefinedTypeNode = {
  readonly __definedTypeNode: unique symbol;
  readonly nodeClass: 'DefinedTypeNode';
  readonly name: string;
  readonly dataNode: TypeNode;
  readonly idlName: string;
  readonly docs: string[];
  readonly internal: boolean;
};

export type DefinedTypeNodeInput = {
  readonly name: string;
  readonly dataNode: TypeNode;
  readonly idlName?: string;
  readonly docs?: string[];
  readonly internal?: boolean;
};

export function definedTypeNode(input: DefinedTypeNodeInput): DefinedTypeNode {
  if (!input.name) {
    throw new InvalidKinobiTreeError('DefinedTypeNodeInput must have a name.');
  }
  return {
    nodeClass: 'DefinedTypeNode',
    name: mainCase(input.name),
    dataNode: input.dataNode,
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
  const dataNode = createTypeNodeFromIdl({ name, ...idlType });
  return definedTypeNode({ name, dataNode, idlName: name, docs: idl.docs });
}

export function isDefinedTypeNode(node: Node | null): node is DefinedTypeNode {
  return !!node && node.nodeClass === 'DefinedTypeNode';
}

export function assertDefinedTypeNode(
  node: Node | null
): asserts node is DefinedTypeNode {
  if (!isDefinedTypeNode(node)) {
    throw new Error(
      `Expected DefinedTypeNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
