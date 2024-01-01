import type { IdentityValueNode } from './IdentityValueNode';
import type { PayerValueNode } from './PayerValueNode';
import type { ProgramIdValueNode } from './ProgramIdValueNode';

// Node Group Registration.

export const REGISTERED_CONTEXTUAL_VALUE_NODES = {
  identityValueNode: {} as IdentityValueNode,
  payerValueNode: {} as PayerValueNode,
  programIdValueNode: {} as ProgramIdValueNode,
};

export const REGISTERED_CONTEXTUAL_VALUE_NODE_KEYS = Object.keys(
  REGISTERED_CONTEXTUAL_VALUE_NODES
) as (keyof typeof REGISTERED_CONTEXTUAL_VALUE_NODES)[];

export type RegisteredContextualValueNodes =
  typeof REGISTERED_CONTEXTUAL_VALUE_NODES;

// Node Group Helpers.

export type InstructionAccountValueNode = {}; // TODO

export type InstructionArgumentValueNode = {}; // TODO
