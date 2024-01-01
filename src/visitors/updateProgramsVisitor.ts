import {
  ProgramNodeInput,
  assertIsNode,
  programLinkNode,
  programNode,
} from '../nodes';
import { mainCase } from '../shared';
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
    Object.entries(map).flatMap(
      ([name, updates]): BottomUpNodeTransformerWithSelector[] => {
        const newName =
          typeof updates === 'object' && 'name' in updates && updates.name
            ? mainCase(updates.name)
            : undefined;

        const transformers: BottomUpNodeTransformerWithSelector[] = [
          {
            select: `[programNode]${name}`,
            transform: (node) => {
              assertIsNode(node, 'programNode');
              if ('delete' in updates) return null;
              return programNode({ ...node, ...updates });
            },
          },
        ];

        if (newName) {
          transformers.push({
            select: `[programLinkNode]${name}`,
            transform: (node) => {
              assertIsNode(node, 'programLinkNode');
              if (node.importFrom) return node;
              return programLinkNode(newName);
            },
          });
        }

        return transformers;
      }
    )
  );
}
