import { GetNodeFromKind, NodeKind, REGISTERED_NODE_KINDS } from '../nodes';
import {
  GetVisitorFunctionName,
  Visitor,
  getVisitFunctionName,
} from './visitor';

export function mapVisitor<TReturnFrom, TReturnTo, TNodeKind extends NodeKind>(
  visitor: Visitor<TReturnFrom, TNodeKind>,
  map: (from: TReturnFrom) => TReturnTo
): Visitor<TReturnTo, TNodeKind> {
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
          (node: GetNodeFromKind<TNodeKind>) =>
            map(
              (visitor[key as GetVisitorFunctionName<TNodeKind>] as Function)(
                node
              )
            ),
        ],
      ];
    })
  ) as unknown as Visitor<TReturnTo, TNodeKind>;
}
