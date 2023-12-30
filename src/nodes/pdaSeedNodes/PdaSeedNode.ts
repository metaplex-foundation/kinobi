import { Node } from '../Node';
import type { ConstantPdaSeedNode } from './ConstantPdaSeedNode';
import type { ProgramIdPdaSeedNode } from './ProgramIdPdaSeedNode';
import type { VariablePdaSeedNode } from './VariablePdaSeedNode';

export const REGISTERED_PDA_SEED_NODES = {
  constantPdaSeedNode: {} as ConstantPdaSeedNode,
  programIdPdaSeedNode: {} as ProgramIdPdaSeedNode,
  variablePdaSeedNode: {} as VariablePdaSeedNode,
};

export const REGISTERED_PDA_SEED_NODE_KEYS = Object.keys(
  REGISTERED_PDA_SEED_NODES
) as (keyof typeof REGISTERED_PDA_SEED_NODES)[];

export type RegisteredPdaSeedNodes = typeof REGISTERED_PDA_SEED_NODES;

export type PdaSeedNode = RegisteredPdaSeedNodes[keyof RegisteredPdaSeedNodes];

export function isPdaSeedNode(node: Node | null): node is PdaSeedNode {
  return (
    !!node && (REGISTERED_PDA_SEED_NODE_KEYS as string[]).includes(node.kind)
  );
}

export function assertPdaSeedNode(
  node: Node | null
): asserts node is PdaSeedNode {
  if (!isPdaSeedNode(node)) {
    throw new Error(`Expected typeNode, got ${node?.kind ?? 'null'}.`);
  }
}
