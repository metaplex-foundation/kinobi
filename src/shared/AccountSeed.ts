import { TypeNode, publicKeyTypeNode } from '../nodes';
import { mainCase } from './utils';

export type AccountSeed =
  | { kind: 'programId' }
  | { kind: 'literal'; value: string }
  | { kind: 'variable'; name: string; type: TypeNode; docs: string[] };

export const programSeed = (): AccountSeed => ({ kind: 'programId' });

export const literalSeed = (value: string): AccountSeed => ({
  kind: 'literal',
  value,
});

export const variableSeed = (
  name: string,
  type: TypeNode,
  docs: string | string[] = []
): AccountSeed => ({
  kind: 'variable',
  name: mainCase(name),
  type,
  docs: Array.isArray(docs) ? docs : [docs],
});

export const publicKeySeed = (
  name: string,
  docs: string | string[] = []
): AccountSeed => variableSeed(name, publicKeyTypeNode(), docs);
