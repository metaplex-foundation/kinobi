import type { IdlAccount } from '../idl';
import { InvalidKinobiTreeError, MainCaseString, mainCase } from '../shared';
import { assertIsNode } from './Node';
import { DiscriminatorNode } from './discriminatorNodes';
import { PdaLinkNode, pdaLinkNode } from './linkNodes';
import { StructTypeNode, structTypeNode } from './typeNodes';
import { createTypeNodeFromIdl } from './typeNodes/TypeNode';

export type AccountNode = {
  readonly kind: 'accountNode';

  // Children.
  readonly data: StructTypeNode;
  readonly pda?: PdaLinkNode;
  readonly discriminators?: DiscriminatorNode[];

  // Data.
  readonly name: MainCaseString;
  readonly idlName: string;
  readonly docs: string[];
  readonly size?: number | null;
};

export type AccountNodeInput = Omit<Partial<AccountNode>, 'kind' | 'name'> & {
  readonly name: string;
};

export function accountNode(input: AccountNodeInput): AccountNode {
  if (!input.name) {
    throw new InvalidKinobiTreeError('AccountNode must have a name.');
  }
  return {
    kind: 'accountNode',
    data: input.data ?? structTypeNode([]),
    pda: input.pda,
    discriminators: input.discriminators,
    name: mainCase(input.name),
    idlName: input.idlName ?? input.name,
    docs: input.docs ?? [],
    size: input.size,
  };
}

export function accountNodeFromIdl(idl: Partial<IdlAccount>): AccountNode {
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
