import {
  TypeNode,
  ValueNode,
  publicKeyTypeNode,
  remainderSizeNode,
  stringTypeNode,
  vScalar,
} from '../nodes';
import { MainCaseString, mainCase } from './utils';

export type AccountSeed =
  | { kind: 'programId' }
  | { kind: 'constant'; type: TypeNode; value: ValueNode }
  | { kind: 'variable'; name: MainCaseString; type: TypeNode; docs: string[] };

export const programSeed = (): AccountSeed => ({ kind: 'programId' });

export const constantSeed = (
  type: TypeNode,
  value: ValueNode
): AccountSeed => ({ kind: 'constant', type, value });

export const stringConstantSeed = (value: string): AccountSeed =>
  constantSeed(stringTypeNode({ size: remainderSizeNode() }), vScalar(value));

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

export const stringSeed = (
  name: string,
  docs: string | string[] = []
): AccountSeed =>
  variableSeed(name, stringTypeNode({ size: remainderSizeNode() }), docs);
