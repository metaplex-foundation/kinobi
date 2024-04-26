import type { IdlType } from './IdlType';

export type IdlConstant = {
  name: string;
  type: IdlType;
  value: string;
};
