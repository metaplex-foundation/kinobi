import type { IdlTypeStruct } from './IdlType';

export type IdlAccount = {
  name: string;
  type: IdlTypeStruct;
  docs?: string[];
};
