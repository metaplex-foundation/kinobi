import { getNodeKinds } from '../shared/utils';
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
import { REGISTERED_CONTEXTUAL_VALUE_NODES } from './contextualValueNodes/ContextualValueNode';
import { REGISTERED_DISCRIMINATOR_NODES } from './discriminatorNodes/DiscriminatorNode';
import { REGISTERED_LINK_NODES } from './linkNodes/LinkNode';
import { REGISTERED_PDA_SEED_NODES } from './pdaSeedNodes/PdaSeedNode';
import { REGISTERED_COUNT_NODES } from './countNodes/CountNode';
import { REGISTERED_TYPE_NODES } from './typeNodes/TypeNode';
import { REGISTERED_VALUE_NODES } from './valueNodes/ValueNode';

// Node Registration.

const REGISTERED_NODES = {
  rootNode: {} as RootNode,
  programNode: {} as ProgramNode,
  pdaNode: {} as PdaNode,
  accountNode: {} as AccountNode,
  instructionAccountNode: {} as InstructionAccountNode,
  instructionArgumentNode: {} as InstructionArgumentNode,
  instructionByteDeltaNode: {} as InstructionByteDeltaNode,
  instructionNode: {} as InstructionNode,
  instructionRemainingAccountsNode: {} as InstructionRemainingAccountsNode,
  errorNode: {} as ErrorNode,
  definedTypeNode: {} as DefinedTypeNode,

  // Groups.
  ...REGISTERED_CONTEXTUAL_VALUE_NODES,
  ...REGISTERED_DISCRIMINATOR_NODES,
  ...REGISTERED_LINK_NODES,
  ...REGISTERED_PDA_SEED_NODES,
  ...REGISTERED_COUNT_NODES,
  ...REGISTERED_TYPE_NODES,
  ...REGISTERED_VALUE_NODES,
};

export const REGISTERED_NODE_KINDS = getNodeKinds(REGISTERED_NODES);
export type NodeDictionary = typeof REGISTERED_NODES;
export type NodeKind = keyof NodeDictionary;
export type Node = NodeDictionary[NodeKind];

// Node Helpers.

export function isNode<TKind extends NodeKind>(
  node: Node | null | undefined,
  kind: TKind | TKind[]
): node is NodeDictionary[TKind] {
  const kinds = Array.isArray(kind) ? kind : [kind];
  return !!node && (kinds as NodeKind[]).includes(node.kind);
}

export function assertIsNode<TKind extends NodeKind>(
  node: Node | null | undefined,
  kind: TKind | TKind[]
): asserts node is NodeDictionary[TKind] {
  const kinds = Array.isArray(kind) ? kind : [kind];
  if (!isNode(node, kinds)) {
    throw new Error(
      `Expected ${kinds.join(' | ')}, got ${node?.kind ?? 'null'}.`
    );
  }
}

export function isNodeFilter<TKind extends NodeKind>(
  kind: TKind | TKind[]
): (node: Node | null | undefined) => node is NodeDictionary[TKind] {
  return (node): node is NodeDictionary[TKind] => isNode(node, kind);
}

export function assertIsNodeFilter<TKind extends NodeKind>(
  kind: TKind | TKind[]
): (node: Node | null | undefined) => node is NodeDictionary[TKind] {
  return (node): node is NodeDictionary[TKind] => {
    assertIsNode(node, kind);
    return true;
  };
}

export function removeNullAndAssertIsNodeFilter<TKind extends NodeKind>(
  kind: TKind | TKind[]
): (node: Node | null | undefined) => node is NodeDictionary[TKind] {
  return (node): node is NodeDictionary[TKind] => {
    if (node) assertIsNode(node, kind);
    return node != null;
  };
}
