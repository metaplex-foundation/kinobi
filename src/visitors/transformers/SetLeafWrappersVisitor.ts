import * as nodes from '../../nodes';
import { NodeTransform, TransformNodesVisitor } from './TransformNodesVisitor';

type LeafWrapperMap = Record<string, nodes.NumberWrapper>;

export class SetLeafWrappersVisitor extends TransformNodesVisitor {
  constructor(readonly map: LeafWrapperMap) {
    const transforms = Object.entries(map).map(
      ([selectorStack, wrapper]): NodeTransform => ({
        selector: { type: 'typeNumber', stack: selectorStack },
        transformer: (node) => {
          nodes.assertTypeNumberNode(node);
          return new nodes.TypeNumberWrapperNode(node, wrapper);
        },
      })
    );

    super(transforms);
  }
}
