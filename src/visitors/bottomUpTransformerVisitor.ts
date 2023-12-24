import * as nodes from '../nodes';
import { NodeStack } from './NodeStack';
import { Visitor } from './Visitor';
import { IdentityInterceptor, identityVisitor } from './identityVisitor';

export type BottomUpNodeTransformer<TNode extends nodes.Node = nodes.Node> = (
  node: TNode,
  stack: NodeStack
) => nodes.Node | null;

export function bottomUpTransformerVisitor<
  TNodeKeys extends keyof nodes.RegisteredNodes = keyof nodes.RegisteredNodes
>(
  transformers: BottomUpNodeTransformer[],
  options: {
    nodeKeys?: TNodeKeys[];
  } = {}
): Visitor<nodes.Node | null, TNodeKeys> {
  const stack = new NodeStack();
  const intercept: IdentityInterceptor = (fn) => (node) => {
    stack.push(node);
    const newNode = fn(node);
    stack.pop();
    return transformers.reduce(
      (acc, transformer) =>
        acc === null ? null : transformer(acc, stack.clone()),
      newNode
    );
  };

  return identityVisitor({ ...options, intercept });
}
