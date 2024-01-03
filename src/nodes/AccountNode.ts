import type { IdlAccount } from '../idl';
import {
  AccountDiscriminator,
  InvalidKinobiTreeError,
  MainCaseString,
  mainCase,
} from '../shared';
import { AccountDataNode, accountDataNode } from './AccountDataNode';
import { assertIsNode } from './Node';
import { PdaLinkNode, pdaLinkNode } from './linkNodes';
import { structTypeNode } from './typeNodes';
import { createTypeNodeFromIdl } from './typeNodes/TypeNode';

export type AccountNode = {
  readonly kind: 'accountNode';

  // Children.
  readonly data: AccountDataNode;
  readonly pda?: PdaLinkNode;

  // Children to-be.
  readonly discriminator?: AccountDiscriminator;

  // Data.
  readonly name: MainCaseString;
  readonly idlName: string;
  readonly docs: string[];
  readonly internal: boolean;
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
    data: input.data ?? accountDataNode({ struct: structTypeNode([]) }),
    pda: input.pda,
    name: mainCase(input.name),
    idlName: input.idlName ?? input.name,
    docs: input.docs ?? [],
    internal: input.internal ?? false,
    size: input.size,
    discriminator: input.discriminator,
  };
}

export function accountNodeFromIdl(idl: Partial<IdlAccount>): AccountNode {
  const idlName = idl.name ?? '';
  const name = mainCase(idlName);
  const idlStruct = idl.type ?? { kind: 'struct', fields: [] };
  const struct = createTypeNodeFromIdl(idlStruct);
  assertIsNode(struct, 'structTypeNode');
  const hasSeeds = (idl.seeds ?? []).length > 0;
  return accountNode({
    name,
    data: accountDataNode({ struct }),
    pda: hasSeeds ? pdaLinkNode(name) : undefined,
    idlName,
    docs: idl.docs ?? [],
    size: idl.size,
  });
}
