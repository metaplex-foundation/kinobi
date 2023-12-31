import type { ConstantPdaSeedNode } from './ConstantPdaSeedNode';
import type { ProgramIdPdaSeedNode } from './ProgramIdPdaSeedNode';
import type { VariablePdaSeedNode } from './VariablePdaSeedNode';

// Node Group Registration.

export const REGISTERED_PDA_SEED_NODES = {
  constantPdaSeedNode: {} as ConstantPdaSeedNode,
  programIdPdaSeedNode: {} as ProgramIdPdaSeedNode,
  variablePdaSeedNode: {} as VariablePdaSeedNode,
};

export const REGISTERED_PDA_SEED_NODE_KEYS = Object.keys(
  REGISTERED_PDA_SEED_NODES
) as (keyof typeof REGISTERED_PDA_SEED_NODES)[];

export type RegisteredPdaSeedNodes = typeof REGISTERED_PDA_SEED_NODES;

// Node Group Helpers.

export type PdaSeedNode = RegisteredPdaSeedNodes[keyof RegisteredPdaSeedNodes];

export const PDA_SEED_NODES = REGISTERED_PDA_SEED_NODE_KEYS;
