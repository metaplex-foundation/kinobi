import * as nodes from '../../nodes';
import { NodeTransform, TransformNodesVisitor } from './TransformNodesVisitor';

type NumberWrapperMap = Record<string, nodes.NumberWrapper>;

export class SetNumberWrappersVisitor extends TransformNodesVisitor {
  constructor(readonly map: NumberWrapperMap) {
    const transforms = Object.entries(map).map(
      ([selectorStack, wrapper]): NodeTransform => ({
        selector: { kind: 'numberTypeNode', stack: selectorStack },
        transformer: (node) => {
          nodes.assertNumberTypeNode(node);
          return nodes.numberWrapperTypeNode(node, wrapper);
        },
      })
    );

    super(transforms);
  }
}
