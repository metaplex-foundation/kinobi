import * as nodes from '../nodes';
import { NodeStack } from '../shared';
import { Visitor } from './Visitor';
import { IdentityVisitorInterceptor, identityVisitor } from './identityVisitor';

export type TopDownNodeTransformer<TNode extends nodes.Node = nodes.Node> = <
  T extends TNode = TNode
>(
  node: T,
  stack: NodeStack
) => T;

export function topDownTransformerVisitor<
  TNodeKeys extends keyof nodes.RegisteredNodes = keyof nodes.RegisteredNodes
>(
  transformers: TopDownNodeTransformer[],
  options: {
    nodeKeys?: TNodeKeys[];
  } = {}
): Visitor<nodes.Node | null, TNodeKeys> {
  const stack = new NodeStack();
  const intercept: IdentityVisitorInterceptor = (fn) => (node) => {
    const appliedNode = transformers.reduce(
      (acc, transformer) => transformer(acc, stack.clone()),
      node
    );

    stack.push(appliedNode);
    const newNode = fn(appliedNode);
    stack.pop();
    return newNode;
  };

  return identityVisitor({ ...options, intercept });
}
