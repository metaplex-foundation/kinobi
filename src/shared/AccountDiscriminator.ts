import { mainCase } from './utils';

export type AccountDiscriminator =
  | { kind: 'field'; name: string }
  | { kind: 'size' };

export const fieldAccountDiscriminator = (
  name: string
): AccountDiscriminator => ({ kind: 'field', name: mainCase(name) });

export const sizeAccountDiscriminator = (): AccountDiscriminator => ({
  kind: 'size',
});
