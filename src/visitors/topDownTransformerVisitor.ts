import { Node, NodeDictionary } from '../nodes';
import {
  NodeSelector,
  NodeStack,
  getNodeSelectorFunction,
  pipe,
} from '../shared';
import { identityVisitor } from './identityVisitor';
import { interceptVisitor } from './interceptVisitor';
import { recordNodeStackVisitor } from './recordNodeStackVisitor';
import { Visitor } from './visitor';

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
  TNodeKeys extends keyof NodeDictionary = keyof NodeDictionary
>(
  transformers: (TopDownNodeTransformer | TopDownNodeTransformerWithSelector)[],
  nodeKeys?: TNodeKeys[]
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
  return pipe(
    identityVisitor(nodeKeys),
    (v) => recordNodeStackVisitor(v, stack),
    (v) =>
      interceptVisitor(v, (node, next) => {
        const appliedNode = transformerFunctions.reduce(
          (acc, transformer) =>
            acc === null ? null : transformer(acc, stack.clone()),
          node as Parameters<typeof next>[0] | null
        );
        if (appliedNode === null) return null;
        return next(appliedNode);
      })
  );
}
