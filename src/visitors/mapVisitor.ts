import * as nodes from '../nodes';
import {
  GetVisitorFunctionName,
  Visitor,
  getVisitFunctionName,
} from './Visitor';

export function mapVisitor<
  TReturnFrom,
  TReturnTo,
  TNodeKeys extends keyof nodes.RegisteredNodes = keyof nodes.RegisteredNodes
>(
  visitor: Visitor<TReturnFrom, TNodeKeys>,
  map: (from: TReturnFrom) => TReturnTo
): Visitor<TReturnTo, TNodeKeys> {
  const registeredVisitFunctions =
    nodes.REGISTERED_NODES_KEYS.map(getVisitFunctionName);
  return Object.fromEntries(
    Object.keys(visitor).flatMap((key) => {
      if (!(registeredVisitFunctions as string[]).includes(key)) {
        return [];
      }

      return [
        [
          key,
          (node: nodes.RegisteredNodes[TNodeKeys]) =>
            map(
              (visitor[key as GetVisitorFunctionName<TNodeKeys>] as Function)(
                node
              )
            ),
        ],
      ];
    })
  ) as unknown as Visitor<TReturnTo, TNodeKeys>;
}