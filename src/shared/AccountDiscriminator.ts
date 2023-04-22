import type { ValueNode } from '../nodes';
import { mainCase } from './utils';

export type AccountDiscriminator =
  | { kind: 'field'; name: string; value: ValueNode | null }
  | { kind: 'size' };

export const fieldAccountDiscriminator = (
  name: string,
  value?: ValueNode
): AccountDiscriminator => ({
  kind: 'field',
  name: mainCase(name),
  value: value ?? null,
});

export const sizeAccountDiscriminator = (): AccountDiscriminator => ({
  kind: 'size',
});
