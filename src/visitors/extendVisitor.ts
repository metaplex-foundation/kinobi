import { REGISTERED_NODES_KEYS, RegisteredNodes } from '../nodes';
import {
  GetVisitorFunctionName,
  Visitor,
  getVisitFunctionName,
} from './visitor';

export type VisitorOverrides<
  TReturn,
  TNodeKeys extends keyof RegisteredNodes
> = {
  [K in TNodeKeys as GetVisitorFunctionName<K>]?: (
    node: RegisteredNodes[K],
    next: (node: RegisteredNodes[K]) => TReturn
  ) => TReturn;
};

export function extendVisitor<TReturn, TNodeKeys extends keyof RegisteredNodes>(
  visitor: Visitor<TReturn, TNodeKeys>,
  overrides: VisitorOverrides<TReturn, TNodeKeys>
): Visitor<TReturn, TNodeKeys> {
  const registeredVisitFunctions =
    REGISTERED_NODES_KEYS.map(getVisitFunctionName);

  const overriddenFunctions = Object.fromEntries(
    Object.keys(overrides).flatMap((key) => {
      if (!(registeredVisitFunctions as string[]).includes(key)) {
        return [];
      }
      const castedKey = key as GetVisitorFunctionName<TNodeKeys>;

      return [
        [
          castedKey,
          function extendedVisitNode<TNode extends Node>(
            this: Visitor<TReturn, TNodeKeys>,
            node: TNode
          ) {
            const baseFunction = visitor[castedKey] as unknown as (
              node: TNode
            ) => TReturn;
            const extendedFunction = overrides[castedKey] as unknown as (
              node: TNode,
              next: (node: TNode) => TReturn
            ) => TReturn;
            return extendedFunction(node, baseFunction.bind(this));
          },
        ],
      ];
    })
  ) as Partial<Visitor<TReturn, TNodeKeys>>;

  return {
    ...visitor,
    ...overriddenFunctions,
  };
}
