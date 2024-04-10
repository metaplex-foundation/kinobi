import type { ConstantPdaSeedNode } from './ConstantPdaSeedNode';
import type { VariablePdaSeedNode } from './VariablePdaSeedNode';

// Pda Seed Node Registration.
export type RegisteredPdaSeedNode = ConstantPdaSeedNode | VariablePdaSeedNode;
export const REGISTERED_PDA_SEED_NODE_KINDS = [
  'constantPdaSeedNode',
  'variablePdaSeedNode',
] satisfies readonly RegisteredPdaSeedNode['kind'][];
null as unknown as RegisteredPdaSeedNode['kind'] satisfies (typeof REGISTERED_PDA_SEED_NODE_KINDS)[number];

// Pda Seed Node Helpers.
export type PdaSeedNode = RegisteredPdaSeedNode;
export const PDA_SEED_NODES = REGISTERED_PDA_SEED_NODE_KINDS;
