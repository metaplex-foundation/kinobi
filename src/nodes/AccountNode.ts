import type { IdlAccount } from '../idl';
import { InvalidKinobiTreeError, MainCaseString, mainCase } from '../shared';
import { assertIsNode } from './Node';
import { DiscriminatorNode } from './discriminatorNodes';
import { PdaLinkNode, pdaLinkNode } from './linkNodes';
import { NestedTypeNode, StructTypeNode, structTypeNode } from './typeNodes';
import { createTypeNodeFromIdl } from './typeNodes/TypeNode';

export interface AccountNode<
  TData extends NestedTypeNode<StructTypeNode> = NestedTypeNode<StructTypeNode>,
  TPda extends PdaLinkNode | undefined = PdaLinkNode | undefined,
  TDiscriminators extends DiscriminatorNode[] | undefined =
    | DiscriminatorNode[]
    | undefined,
> {
  readonly kind: 'accountNode';

  // Children.
  readonly data: TData;
  readonly pda?: TPda;
  readonly discriminators?: TDiscriminators;

  // Data.
  readonly name: MainCaseString;
  readonly idlName: string;
  readonly docs: string[];
  readonly size?: number | null;
}

export type AccountNodeInput<
  TData extends NestedTypeNode<StructTypeNode> = NestedTypeNode<StructTypeNode>,
  TPda extends PdaLinkNode | undefined = PdaLinkNode | undefined,
  TDiscriminators extends DiscriminatorNode[] | undefined =
    | DiscriminatorNode[]
    | undefined,
> = Omit<
  Partial<AccountNode<TData, TPda, TDiscriminators>>,
  'kind' | 'name'
> & {
  readonly name: string;
};

export function accountNode<
  TData extends NestedTypeNode<StructTypeNode> = StructTypeNode<[]>,
  TPda extends PdaLinkNode | undefined = undefined,
  const TDiscriminators extends DiscriminatorNode[] | undefined = undefined,
>(
  input: AccountNodeInput<TData, TPda, TDiscriminators>
): AccountNode<TData, TPda, TDiscriminators> {
  if (!input.name) {
    throw new InvalidKinobiTreeError('AccountNode must have a name.');
  }
  return {
    kind: 'accountNode',

    // Children.
    data: (input.data ?? structTypeNode([])) as TData,
    pda: input.pda,
    discriminators: input.discriminators,

    // Data.
    name: mainCase(input.name),
    idlName: input.idlName ?? input.name,
    docs: input.docs ?? [],
    size: input.size,
  };
}

export function accountNodeFromIdl(
  idl: Partial<IdlAccount>
): AccountNode<StructTypeNode> {
  const idlName = idl.name ?? '';
  const name = mainCase(idlName);
  const idlStruct = idl.type ?? { kind: 'struct', fields: [] };
  const data = createTypeNodeFromIdl(idlStruct);
  assertIsNode(data, 'structTypeNode');
  const hasSeeds = (idl.seeds ?? []).length > 0;
  return accountNode({
    name,
    data,
    pda: hasSeeds ? pdaLinkNode(name) : undefined,
    idlName,
    docs: idl.docs ?? [],
    size: idl.size,
  });
}
