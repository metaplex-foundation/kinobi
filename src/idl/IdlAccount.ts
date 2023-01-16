import type { IdlTypeLeaf, IdlTypeStruct } from './IdlType';

export type IdlAccount = {
  name: string;
  type: IdlTypeStruct;
  docs?: string[];
  seeds?: IdlAccountSeed[];
};

export type IdlAccountSeed =
  | { kind: 'programId' }
  | { kind: 'literal'; value: string }
  | { kind: 'variable'; name: string; description: string; type: IdlTypeLeaf };
