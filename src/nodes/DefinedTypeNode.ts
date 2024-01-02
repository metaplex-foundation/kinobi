import type { IdlDefinedType } from '../idl';
import { InvalidKinobiTreeError, MainCaseString, mainCase } from '../shared';
import { TypeNode, createTypeNodeFromIdl } from './typeNodes/TypeNode';

export type DefinedTypeNode = {
  readonly kind: 'definedTypeNode';

  // Children.
  readonly type: TypeNode;

  // Data.
  readonly name: MainCaseString;
  readonly idlName: string;
  readonly docs: string[];
  readonly internal: boolean;
};

export type DefinedTypeNodeInput = {
  readonly name: string;
  readonly type: TypeNode;
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
    type: input.type,
    idlName: input.idlName ?? input.name,
    docs: input.docs ?? [],
    internal: input.internal ?? false,
  };
}

export function definedTypeNodeFromIdl(
  idl: Partial<IdlDefinedType>
): DefinedTypeNode {
  const name = idl.name ?? '';
  const idlType = idl.type ?? { kind: 'struct', fields: [] };
  const type = createTypeNodeFromIdl(idlType);
  return definedTypeNode({ name, type, idlName: name, docs: idl.docs });
}
