import type { IdlTypeLeaf } from './IdlType';

export type IdlPda = {
  name: string;
  seeds: IdlPdaSeed[];
};

export type IdlPdaSeed =
  | { kind: 'programId' }
  | { kind: 'constant'; type: IdlTypeLeaf; value: string | boolean | number }
  | { kind: 'variable'; name: string; description: string; type: IdlTypeLeaf };
