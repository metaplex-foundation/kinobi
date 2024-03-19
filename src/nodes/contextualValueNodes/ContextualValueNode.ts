import { getNodeKinds } from '../../shared/utils';
import type { ProgramLinkNode } from '../linkNodes/ProgramLinkNode';
import { VALUE_NODES, ValueNode } from '../valueNodes/ValueNode';
import type { AccountBumpValueNode } from './AccountBumpValueNode';
import type { AccountValueNode } from './AccountValueNode';
import type { ArgumentValueNode } from './ArgumentValueNode';
import type { ConditionalValueNode } from './ConditionalValueNode';
import type { IdentityValueNode } from './IdentityValueNode';
import type { PayerValueNode } from './PayerValueNode';
import type { PdaSeedValueNode } from './PdaSeedValueNode';
import type { PdaValueNode } from './PdaValueNode';
import type { ProgramIdValueNode } from './ProgramIdValueNode';
import type { ResolverValueNode } from './ResolverValueNode';

// Standalone Contextual Value Node Registration.

export const STANDALONE_CONTEXTUAL_VALUE_NODES = {
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

export const STANDALONE_CONTEXTUAL_VALUE_NODE_KINDS = getNodeKinds(
  STANDALONE_CONTEXTUAL_VALUE_NODES
);
export type StandaloneContextualValueNodeKind =
  (typeof STANDALONE_CONTEXTUAL_VALUE_NODE_KINDS)[number];
export type StandaloneContextualValueNode =
  (typeof STANDALONE_CONTEXTUAL_VALUE_NODES)[StandaloneContextualValueNodeKind];

// Contextual Value Node Registration.

export const REGISTERED_CONTEXTUAL_VALUE_NODES = {
  ...STANDALONE_CONTEXTUAL_VALUE_NODES,

  // The following are not valid standalone nodes.
  pdaSeedValueNode: {} as PdaSeedValueNode,
};

export const REGISTERED_CONTEXTUAL_VALUE_NODE_KINDS = getNodeKinds(
  REGISTERED_CONTEXTUAL_VALUE_NODES
);
export type RegisteredContextualValueNodeKind =
  (typeof REGISTERED_CONTEXTUAL_VALUE_NODE_KINDS)[number];
export type RegisteredContextualValueNode =
  (typeof REGISTERED_CONTEXTUAL_VALUE_NODES)[RegisteredContextualValueNodeKind];

// Contextual Value Node Helpers.

export type ContextualValueNode = StandaloneContextualValueNode;
export const CONTEXTUAL_VALUE_NODES = STANDALONE_CONTEXTUAL_VALUE_NODE_KINDS;

export type InstructionInputValueNode =
  | ValueNode
  | ContextualValueNode
  | ProgramLinkNode;

export const INSTRUCTION_INPUT_VALUE_NODE = [
  ...VALUE_NODES,
  ...CONTEXTUAL_VALUE_NODES,
  'programLinkNode' as const,
];
