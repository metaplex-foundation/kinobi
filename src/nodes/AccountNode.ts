import type { IdlAccount } from '../idl';
import {
  AccountDiscriminator,
  AccountSeed,
  InvalidKinobiTreeError,
  PartialExcept,
  mainCase,
} from '../shared';
import { AccountDataNode, accountDataNode } from './AccountDataNode';
import type { Node } from './Node';
import { assertStructTypeNode } from './StructTypeNode';
import { TypeNode, createTypeNodeFromIdl } from './TypeNode';

export type AccountGpaField = {
  name: string;
  offset: number | null;
  type: TypeNode;
};

export type AccountNode = {
  readonly __accountNode: unique symbol;
  readonly nodeClass: 'AccountNode';
  readonly name: string;
  readonly dataNode: AccountDataNode;
  readonly idlName: string;
  readonly docs: string[];
  readonly internal: boolean;
  readonly size: number | null;
  readonly seeds: AccountSeed[];
  readonly discriminator: AccountDiscriminator | null;
  readonly gpaFields: AccountGpaField[];
};

export type AccountNodeInput = Omit<
  PartialExcept<AccountNode, 'name' | 'dataNode'>,
  '__accountNode' | 'nodeClass'
>;

export function accountNode(input: AccountNodeInput): AccountNode {
  if (!input.name) {
    throw new InvalidKinobiTreeError('DefinedTypeNodeInput must have a name.');
  }
  return {
    nodeClass: 'AccountNode',
    name: mainCase(input.name),
    dataNode: input.dataNode,
    idlName: input.idlName ?? input.name,
    docs: input.docs ?? [],
    internal: input.internal ?? false,
    size: input.size ?? null,
    seeds: input.seeds ?? [],
    discriminator: input.discriminator ?? null,
    gpaFields: input.gpaFields ?? [],
  } as AccountNode;
}

export function accountNodeFromIdl(idl: Partial<IdlAccount>): AccountNode {
  const name = idl.name ?? '';
  const idlStruct = idl.type ?? { kind: 'struct', fields: [] };
  const dataNode = createTypeNodeFromIdl({ name, ...idlStruct });
  assertStructTypeNode(dataNode);
  const seeds = (idl.seeds ?? []).map((seed) => {
    if (seed.kind === 'variable') {
      return {
        ...seed,
        variableNode: createTypeNodeFromIdl(seed.type),
        docs: seed.description ? [seed.description] : [],
      };
    }
    return seed;
  });
  return accountNode({
    name,
    dataNode: accountDataNode(dataNode),
    idlName: name,
    docs: idl.docs ?? [],
    size: idl.size ?? null,
    seeds,
  });
}

// export function isLinked(): boolean {
//   return isLinkTypeNode(this.type);
// }

// export function variableSeeds(): Extract<
//   AccountNodeSeed,
//   { kind: 'variable' }
// >[] {
//   return this.metadata.seeds.filter(
//     (seed): seed is Extract<AccountNodeSeed, { kind: 'variable' }> =>
//       seed.kind === 'variable'
//   );
// }

// export function hasVariableSeeds(): boolean {
//   return this.variableSeeds.length > 0;
// }

// export function instructionAccountDefaultSeeds(): Record<
//   string,
//   InstructionNodeAccountDefaultsSeed
// > {
//   return this.metadata.seeds.reduce((acc, seed) => {
//     if (seed.type !== 'variable') return acc;
//     if (isPublicKeyTypeNode(seed.type)) {
//       acc[seed.name] = { type: 'account', name: seed.name };
//     } else {
//       acc[seed.name] = { type: 'arg', name: seed.name };
//     }
//     return acc;
//   }, {} as Record<string, InstructionNodeAccountDefaultsSeed>);
// }

export function isAccountNode(node: Node | null): node is AccountNode {
  return !!node && node.nodeClass === 'AccountNode';
}

export function assertAccountNode(
  node: Node | null
): asserts node is AccountNode {
  if (!isAccountNode(node)) {
    throw new Error(`Expected AccountNode, got ${node?.nodeClass ?? 'null'}.`);
  }
}
