import type { AccountNode } from './AccountNode';
import type { DefinedTypeNode } from './DefinedTypeNode';
import type { ErrorNode } from './ErrorNode';
import type { InstructionAccountNode } from './InstructionAccountNode';
import type { InstructionArgumentNode } from './InstructionArgumentNode';
import type { InstructionByteDeltaNode } from './InstructionByteDeltaNode';
import type { InstructionNode } from './InstructionNode';
import type { InstructionRemainingAccountsNode } from './InstructionRemainingAccountsNode';
import type { PdaNode } from './PdaNode';
import type { ProgramNode } from './ProgramNode';
import type { RootNode } from './RootNode';
import {
  REGISTERED_CONTEXTUAL_VALUE_NODE_KINDS,
  RegisteredContextualValueNode,
} from './contextualValueNodes/ContextualValueNode';
import {
  REGISTERED_COUNT_NODE_KINDS,
  RegisteredCountNode,
} from './countNodes/CountNode';
import {
  REGISTERED_DISCRIMINATOR_NODE_KINDS,
  RegisteredDiscriminatorNode,
} from './discriminatorNodes/DiscriminatorNode';
import {
  REGISTERED_LINK_NODE_KINDS,
  RegisteredLinkNode,
} from './linkNodes/LinkNode';
import {
  REGISTERED_PDA_SEED_NODE_KINDS,
  RegisteredPdaSeedNode,
} from './pdaSeedNodes/PdaSeedNode';
import {
  REGISTERED_TYPE_NODE_KINDS,
  RegisteredTypeNode,
} from './typeNodes/TypeNode';
import {
  REGISTERED_VALUE_NODE_KINDS,
  RegisteredValueNode,
} from './valueNodes/ValueNode';

// Node Registration.
export type Node =
  // Groups.
  | RegisteredContextualValueNode
  | RegisteredCountNode
  | RegisteredDiscriminatorNode
  | RegisteredLinkNode
  | RegisteredPdaSeedNode
  | RegisteredTypeNode
  | RegisteredValueNode
  // Nodes.
  | RootNode
  | ProgramNode
  | PdaNode
  | AccountNode
  | InstructionAccountNode
  | InstructionArgumentNode
  | InstructionByteDeltaNode
  | InstructionNode
  | InstructionRemainingAccountsNode
  | ErrorNode
  | DefinedTypeNode;
export const REGISTERED_NODE_KINDS = [
  ...REGISTERED_CONTEXTUAL_VALUE_NODE_KINDS,
  ...REGISTERED_DISCRIMINATOR_NODE_KINDS,
  ...REGISTERED_LINK_NODE_KINDS,
  ...REGISTERED_PDA_SEED_NODE_KINDS,
  ...REGISTERED_COUNT_NODE_KINDS,
  ...REGISTERED_TYPE_NODE_KINDS,
  ...REGISTERED_VALUE_NODE_KINDS,
  'rootNode',
  'programNode',
  'pdaNode',
  'accountNode',
  'instructionAccountNode',
  'instructionArgumentNode',
  'instructionByteDeltaNode',
  'instructionNode',
  'instructionRemainingAccountsNode',
  'errorNode',
  'definedTypeNode',
] satisfies readonly Node['kind'][];
null as unknown as Node['kind'] satisfies (typeof REGISTERED_NODE_KINDS)[number];
export type NodeKind = Node['kind'];

// Node Helpers.

export type GetNodeFromKind<TKind extends NodeKind> = Extract<
  Node,
  { kind: TKind }
>;

export function isNode<TKind extends NodeKind>(
  node: Node | null | undefined,
  kind: TKind | TKind[]
): node is GetNodeFromKind<TKind> {
  const kinds = Array.isArray(kind) ? kind : [kind];
  return !!node && (kinds as NodeKind[]).includes(node.kind);
}

export function assertIsNode<TKind extends NodeKind>(
  node: Node | null | undefined,
  kind: TKind | TKind[]
): asserts node is GetNodeFromKind<TKind> {
  const kinds = Array.isArray(kind) ? kind : [kind];
  if (!isNode(node, kinds)) {
    throw new Error(
      `Expected ${kinds.join(' | ')}, got ${node?.kind ?? 'null'}.`
    );
  }
}

export function isNodeFilter<TKind extends NodeKind>(
  kind: TKind | TKind[]
): (node: Node | null | undefined) => node is GetNodeFromKind<TKind> {
  return (node): node is GetNodeFromKind<TKind> => isNode(node, kind);
}

export function assertIsNodeFilter<TKind extends NodeKind>(
  kind: TKind | TKind[]
): (node: Node | null | undefined) => node is GetNodeFromKind<TKind> {
  return (node): node is GetNodeFromKind<TKind> => {
    assertIsNode(node, kind);
    return true;
  };
}

export function removeNullAndAssertIsNodeFilter<TKind extends NodeKind>(
  kind: TKind | TKind[]
): (node: Node | null | undefined) => node is GetNodeFromKind<TKind> {
  return (node): node is GetNodeFromKind<TKind> => {
    if (node) assertIsNode(node, kind);
    return node != null;
  };
}
