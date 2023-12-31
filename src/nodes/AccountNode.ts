import type { IdlAccount } from '../idl';
import {
  AccountDiscriminator,
  InvalidKinobiTreeError,
  MainCaseString,
  PartialExcept,
  mainCase,
} from '../shared';
import { AccountDataNode, accountDataNode } from './AccountDataNode';
import { assertIsNode, type Node } from './Node';
import {
  PdaSeedNode,
  constantPdaSeedNode,
  programIdPdaSeedNode,
  variablePdaSeedNode,
} from './pdaSeedNodes';
import { remainderSizeNode } from './sizeNodes';
import { bytesTypeNode } from './typeNodes/BytesTypeNode';
import { stringTypeNode } from './typeNodes/StringTypeNode';
import { TypeNode, createTypeNodeFromIdl } from './typeNodes/TypeNode';
import {
  booleanValueNode,
  numberValueNode,
  stringValueNode,
} from './valueNodes';

export type AccountNode = {
  readonly kind: 'accountNode';
  readonly name: MainCaseString;
  readonly data: AccountDataNode;
  readonly idlName: string;
  readonly docs: string[];
  readonly internal: boolean;
  readonly size?: number | null;
  readonly seeds: PdaSeedNode[];
  readonly discriminator?: AccountDiscriminator;
};

export type AccountNodeInput = Omit<
  PartialExcept<AccountNode, 'name' | 'data'>,
  'kind' | 'name'
> & {
  readonly name: string;
};

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
  };
}

export function accountNodeFromIdl(idl: Partial<IdlAccount>): AccountNode {
  const idlName = idl.name ?? '';
  const name = mainCase(idlName);
  const idlStruct = idl.type ?? { kind: 'struct', fields: [] };
  const struct = createTypeNodeFromIdl(idlStruct);
  assertIsNode(struct, 'structTypeNode');
  const seeds = (idl.seeds ?? []).map((seed): PdaSeedNode => {
    if (seed.kind === 'constant') {
      const value = (() => {
        if (typeof seed.value === 'string') return stringValueNode(seed.value);
        if (typeof seed.value === 'number') return numberValueNode(seed.value);
        return booleanValueNode(seed.value);
      })();
      let type: TypeNode;
      if (seed.type === 'string') {
        type = stringTypeNode({ size: remainderSizeNode() });
      } else if (seed.type === 'bytes') {
        type = bytesTypeNode(remainderSizeNode());
      } else {
        type = createTypeNodeFromIdl(seed.type);
      }
      return constantPdaSeedNode(type, value);
    }
    if (seed.kind === 'variable') {
      return variablePdaSeedNode(
        seed.name,
        createTypeNodeFromIdl(seed.type),
        seed.description ? [seed.description] : []
      );
    }
    return programIdPdaSeedNode();
  });
  return accountNode({
    name,
    data: accountDataNode({ name: `${name}AccountData`, struct }),
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
