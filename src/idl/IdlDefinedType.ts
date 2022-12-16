import type { IdlTypeEnum, IdlTypeStruct } from './IdlType';

export type IdlDefinedType = {
  name: string;
  type: IdlTypeStruct | IdlTypeEnum;
  docs?: string[];
};
