import { DontInfer } from '../shared';
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
    next: (node: RegisteredNodes[K]) => TReturn,
    visitor: Visitor<TReturn, TNodeKeys>
  ) => TReturn;
};

export function extendVisitor<TReturn, TNodeKeys extends keyof RegisteredNodes>(
  visitor: Visitor<TReturn, TNodeKeys>,
  overrides: DontInfer<VisitorOverrides<TReturn, TNodeKeys>>
): Visitor<TReturn, TNodeKeys> {
  const registeredVisitFunctions =
    REGISTERED_NODES_KEYS.map(getVisitFunctionName);

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
            const extendedFunction = overrides[castedKey] as (
              node: TNode,
              next: (node: TNode) => TReturn,
              visitor: Visitor<TReturn, TNodeKeys>
            ) => TReturn;
            const nextFunction = visitor[castedKey] as unknown as (
              node: TNode
            ) => TReturn;
            return extendedFunction.bind(this)(
              node,
              nextFunction.bind(this),
              this
            );
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
