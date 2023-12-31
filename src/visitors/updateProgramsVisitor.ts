import { ProgramNodeInput, assertIsNode, programNode } from '../nodes';
import {
  BottomUpNodeTransformerWithSelector,
  bottomUpTransformerVisitor,
} from './bottomUpTransformerVisitor';

export type ProgramUpdates =
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
        transform: (node) => {
          assertIsNode(node, 'programNode');
          if ('delete' in updates) return null;
          return programNode({ ...node, ...updates });
        },
      })
    )
  );
}
