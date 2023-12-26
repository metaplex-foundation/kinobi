import * as nodes from '../nodes';
import { NodeSelector, NodeStack, getNodeSelectorFunction } from '../shared';
import { Visitor } from './Visitor';
import { IdentityVisitorInterceptor, identityVisitor } from './identityVisitor';

export type BottomUpNodeTransformer<TNode extends nodes.Node = nodes.Node> = (
  node: TNode,
  stack: NodeStack
) => nodes.Node | null;

export type BottomUpNodeTransformerWithSelector<
  TNode extends nodes.Node = nodes.Node
> = {
  select: NodeSelector;
  transform: BottomUpNodeTransformer<TNode>;
};

export function bottomUpTransformerVisitor<
  TNodeKeys extends keyof nodes.RegisteredNodes = keyof nodes.RegisteredNodes
>(
  transformers: (
    | BottomUpNodeTransformer
    | BottomUpNodeTransformerWithSelector
  )[],
  options: {
    nodeKeys?: TNodeKeys[];
  } = {}
): Visitor<nodes.Node | null, TNodeKeys> {
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
  const intercept: IdentityVisitorInterceptor = (fn) => (node) => {
    stack.push(node);
    const newNode = fn(node);
    stack.pop();
    return transformerFunctions.reduce(
      (acc, transformer) =>
        acc === null ? null : transformer(acc, stack.clone()),
      newNode
    );
  };

  return identityVisitor({ ...options, intercept });
}
