import * as nodes from '../nodes';
import { Visitor, getVisitFunctionName } from './Visitor';

export function staticVisitor<
  TReturn,
  TNodeKeys extends keyof nodes.RegisteredNodes = keyof nodes.RegisteredNodes
>(
  fn: (node: nodes.Node) => TReturn,
  nodeKeys: TNodeKeys[] = nodes.REGISTERED_NODES_KEYS as TNodeKeys[]
): Visitor<TReturn, TNodeKeys> {
  const visitor = {} as Visitor<TReturn>;
  nodeKeys.forEach((key) => {
    visitor[getVisitFunctionName(key)] = fn;
  });
  return visitor;
}
