import { Node, RegisteredNodes } from '../nodes';
import { NodeSelector, NodeStack, getNodeSelectorFunction } from '../shared';
import { Visitor } from './visitor';
import { identityVisitor } from './identityVisitor';
import { VisitorInterceptor, interceptVisitor } from './interceptVisitor';

export type BottomUpNodeTransformer<TNode extends Node = Node> = (
  node: TNode,
  stack: NodeStack
) => Node | null;

export type BottomUpNodeTransformerWithSelector<TNode extends Node = Node> = {
  select: NodeSelector;
  transform: BottomUpNodeTransformer<TNode>;
};

export function bottomUpTransformerVisitor<
  TNodeKeys extends keyof RegisteredNodes = keyof RegisteredNodes
>(
  transformers: (
    | BottomUpNodeTransformer
    | BottomUpNodeTransformerWithSelector
  )[],
  nodeKeys?: TNodeKeys[]
): Visitor<Node | null, TNodeKeys> {
  const transformerFunctions = transformers.map(
    (transformer): BottomUpNodeTransformer =>
      typeof transformer === 'function'
        ? transformer
        : (node, stack) =>
            getNodeSelectorFunction(transformer.select)(node, stack)
              ? transformer.transform(node, stack)
              : node
  );

  const stack = new NodeStack();
  const interceptor: VisitorInterceptor<Node | null> = (fn) => (node) => {
    stack.push(node);
    const newNode = fn(node);
    stack.pop();
    return transformerFunctions.reduce(
      (acc, transformer) =>
        acc === null ? null : transformer(acc, stack.clone()),
      newNode
    );
  };

  return interceptVisitor(identityVisitor(nodeKeys), interceptor);
}
