import * as nodes from '../../nodes';
import { NodeTransform, TransformNodesVisitor } from './TransformNodesVisitor';

type LeafWrapperMap = Record<string, nodes.LeafWrapper>;

// const foo: LeafWrapperMap = {
//   'UseAuthorityRecord.allowedUses': { __kind: 'DateTime' },
// };
// console.log(foo);

export class SetLeafWrappersVisitor extends TransformNodesVisitor {
  constructor(readonly map: LeafWrapperMap) {
    const transforms = Object.entries(map).map(
      ([selector, wrapper]): NodeTransform => ({
        selector: (node, stack) => {
          if (!nodes.isTypeLeafNode(node)) return false;
          return matchStackWithNames(stack, selector.split('.'));
        },
        transformer: (node) => {
          nodes.assertTypeLeafNode(node);
          return new nodes.TypeLeafNode(node.type, wrapper);
        },
      })
    );

    super(transforms);
  }
}

function matchStackWithNames(stack: nodes.Node[], names: string[]): boolean {
  const remainingNames = [...names];
  stack.forEach((node) => {
    const nodeName = (node as { name?: string }).name;
    if (
      nodeName &&
      remainingNames.length > 0 &&
      remainingNames[0] === nodeName
    ) {
      remainingNames.shift();
    }
  });

  return remainingNames.length === 0;
}
