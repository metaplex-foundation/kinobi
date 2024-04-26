import type { IdlDefinedType } from '../idl';
import { InvalidKinobiTreeError, MainCaseString, mainCase } from '../shared';
import { TypeNode, createTypeNodeFromIdl } from './typeNodes/TypeNode';

export interface DefinedTypeNode<TType extends TypeNode = TypeNode> {
  readonly kind: 'definedTypeNode';

  // Children.
  readonly type: TType;

  // Data.
  readonly name: MainCaseString;
  readonly idlName: string;
  readonly docs: string[];
}

export type DefinedTypeNodeInput<TType extends TypeNode = TypeNode> = {
  readonly name: string;
  readonly type: TType;
  readonly idlName?: string;
  readonly docs?: string[];
};

export function definedTypeNode<TType extends TypeNode>(
  input: DefinedTypeNodeInput<TType>
): DefinedTypeNode<TType> {
  if (!input.name) {
    throw new InvalidKinobiTreeError('DefinedTypeNode must have a name.');
  }
  return {
    kind: 'definedTypeNode',
    name: mainCase(input.name),
    type: input.type,
    idlName: input.idlName ?? input.name,
    docs: input.docs ?? [],
  };
}

export function definedTypeNodeFromIdl(
  idl: Partial<IdlDefinedType>
): DefinedTypeNode {
  const name = idl.name ?? '';
  const idlType = idl.type ?? { kind: 'struct', fields: [] };
  // @ts-ignore
  const type = createTypeNodeFromIdl(idlType);
  return definedTypeNode({ name, type, idlName: name, docs: idl.docs });
}
