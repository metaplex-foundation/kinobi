import { Node, RegisteredNodes } from '../nodes';
import { NodeSelector, NodeStack, getNodeSelectorFunction } from '../shared';
import { Visitor } from './Visitor';
import { IdentityVisitorInterceptor, identityVisitor } from './identityVisitor';

export type TopDownNodeTransformer<TNode extends Node = Node> = <
  T extends TNode = TNode
>(
  node: T,
  stack: NodeStack
) => T | null;

export type TopDownNodeTransformerWithSelector<TNode extends Node = Node> = {
  select: NodeSelector;
  transform: TopDownNodeTransformer<TNode>;
};

export function topDownTransformerVisitor<
  TNodeKeys extends keyof RegisteredNodes = keyof RegisteredNodes
>(
  transformers: (TopDownNodeTransformer | TopDownNodeTransformerWithSelector)[],
  options: {
    nodeKeys?: TNodeKeys[];
  } = {}
): Visitor<Node | null, TNodeKeys> {
  const transformerFunctions = transformers.map(
    (transformer): TopDownNodeTransformer =>
      typeof transformer === 'function'
        ? transformer
        : (node, stack) =>
            getNodeSelectorFunction(transformer.select)(node, stack)
              ? transformer.transform(node, stack)
              : node
  );

  const stack = new NodeStack();
  const intercept: IdentityVisitorInterceptor = (fn) => (node) => {
    const appliedNode = transformerFunctions.reduce(
      (acc, transformer) =>
        acc === null ? null : transformer(acc, stack.clone()),
      node as Parameters<typeof fn>[0] | null
    );
    if (appliedNode === null) return null;
    stack.push(appliedNode);
    const newNode = fn(appliedNode);
    stack.pop();
    return newNode;
  };

  return identityVisitor({ ...options, intercept });
}
