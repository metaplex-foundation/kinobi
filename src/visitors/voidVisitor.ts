import { RegisteredNodes } from '../nodes';
import { Visitor } from './visitor';
import { mergeVisitor } from './mergeVisitor';

export function voidVisitor<
  TNodeKeys extends keyof RegisteredNodes = keyof RegisteredNodes
>(nodeKeys?: TNodeKeys[]): Visitor<void, TNodeKeys> {
  return mergeVisitor(
    () => undefined,
    () => undefined,
    nodeKeys
  );
}
