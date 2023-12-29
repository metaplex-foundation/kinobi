import {
  ErrorNode,
  ErrorNodeInput,
  assertErrorNode,
  errorNode,
} from '../nodes';
import {
  BottomUpNodeTransformer,
  BottomUpNodeTransformerWithSelector,
  bottomUpTransformerVisitor,
} from './bottomUpTransformerVisitor';

export type ErrorUpdates =
  | BottomUpNodeTransformer<ErrorNode>
  | { delete: true }
  | Partial<ErrorNodeInput>;

export function updateErrorsVisitor(map: Record<string, ErrorUpdates>) {
  return bottomUpTransformerVisitor(
    Object.entries(map).map(
      ([name, updates]): BottomUpNodeTransformerWithSelector => ({
        select: `[errorNode]${name}`,
        transform: (node, stack) => {
          assertErrorNode(node);
          if (typeof updates === 'function') {
            return updates(node, stack);
          }
          if ('delete' in updates) {
            return null;
          }
          return errorNode({ ...node, ...updates });
        },
      })
    )
  );
}
