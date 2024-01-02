import { Node, REGISTERED_NODE_KINDS, RegisteredNodes } from '../nodes';
import {
  GetVisitorFunctionName,
  Visitor,
  getVisitFunctionName,
} from './visitor';

export type VisitorInterceptor<TReturn> = <TNode extends Node>(
  node: TNode,
  next: (node: TNode) => TReturn
) => TReturn;

export function interceptVisitor<
  TReturn,
  TNodeKeys extends keyof RegisteredNodes
>(
  visitor: Visitor<TReturn, TNodeKeys>,
  interceptor: VisitorInterceptor<TReturn>
): Visitor<TReturn, TNodeKeys> {
  const registeredVisitFunctions =
    REGISTERED_NODE_KINDS.map(getVisitFunctionName);

  return Object.fromEntries(
    Object.keys(visitor).flatMap((key) => {
      if (!(registeredVisitFunctions as string[]).includes(key)) {
        return [];
      }
      const castedKey = key as GetVisitorFunctionName<TNodeKeys>;

      return [
        [
          castedKey,
          function interceptedVisitNode<TNode extends Node>(
            this: Visitor<TReturn, TNodeKeys>,
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
  ) as Visitor<TReturn, TNodeKeys>;
}
