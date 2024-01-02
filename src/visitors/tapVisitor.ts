import { NodeDictionary } from '../nodes';
import {
  GetVisitorFunctionName,
  Visitor,
  getVisitFunctionName,
} from './visitor';

export function tapVisitor<
  TReturn,
  TNodeKey extends keyof NodeDictionary,
  TVisitor extends Visitor<TReturn, TNodeKey>
>(
  visitor: TVisitor,
  key: TNodeKey,
  tap: (node: NodeDictionary[TNodeKey]) => void
): TVisitor {
  const newVisitor = { ...visitor };
  newVisitor[getVisitFunctionName(key)] = function tappedVisitNode(
    this: TVisitor,
    node: NodeDictionary[TNodeKey]
  ): TReturn {
    tap(node);
    const parentFunction = visitor[getVisitFunctionName(key)] as (
      node: NodeDictionary[TNodeKey]
    ) => TReturn;
    return parentFunction.bind(this)(node);
  } as TVisitor[GetVisitorFunctionName<TNodeKey>];

  return newVisitor;
}
