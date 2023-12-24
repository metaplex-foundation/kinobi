import * as nodes from '../nodes';
import { NodeStack } from './NodeStack';
import { Visitor } from './Visitor';
import { IdentityInterceptor, identityVisitor } from './identityVisitor';

export type NodeTransformer<TNode extends nodes.Node = nodes.Node> = (
  node: TNode,
  stack: NodeStack
) => nodes.Node | null;

export function transformerVisitor<
  TNodeKeys extends keyof nodes.RegisteredNodes = keyof nodes.RegisteredNodes
>(
  transformers: NodeTransformer[],
  options: {
    nodeKeys?: TNodeKeys[];
  } = {}
): Visitor<nodes.Node | null, TNodeKeys> {
  const stack = new NodeStack();

  const intercept: IdentityInterceptor = (fn) => (node) => {
    stack.push(node);
    const newNode = fn(node);
    stack.pop();
    return applyTransformers(transformers, stack.clone(), newNode);
  };

  return identityVisitor({ ...options, intercept });
}

function applyTransformers(
  transformers: NodeTransformer[],
  stack: NodeStack,
  node: nodes.Node | null
): nodes.Node | null {
  if (node === null) return null;
  return transformers.reduce(
    (acc, transformer) => (acc === null ? null : transformer(acc, stack)),
    node as nodes.Node | null
  );
}
