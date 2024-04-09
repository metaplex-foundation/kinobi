import { GetNodeFromKind, NodeKind } from '../nodes';
import {
  GetVisitorFunctionName,
  Visitor,
  getVisitFunctionName,
} from './visitor';

export function tapVisitor<
  TReturn,
  TNodeKey extends NodeKind,
  TVisitor extends Visitor<TReturn, TNodeKey>,
>(
  visitor: TVisitor,
  key: TNodeKey,
  tap: (node: GetNodeFromKind<TNodeKey>) => void
): TVisitor {
  const newVisitor = { ...visitor };
  newVisitor[getVisitFunctionName(key)] = function tappedVisitNode(
    this: TVisitor,
    node: GetNodeFromKind<TNodeKey>
  ): TReturn {
    tap(node);
    const parentFunction = visitor[getVisitFunctionName(key)] as (
      node: GetNodeFromKind<TNodeKey>
    ) => TReturn;
    return parentFunction.bind(this)(node);
  } as TVisitor[GetVisitorFunctionName<TNodeKey>];

  return newVisitor;
}
