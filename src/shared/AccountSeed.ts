import type { TypeNode } from '../nodes';
import { mainCase } from './utils';

export type AccountSeed =
  | { kind: 'programId' }
  | { kind: 'literal'; value: string }
  | { kind: 'variable'; name: string; variableNode: TypeNode; docs: string[] };

export const programSeed = (): AccountSeed => ({ kind: 'programId' });

export const literalSeed = (value: string): AccountSeed => ({
  kind: 'literal',
  value,
});

export const variableSeed = (
  name: string,
  variableNode: TypeNode,
  docs?: string[]
): AccountSeed => ({
  kind: 'variable',
  name: mainCase(name),
  variableNode,
  docs: docs ?? [],
});