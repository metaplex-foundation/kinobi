import type { AccountBumpValueNode } from './AccountBumpValueNode';
import type { AccountValueNode } from './AccountValueNode';
import type { ArgumentValueNode } from './ArgumentValueNode';
import type { ConditionalValueNode } from './ConditionalValueNode';
import type { IdentityValueNode } from './IdentityValueNode';
import type { PayerValueNode } from './PayerValueNode';
import type { PdaValueNode } from './PdaValueNode';
import type { ProgramIdValueNode } from './ProgramIdValueNode';
import type { ResolverValueNode } from './ResolverValueNode';

// Node Group Registration.

export const REGISTERED_CONTEXTUAL_VALUE_NODES = {
  accountBumpValueNode: {} as AccountBumpValueNode,
  accountValueNode: {} as AccountValueNode,
  argumentValueNode: {} as ArgumentValueNode,
  conditionalValueNode: {} as ConditionalValueNode,
  identityValueNode: {} as IdentityValueNode,
  payerValueNode: {} as PayerValueNode,
  pdaValueNode: {} as PdaValueNode,
  programIdValueNode: {} as ProgramIdValueNode,
  resolverValueNode: {} as ResolverValueNode,
};

export const REGISTERED_CONTEXTUAL_VALUE_NODE_KEYS = Object.keys(
  REGISTERED_CONTEXTUAL_VALUE_NODES
) as (keyof typeof REGISTERED_CONTEXTUAL_VALUE_NODES)[];

export type RegisteredContextualValueNodes =
  typeof REGISTERED_CONTEXTUAL_VALUE_NODES;

// Node Group Helpers.

export type ContextualValueNode =
  RegisteredContextualValueNodes[keyof RegisteredContextualValueNodes];

export const CONTEXTUAL_VALUE_NODES = REGISTERED_CONTEXTUAL_VALUE_NODE_KEYS;

export type InstructionAccountValueNode = {}; // TODO

export type InstructionArgumentValueNode = {}; // TODO
