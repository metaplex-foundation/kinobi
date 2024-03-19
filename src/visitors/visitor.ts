import {
  Node,
  NodeDictionary,
  NodeKind,
  REGISTERED_NODE_KINDS,
} from '../nodes';
import { KinobiError, pascalCase } from '../shared';

export type Visitor<TReturn, TNodeKind extends NodeKind = NodeKind> = {
  [K in TNodeKind as GetVisitorFunctionName<K>]: (
    node: NodeDictionary[K]
  ) => TReturn;
};

export type GetVisitorFunctionName<T extends Node['kind']> =
  T extends `${infer TWithoutNode}Node`
    ? `visit${Capitalize<TWithoutNode>}`
    : never;

// This first overload enables class-based visitors.
export function visit<TReturn>(node: Node, visitor: Visitor<TReturn>): TReturn;
export function visit<TReturn, TNode extends Node>(
  node: TNode,
  visitor: Visitor<TReturn, TNode['kind']>
): TReturn;
export function visit<TReturn, TNode extends Node>(
  node: TNode,
  visitor: Visitor<TReturn, TNode['kind']>
): TReturn {
  const key = getVisitFunctionName(node.kind) as GetVisitorFunctionName<
    TNode['kind']
  >;
  return (
    visitor[key] as (typeof visitor)[typeof key] & ((node: TNode) => TReturn)
  )(node);
}

export function visitOrElse<TReturn>(
  node: Node,
  visitor: Visitor<TReturn, any>,
  fallback: (node: Node) => TReturn
): TReturn {
  const key = getVisitFunctionName(node.kind);
  return (key in visitor ? visitor[key] : fallback)(node);
}

export function getVisitFunctionName<T extends Node['kind']>(node: T) {
  if (!REGISTERED_NODE_KINDS.includes(node)) {
    throw new KinobiError(`Unrecognized node [${node}]`);
  }

  return `visit${pascalCase(node.slice(0, -4))}` as GetVisitorFunctionName<T>;
}
