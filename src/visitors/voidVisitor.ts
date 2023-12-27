import { RegisteredNodes } from '../nodes';
import { Visitor } from './visitor2';
import { MergeVisitorInterceptor, mergeVisitor } from './mergeVisitor';

export function voidVisitor<
  TNodeKeys extends keyof RegisteredNodes = keyof RegisteredNodes
>(
  options: {
    intercept?: MergeVisitorInterceptor<void>;
    nextVisitor?: Visitor<void, TNodeKeys>;
    nodeKeys?: TNodeKeys[];
  } = {}
): Visitor<void, TNodeKeys> {
  return mergeVisitor(
    () => undefined,
    () => undefined,
    options
  );
}
