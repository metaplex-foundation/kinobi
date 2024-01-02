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

export type BottomUpNodeTransformer<TNode extends Node = Node> = (
  node: TNode,
  stack: NodeStack
) => Node | null;

export type BottomUpNodeTransformerWithSelector<TNode extends Node = Node> = {
  select: NodeSelector;
  transform: BottomUpNodeTransformer<TNode>;
};

export function bottomUpTransformerVisitor<
  TNodeKeys extends keyof NodeDictionary = keyof NodeDictionary
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
  return pipe(
    identityVisitor(nodeKeys),
    (v) => recordNodeStackVisitor(v, stack),
    (v) =>
      interceptVisitor(v, (node, next) =>
        transformerFunctions.reduce(
          (acc, transformer) =>
            acc === null ? null : transformer(acc, stack.clone()),
          next(node)
        )
      )
  );
}
