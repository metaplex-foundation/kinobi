import { getNodeKinds } from '../shared/utils';
import type { AccountDataNode } from './AccountDataNode';
import type { AccountNode } from './AccountNode';
import type { DefinedTypeNode } from './DefinedTypeNode';
import type { ErrorNode } from './ErrorNode';
import type { InstructionAccountNode } from './InstructionAccountNode';
import type { InstructionArgumentNode } from './InstructionArgumentNode';
import type { InstructionDataArgsNode } from './InstructionDataArgsNode';
import type { InstructionExtraArgsNode } from './InstructionExtraArgsNode';
import type { InstructionNode } from './InstructionNode';
import type { PdaNode } from './PdaNode';
import type { ProgramNode } from './ProgramNode';
import type { RootNode } from './RootNode';
import { REGISTERED_CONTEXTUAL_VALUE_NODES } from './contextualValueNodes/ContextualValueNode';
import { REGISTERED_LINK_NODES } from './linkNodes/LinkNode';
import { REGISTERED_PDA_SEED_NODES } from './pdaSeedNodes/PdaSeedNode';
import { REGISTERED_SIZE_NODES } from './sizeNodes/SizeNode';
import { REGISTERED_TYPE_NODES } from './typeNodes/TypeNode';
import { REGISTERED_VALUE_NODES } from './valueNodes/ValueNode';

// Node Registration.

const REGISTERED_NODES = {
  rootNode: {} as RootNode,
  programNode: {} as ProgramNode,
  pdaNode: {} as PdaNode,
  accountNode: {} as AccountNode,
  accountDataNode: {} as AccountDataNode,
  instructionNode: {} as InstructionNode,
  instructionAccountNode: {} as InstructionAccountNode,
  instructionArgumentNode: {} as InstructionArgumentNode,
  instructionDataArgsNode: {} as InstructionDataArgsNode,
  instructionExtraArgsNode: {} as InstructionExtraArgsNode,
  errorNode: {} as ErrorNode,
  definedTypeNode: {} as DefinedTypeNode,

  // Groups.
  ...REGISTERED_CONTEXTUAL_VALUE_NODES,
  ...REGISTERED_LINK_NODES,
  ...REGISTERED_PDA_SEED_NODES,
  ...REGISTERED_SIZE_NODES,
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
