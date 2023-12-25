import * as nodes from '../nodes';
import { Visitor } from './Visitor';
import { MergeVisitorInterceptor, mergeVisitor } from './mergeVisitor';

export function voidVisitor<
  TNodeKeys extends keyof nodes.RegisteredNodes = keyof nodes.RegisteredNodes
>(
  options: {
    intercept?: MergeVisitorInterceptor<void>;
    nextVisitor?: Visitor<void, TNodeKeys>;
    nodeKeys?: TNodeKeys[];
  } = {}
): Visitor<void, TNodeKeys> {
  return mergeVisitor(undefined, () => undefined, options);
}
