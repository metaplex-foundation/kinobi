import { ErrorNodeInput, assertIsNode, errorNode } from '../nodes';
import {
  BottomUpNodeTransformerWithSelector,
  bottomUpTransformerVisitor,
} from './bottomUpTransformerVisitor';

export type ErrorUpdates = { delete: true } | Partial<ErrorNodeInput>;

export function updateErrorsVisitor(map: Record<string, ErrorUpdates>) {
  return bottomUpTransformerVisitor(
    Object.entries(map).map(
      ([name, updates]): BottomUpNodeTransformerWithSelector => ({
        select: `[errorNode]${name}`,
        transform: (node) => {
          assertIsNode(node, 'errorNode');
          if ('delete' in updates) return null;
          return errorNode({ ...node, ...updates });
        },
      })
    )
  );
}
