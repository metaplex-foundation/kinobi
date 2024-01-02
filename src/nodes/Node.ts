import { getNodeKeys } from '../shared/utils';
import type { AccountDataNode } from './AccountDataNode';
import type { AccountNode } from './AccountNode';
import type { DefinedTypeNode } from './DefinedTypeNode';
import type { ErrorNode } from './ErrorNode';
import type { InstructionAccountNode } from './InstructionAccountNode';
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

export const REGISTERED_NODE_KEYS = getNodeKeys(REGISTERED_NODES);
export type RegisteredNodes = typeof REGISTERED_NODES;
export type NodeKey = typeof REGISTERED_NODE_KEYS[number];
export type Node = RegisteredNodes[NodeKey];

// Node Helpers.

export function isNode<TKeys extends NodeKey>(
  node: Node | null | undefined,
  key: TKeys | TKeys[]
): node is RegisteredNodes[TKeys] {
  const keys = Array.isArray(key) ? key : [key];
  return !!node && (keys as NodeKey[]).includes(node.kind);
}

export function assertIsNode<TKeys extends NodeKey>(
  node: Node | null | undefined,
  key: TKeys | TKeys[]
): asserts node is RegisteredNodes[TKeys] {
  const keys = Array.isArray(key) ? key : [key];
  if (!isNode(node, keys)) {
    throw new Error(
      `Expected ${keys.join(' | ')}, got ${node?.kind ?? 'null'}.`
    );
  }
}

export function isNodeFilter<TKeys extends NodeKey>(
  key: TKeys | TKeys[]
): (node: Node | null | undefined) => node is RegisteredNodes[TKeys] {
  return (node): node is RegisteredNodes[TKeys] => isNode(node, key);
}

export function assertIsNodeFilter<TKeys extends NodeKey>(
  key: TKeys | TKeys[]
): (node: Node | null | undefined) => node is RegisteredNodes[TKeys] {
  return (node): node is RegisteredNodes[TKeys] => {
    assertIsNode(node, key);
    return true;
  };
}

export function removeNullAndAssertIsNodeFilter<TKeys extends NodeKey>(
  key: TKeys | TKeys[]
): (node: Node | null | undefined) => node is RegisteredNodes[TKeys] {
  return (node): node is RegisteredNodes[TKeys] => {
    if (node) assertIsNode(node, key);
    return node != null;
  };
}
