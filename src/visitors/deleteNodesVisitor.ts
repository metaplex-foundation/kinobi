import { NodeSelector } from '../shared';
import { NodeDictionary } from '../nodes';
import {
  TopDownNodeTransformerWithSelector,
  topDownTransformerVisitor,
} from './topDownTransformerVisitor';

export function deleteNodesVisitor<
  TNodeKeys extends keyof NodeDictionary = keyof NodeDictionary
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
