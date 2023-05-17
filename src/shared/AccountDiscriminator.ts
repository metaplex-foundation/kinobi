import { mainCase } from './utils';

export type AccountDiscriminator =
  | { kind: 'constant'; name: string}
  | { kind: 'field'; name: string }
  | { kind: 'size' };

export const fieldAccountDiscriminator = (
  name: string
): AccountDiscriminator => ({ kind: 'field', name: mainCase(name) });

export const constantAccountDiscriminator = (
  name: string
): AccountDiscriminator => ({ kind: 'constant', name: mainCase(name) });

export const sizeAccountDiscriminator = (): AccountDiscriminator => ({
  kind: 'size',
});
