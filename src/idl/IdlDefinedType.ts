import type { IdlTypeEnum, IdlTypeFields } from './IdlType';

export type IdlDefinedType = {
  name: string;
  type: IdlTypeFields | IdlTypeEnum;
};
