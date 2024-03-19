import { NodeDictionary, NodeKind, RootNode } from '../nodes';
import {
  GetVisitorFunctionName,
  Visitor,
  getVisitFunctionName,
} from './visitor';

export function singleNodeVisitor<
  TReturn,
  TNodeKey extends NodeKind = NodeKind,
>(
  key: TNodeKey,
  fn: (node: NodeDictionary[TNodeKey]) => TReturn
): Visitor<TReturn, TNodeKey> {
  const visitor = {} as Visitor<TReturn, TNodeKey>;
  visitor[getVisitFunctionName(key)] = fn as unknown as Visitor<
    TReturn,
    TNodeKey
  >[GetVisitorFunctionName<TNodeKey>];

  return visitor;
}

export function rootNodeVisitor<TReturn = RootNode>(
  fn: (node: RootNode) => TReturn
) {
  return singleNodeVisitor('rootNode', fn);
}
