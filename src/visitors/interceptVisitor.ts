import { Node, NodeKind, REGISTERED_NODE_KINDS } from '../nodes';
import {
  GetVisitorFunctionName,
  Visitor,
  getVisitFunctionName,
} from './visitor';

export type VisitorInterceptor<TReturn> = <TNode extends Node>(
  node: TNode,
  next: (node: TNode) => TReturn
) => TReturn;

export function interceptVisitor<TReturn, TNodeKind extends NodeKind>(
  visitor: Visitor<TReturn, TNodeKind>,
  interceptor: VisitorInterceptor<TReturn>
): Visitor<TReturn, TNodeKind> {
  const registeredVisitFunctions =
    REGISTERED_NODE_KINDS.map(getVisitFunctionName);

  return Object.fromEntries(
    Object.keys(visitor).flatMap((key) => {
      if (!(registeredVisitFunctions as string[]).includes(key)) {
        return [];
      }
      const castedKey = key as GetVisitorFunctionName<TNodeKind>;

      return [
        [
          castedKey,
          function interceptedVisitNode<TNode extends Node>(
            this: Visitor<TReturn, TNodeKind>,
            node: TNode
          ) {
            const baseFunction = visitor[castedKey] as unknown as (
              node: TNode
            ) => TReturn;
            return interceptor<TNode>(node, baseFunction.bind(this));
          },
        ],
      ];
    })
  ) as Visitor<TReturn, TNodeKind>;
}
