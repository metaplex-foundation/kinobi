import * as nodes from '../nodes';
import { NodeStack } from './NodeStack';
import { Visitor } from './Visitor';
import { IdentityInterceptor, identityVisitor } from './identityVisitor';

export type NodeTransformer2 = {
  select: NodeTransformerSelect;
  transform: NodeTransformerTransform;
};

export type NodeTransformerSelect<TNode extends nodes.Node = nodes.Node> = (
  node: TNode,
  stack: NodeStack
) => boolean;

export type NodeTransformerTransform<TNode extends nodes.Node = nodes.Node> = (
  node: TNode,
  stack: NodeStack
) => TNode | null;

export function transformerVisitor<
  TNodeKeys extends keyof nodes.RegisteredNodes = keyof nodes.RegisteredNodes
>(
  options: {
    nodeKeys?: TNodeKeys[];
  } = {}
): Visitor<nodes.Node | null, TNodeKeys> {
  const stack = new NodeStack();

  const intercept: IdentityInterceptor = (fn) => (node) => {
    stack.push(node);
    const newNode = fn(node);
    stack.pop();
    return newNode; // TODO: apply transform
  };

  return identityVisitor({ ...options, intercept });
}
