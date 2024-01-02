import { Node, REGISTERED_NODE_KINDS, NodeDictionary } from '../nodes';
import { Visitor, getVisitFunctionName } from './visitor';

export function staticVisitor<
  TReturn,
  TNodeKeys extends keyof NodeDictionary = keyof NodeDictionary
>(
  fn: (node: Node) => TReturn,
  nodeKeys: TNodeKeys[] = REGISTERED_NODE_KINDS as TNodeKeys[]
): Visitor<TReturn, TNodeKeys> {
  const visitor = {} as Visitor<TReturn>;
  nodeKeys.forEach((key) => {
    visitor[getVisitFunctionName(key)] = fn.bind(visitor);
  });
  return visitor;
}
