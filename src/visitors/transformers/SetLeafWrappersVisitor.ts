import * as nodes from '../../nodes';
import { NodeTransform, TransformNodesVisitor } from './TransformNodesVisitor';

type LeafWrapperMap = Record<string, nodes.LeafWrapper>;

export class SetLeafWrappersVisitor extends TransformNodesVisitor {
  constructor(readonly map: LeafWrapperMap) {
    const transforms = Object.entries(map).map(
      ([selectorStack, wrapper]): NodeTransform => ({
        selector: { type: 'typeLeaf', stack: selectorStack },
        transformer: (node) => {
          nodes.assertTypeLeafNode(node);
          return new nodes.TypeLeafNode(node.type, wrapper);
        },
      })
    );

    super(transforms);
  }
}
