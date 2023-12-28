import {
  ProgramNode,
  ProgramNodeInput,
  assertProgramNode,
  programNode,
} from '../nodes';
import {
  BottomUpNodeTransformer,
  BottomUpNodeTransformerWithSelector,
  bottomUpTransformerVisitor,
} from './bottomUpTransformerVisitor';

export type ProgramUpdates =
  | BottomUpNodeTransformer<ProgramNode>
  | { delete: true }
  | Partial<
      Omit<
        ProgramNodeInput,
        'accounts' | 'instructions' | 'definedTypes' | 'errors'
      >
    >;

export function updateProgramsVisitor(map: Record<string, ProgramUpdates>) {
  return bottomUpTransformerVisitor(
    Object.entries(map).map(
      ([name, updates]): BottomUpNodeTransformerWithSelector => ({
        select: `[programNode]${name}`,
        transform: (node, stack) => {
          assertProgramNode(node);
          if (typeof updates === 'function') {
            return updates(node, stack);
          }
          if ('delete' in updates) {
            return null;
          }
          return programNode({ ...node, ...updates });
        },
      })
    )
  );
}
