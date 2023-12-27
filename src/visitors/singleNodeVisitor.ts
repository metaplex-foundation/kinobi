import { RegisteredNodes, RootNode } from '../nodes';
import {
  GetVisitorFunctionName,
  Visitor,
  getVisitFunctionName,
} from './visitor2';

export function singleNodeVisitor<
  TReturn,
  TNodeKey extends keyof RegisteredNodes = keyof RegisteredNodes
>(
  key: TNodeKey,
  fn: (node: RegisteredNodes[TNodeKey]) => TReturn
): Visitor<TReturn, TNodeKey> {
  const visitor = {} as Visitor<TReturn, TNodeKey>;
  visitor[getVisitFunctionName(key)] = fn as unknown as Visitor<
    TReturn,
    TNodeKey
  >[GetVisitorFunctionName<TNodeKey>];

  return visitor;
}

export function rootNodeVisitor(fn: (node: RootNode) => RootNode) {
  return singleNodeVisitor('rootNode', fn);
}
