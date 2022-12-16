import type { IdlTypeFields } from './IdlType';

export type IdlAccount = {
  name: string;
  desc?: string;
  type: IdlTypeFields;
};
