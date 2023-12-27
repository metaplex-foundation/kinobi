import { Node, REGISTERED_NODES_KEYS, RegisteredNodes } from '../nodes';
import {
  GetVisitorFunctionName,
  Visitor,
  getVisitFunctionName,
} from './visitor';

export type VisitorInterceptor<TReturn> = <TNode extends Node>(
  fn: (node: TNode) => TReturn
) => (node: TNode) => TReturn;

export function interceptVisitor<
  TReturn,
  TNodeKeys extends keyof RegisteredNodes
>(
  visitor: Visitor<TReturn, TNodeKeys>,
  interceptor: VisitorInterceptor<TReturn>
): Visitor<TReturn, TNodeKeys> {
  const registeredVisitFunctions =
    REGISTERED_NODES_KEYS.map(getVisitFunctionName);

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
            return interceptor<TNode>(baseFunction.bind(this))(node);
          },
        ],
      ];
    })
  ) as Visitor<TReturn, TNodeKeys>;
}
