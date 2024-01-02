import { getNodeKinds } from '../../shared/utils';
import type { ConstantPdaSeedNode } from './ConstantPdaSeedNode';
import type { ProgramIdPdaSeedNode } from './ProgramIdPdaSeedNode';
import type { VariablePdaSeedNode } from './VariablePdaSeedNode';

// Pda Seed Node Registration.

export const REGISTERED_PDA_SEED_NODES = {
  constantPdaSeedNode: {} as ConstantPdaSeedNode,
  programIdPdaSeedNode: {} as ProgramIdPdaSeedNode,
  variablePdaSeedNode: {} as VariablePdaSeedNode,
};

export const REGISTERED_PDA_SEED_NODE_KINDS = getNodeKinds(
  REGISTERED_PDA_SEED_NODES
);
export type RegisteredPdaSeedNodeKind =
  typeof REGISTERED_PDA_SEED_NODE_KINDS[number];
export type RegisteredPdaSeedNode =
  typeof REGISTERED_PDA_SEED_NODES[RegisteredPdaSeedNodeKind];

// Pda Seed Node Helpers.

export type PdaSeedNode = RegisteredPdaSeedNode;
export const PDA_SEED_NODES = REGISTERED_PDA_SEED_NODE_KINDS;
