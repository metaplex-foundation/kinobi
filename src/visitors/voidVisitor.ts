import { NodeDictionary } from '../nodes';
import { Visitor } from './visitor';
import { mergeVisitor } from './mergeVisitor';

export function voidVisitor<
  TNodeKeys extends keyof NodeDictionary = keyof NodeDictionary
>(nodeKeys?: TNodeKeys[]): Visitor<void, TNodeKeys> {
  return mergeVisitor(
    () => undefined,
    () => undefined,
    nodeKeys
  );
}
