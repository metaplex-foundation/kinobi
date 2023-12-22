import { MainCaseString, mainCase } from './utils';

export type AccountDiscriminator =
  | { kind: 'field'; name: MainCaseString; offset: number }
  | { kind: 'size' };

export const fieldAccountDiscriminator = (
  name: string,
  offset: number = 0
): AccountDiscriminator => ({ kind: 'field', name: mainCase(name), offset });

export const sizeAccountDiscriminator = (): AccountDiscriminator => ({
  kind: 'size',
});
