import { RegisteredNodes } from '../nodes';
import {
  GetVisitorFunctionName,
  Visitor,
  getVisitFunctionName,
} from './visitor';

export function tapVisitor<
  TReturn,
  TNodeKey extends keyof RegisteredNodes,
  TVisitor extends Visitor<TReturn, TNodeKey>
>(
  visitor: TVisitor,
  key: TNodeKey,
  tap: (node: RegisteredNodes[TNodeKey]) => void
): TVisitor {
  const newVisitor = { ...visitor };
  newVisitor[getVisitFunctionName(key)] = ((
    node: RegisteredNodes[TNodeKey]
  ): TReturn => {
    tap(node);
    return (
      visitor[getVisitFunctionName(key)] as (
        node: RegisteredNodes[TNodeKey]
      ) => TReturn
    )(node);
  }) as TVisitor[GetVisitorFunctionName<TNodeKey>];

  return newVisitor;
}
