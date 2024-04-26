import type { IdlDiscriminator } from './IdlType';

export type IdlEvent = {
  name: string;
  discriminator: IdlDiscriminator;
};
