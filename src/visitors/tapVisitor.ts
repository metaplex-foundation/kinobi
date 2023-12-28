import {
  DefinedTypeNode,
  RegisteredNodes,
  RootNode,
  getAllDefinedTypes,
} from '../nodes';
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
  newVisitor[getVisitFunctionName(key)] = function tappedVisitNode(
    this: TVisitor,
    node: RegisteredNodes[TNodeKey]
  ): TReturn {
    tap(node);
    const parentFunction = visitor[getVisitFunctionName(key)] as (
      node: RegisteredNodes[TNodeKey]
    ) => TReturn;
    return parentFunction.bind(this)(node);
  } as TVisitor[GetVisitorFunctionName<TNodeKey>];

  return newVisitor;
}

export function tapDefinedTypesVisitor<
  TReturn,
  TVisitor extends Visitor<TReturn, 'rootNode'>
>(visitor: TVisitor, tap: (definedTypes: DefinedTypeNode[]) => void): TVisitor {
  return tapVisitor(visitor, 'rootNode', (rootNode: RootNode) =>
    tap(getAllDefinedTypes(rootNode))
  );
}