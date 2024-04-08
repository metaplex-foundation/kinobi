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
export type StandaloneContextualValueNode =
  | AccountBumpValueNode
  | AccountValueNode
  | ArgumentValueNode
  | ConditionalValueNode
  | IdentityValueNode
  | PayerValueNode
  | PdaValueNode
  | ProgramIdValueNode
  | ResolverValueNode;
export const STANDALONE_CONTEXTUAL_VALUE_NODE_KINDS = [
  'accountBumpValueNode',
  'accountValueNode',
  'argumentValueNode',
  'conditionalValueNode',
  'identityValueNode',
  'payerValueNode',
  'pdaValueNode',
  'programIdValueNode',
  'resolverValueNode',
] satisfies readonly StandaloneContextualValueNode['kind'][];
null as unknown as StandaloneContextualValueNode['kind'] satisfies (typeof STANDALONE_CONTEXTUAL_VALUE_NODE_KINDS)[number];

// Contextual Value Node Registration.
export type RegisteredContextualValueNode =
  | StandaloneContextualValueNode
  | PdaSeedValueNode;
export const REGISTERED_CONTEXTUAL_VALUE_NODE_KINDS = [
  ...STANDALONE_CONTEXTUAL_VALUE_NODE_KINDS,
  'pdaSeedValueNode',
] satisfies readonly RegisteredContextualValueNode['kind'][];
null as unknown as RegisteredContextualValueNode['kind'] satisfies (typeof REGISTERED_CONTEXTUAL_VALUE_NODE_KINDS)[number];

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
  'programLinkNode',
] satisfies readonly InstructionInputValueNode['kind'][];
