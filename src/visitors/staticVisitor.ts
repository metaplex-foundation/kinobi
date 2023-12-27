import { Node, REGISTERED_NODES_KEYS, RegisteredNodes } from '../nodes';
import { Visitor, getVisitFunctionName } from './visitor2';

export function staticVisitor<
  TReturn,
  TNodeKeys extends keyof RegisteredNodes = keyof RegisteredNodes
>(
  fn: (node: Node) => TReturn,
  nodeKeys: TNodeKeys[] = REGISTERED_NODES_KEYS as TNodeKeys[]
): Visitor<TReturn, TNodeKeys> {
  const visitor = {} as Visitor<TReturn>;
  nodeKeys.forEach((key) => {
    visitor[getVisitFunctionName(key)] = fn;
  });
  return visitor;
}
