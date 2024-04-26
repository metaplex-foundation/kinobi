import type { IdlPdaSeed } from './IdlPda';
import type { IdlTypeStruct, IdlDiscriminator } from './IdlType';

export type IdlAccount = {
  name: string;
  discriminator?: IdlDiscriminator;
  type?: IdlTypeStruct;
  docs?: string[];
  seeds?: IdlPdaSeed[];
  size?: number;
};
