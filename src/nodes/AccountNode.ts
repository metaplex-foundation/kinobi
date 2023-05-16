import type { IdlAccount } from '../idl';
import {
  AccountDiscriminator,
  AccountSeed,
  InvalidKinobiTreeError,
  PartialExcept,
  fieldAccountDiscriminator,
  mainCase,
  remainderSize,
} from '../shared';
import { AccountDataNode, accountDataNode } from './AccountDataNode';
import { bytesTypeNode } from './BytesTypeNode';
import type { Node } from './Node';
import { stringTypeNode } from './StringTypeNode';
import { structFieldTypeNode } from './StructFieldTypeNode';
import { assertStructTypeNode, structTypeNode } from './StructTypeNode';
import { TypeNode, createTypeNodeFromIdl } from './TypeNode';
import { vScalar } from './ValueNode';

export type AccountNode = {
  readonly __accountNode: unique symbol;
  readonly kind: 'accountNode';
  readonly name: string;
  readonly data: AccountDataNode;
  readonly idlName: string;
  readonly docs: string[];
  readonly internal: boolean;
  readonly size?: number;
  readonly seeds: AccountSeed[];
  readonly discriminator?: AccountDiscriminator;
};

export type AccountNodeInput = Omit<
  PartialExcept<AccountNode, 'name' | 'data'>,
  '__accountNode' | 'kind'
>;

export function accountNode(input: AccountNodeInput): AccountNode {
  if (!input.name) {
    throw new InvalidKinobiTreeError('AccountNode must have a name.');
  }
  return {
    kind: 'accountNode',
    name: mainCase(input.name),
    data: input.data,
    idlName: input.idlName ?? input.name,
    docs: input.docs ?? [],
    internal: input.internal ?? false,
    size: input.size,
    seeds: input.seeds ?? [],
    discriminator: input.discriminator,
  } as AccountNode;
}

export function accountNodeFromIdl(idl: Partial<IdlAccount>): AccountNode {
  const idlName = idl.name ?? '';
  const name = mainCase(idlName);
  const idlStruct = idl.type ?? { kind: 'struct', fields: [] };
  let struct = createTypeNodeFromIdl(idlStruct);
  let accountDiscriminatorField: AccountDiscriminator | undefined;
  assertStructTypeNode(struct);
  const seeds = (idl.seeds ?? []).map((seed): AccountSeed => {
    if (seed.kind === 'constant') {
      const value = vScalar(seed.value);
      let type: TypeNode;
      if (seed.type === 'string') {
        type = stringTypeNode({ size: remainderSize() });
      } else if (seed.type === 'bytes') {
        type = bytesTypeNode(remainderSize());
      } else {
        type = createTypeNodeFromIdl(seed.type);
      }
      return { ...seed, type, value };
    }
    if (seed.kind === 'variable') {
      return {
        ...seed,
        type: createTypeNodeFromIdl(seed.type),
        docs: seed.description ? [seed.description] : [],
      };
    }
    return { kind: 'programId' };
  });

  if (idl.discriminant) {
    if (idl.discriminant.kind === 'constant') {
      const discriminatorField = structFieldTypeNode({
        name: 'discriminator',
        child: createTypeNodeFromIdl(idl.discriminant.type),
        defaultsTo: {
          strategy: "omitted",
          value: vScalar(idl.discriminant.value)
        }
      })
      struct = structTypeNode([discriminatorField, ...struct.fields])
      accountDiscriminatorField = fieldAccountDiscriminator('discriminator')
    }
 }

  return accountNode({
    name,
    data: accountDataNode({ name: `${name}AccountData`, struct }),
    discriminator: accountDiscriminatorField,
    idlName,
    docs: idl.docs ?? [],
    size: idl.size,
    seeds,
  });
}

export function isAccountNode(node: Node | null): node is AccountNode {
  return !!node && node.kind === 'accountNode';
}

export function assertAccountNode(
  node: Node | null
): asserts node is AccountNode {
  if (!isAccountNode(node)) {
    throw new Error(`Expected accountNode, got ${node?.kind ?? 'null'}.`);
  }
}
