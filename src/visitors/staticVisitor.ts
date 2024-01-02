import { Node, NodeKind, REGISTERED_NODE_KINDS } from '../nodes';
import { Visitor, getVisitFunctionName } from './visitor';

export function staticVisitor<TReturn, TNodeKind extends NodeKind = NodeKind>(
  fn: (node: Node) => TReturn,
  nodeKeys: TNodeKind[] = REGISTERED_NODE_KINDS as TNodeKind[]
): Visitor<TReturn, TNodeKind> {
  const visitor = {} as Visitor<TReturn>;
  nodeKeys.forEach((key) => {
    visitor[getVisitFunctionName(key)] = fn.bind(visitor);
  });
  return visitor;
}
