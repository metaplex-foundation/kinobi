import type { IdlTypeLeaf } from './IdlType';

export type IdlSeed = IdlSeedConst | IdlSeedArg | IdlSeedAccount;

export type IdlSeedConst = {
  kind: 'const';
  value: number[];
};

export type IdlSeedArg = {
  kind: 'arg';
  path: string;
};

export type IdlSeedAccount = {
  kind: 'account';
  path: string;
  account?: string;
};

export type IdlInstructionPda = {
  seeds: IdlSeed[];
  program?: IdlSeed;
};

export type IdlPda = {
  name: string;
  seeds: IdlPdaSeed[];
};

export type IdlPdaSeed =
  | { kind: 'programId' }
  | { kind: 'constant'; type: IdlTypeLeaf; value: string | boolean | number }
  | { kind: 'variable'; name: string; description: string; type: IdlTypeLeaf };
