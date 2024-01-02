import { REGISTERED_NODE_KINDS, NodeDictionary } from '../nodes';
import {
  GetVisitorFunctionName,
  Visitor,
  getVisitFunctionName,
} from './visitor';

export function mapVisitor<
  TReturnFrom,
  TReturnTo,
  TNodeKeys extends keyof NodeDictionary
>(
  visitor: Visitor<TReturnFrom, TNodeKeys>,
  map: (from: TReturnFrom) => TReturnTo
): Visitor<TReturnTo, TNodeKeys> {
  const registeredVisitFunctions =
    REGISTERED_NODE_KINDS.map(getVisitFunctionName);
  return Object.fromEntries(
    Object.keys(visitor).flatMap((key) => {
      if (!(registeredVisitFunctions as string[]).includes(key)) {
        return [];
      }

      return [
        [
          key,
          (node: NodeDictionary[TNodeKeys]) =>
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
