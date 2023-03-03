import * as nodes from '../../nodes';
import { NodeTransform, TransformNodesVisitor } from './TransformNodesVisitor';

type NumberWrapperMap = Record<string, nodes.NumberWrapper>;

export class SetNumberWrappersVisitor extends TransformNodesVisitor {
  constructor(readonly map: NumberWrapperMap) {
    const transforms = Object.entries(map).map(
      ([selectorStack, wrapper]): NodeTransform => ({
        selector: { type: 'TypeNumberNode', stack: selectorStack },
        transformer: (node) => {
          nodes.assertTypeNumberNode(node);
          return new nodes.TypeNumberWrapperNode(node, wrapper);
        },
      })
    );

    super(transforms);
  }
}
