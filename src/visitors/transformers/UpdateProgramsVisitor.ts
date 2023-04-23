import * as nodes from '../../nodes';
import {
  NodeTransform,
  NodeTransformer,
  TransformNodesVisitor,
} from './TransformNodesVisitor';

export type ProgramUpdates =
  | NodeTransformer<nodes.ProgramNode>
  | { delete: true }
  | Partial<
      Omit<
        nodes.ProgramNodeInput,
        'accounts' | 'instructions' | 'definedTypes' | 'errors'
      >
    >;

export class UpdateProgramsVisitor extends TransformNodesVisitor {
  constructor(readonly map: Record<string, ProgramUpdates>) {
    const transforms = Object.entries(map).map(
      ([name, updates]): NodeTransform => ({
        selector: { kind: 'programNode', name },
        transformer: (node, stack, program) => {
          nodes.assertProgramNode(node);
          if (typeof updates === 'function') {
            return updates(node, stack, program);
          }
          if ('delete' in updates) {
            return null;
          }
          return nodes.programNode({ ...node, ...updates });
        },
      })
    );

    super(transforms);
  }
}
