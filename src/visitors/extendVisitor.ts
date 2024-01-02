import { DontInfer } from '../shared';
import { REGISTERED_NODE_KEYS, RegisteredNodes, Node } from '../nodes';
import {
  GetVisitorFunctionName,
  Visitor,
  getVisitFunctionName,
} from './visitor';

export type VisitorOverrideFunction<
  TReturn,
  TNodeKeys extends keyof RegisteredNodes,
  TNode extends Node
> = (
  node: TNode,
  scope: {
    next: (node: TNode) => TReturn;
    self: Visitor<TReturn, TNodeKeys>;
  }
) => TReturn;

export type VisitorOverrides<
  TReturn,
  TNodeKeys extends keyof RegisteredNodes
> = {
  [K in TNodeKeys as GetVisitorFunctionName<K>]?: VisitorOverrideFunction<
    TReturn,
    TNodeKeys,
    RegisteredNodes[K]
  >;
};

export function extendVisitor<TReturn, TNodeKeys extends keyof RegisteredNodes>(
  visitor: Visitor<TReturn, TNodeKeys>,
  overrides: DontInfer<VisitorOverrides<TReturn, TNodeKeys>>
): Visitor<TReturn, TNodeKeys> {
  const registeredVisitFunctions =
    REGISTERED_NODE_KEYS.map(getVisitFunctionName);

  const overriddenFunctions = Object.fromEntries(
    Object.keys(overrides).flatMap((key) => {
      if (!(registeredVisitFunctions as string[]).includes(key)) {
        return [];
      }

      const castedKey = key as GetVisitorFunctionName<TNodeKeys>;

      if (!visitor[castedKey]) {
        throw new Error(
          `Cannot extend visitor with function "${castedKey}" as the base visitor does not support it.`
        );
      }

      return [
        [
          castedKey,
          function extendedVisitNode<TNode extends Node>(
            this: Visitor<TReturn, TNodeKeys>,
            node: TNode
          ) {
            const extendedFunction = overrides[
              castedKey
            ] as VisitorOverrideFunction<TReturn, TNodeKeys, TNode>;
            const nextFunction = visitor[castedKey] as unknown as (
              node: TNode
            ) => TReturn;
            return extendedFunction.bind(this)(node, {
              next: nextFunction.bind(this),
              self: this,
            });
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
