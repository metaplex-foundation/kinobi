import { NodeSelector } from '../shared';
import { RegisteredNodes } from '../nodes';
import {
  TopDownNodeTransformerWithSelector,
  topDownTransformerVisitor,
} from './topDownTransformerVisitor';

export function deleteNodesVisitor<
  TNodeKeys extends keyof RegisteredNodes = keyof RegisteredNodes
>(selectors: NodeSelector[], nodeKeys?: TNodeKeys[]) {
  return topDownTransformerVisitor<TNodeKeys>(
    selectors.map(
      (selector): TopDownNodeTransformerWithSelector => ({
        select: selector,
        transform: () => null,
      })
    ),
    nodeKeys
  );
}
