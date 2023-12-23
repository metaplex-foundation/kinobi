import * as nodes from '../../nodes';
import { NodeTransform, TransformNodesVisitor } from './TransformNodesVisitor';

export type NumberWrapper =
  | { kind: 'DateTime' }
  | { kind: 'SolAmount' }
  | { kind: 'Amount'; identifier: string; decimals: number };

type NumberWrapperMap = Record<string, NumberWrapper>;

export class SetNumberWrappersVisitor extends TransformNodesVisitor {
  constructor(readonly map: NumberWrapperMap) {
    const transforms = Object.entries(map).map(
      ([selectorStack, wrapper]): NodeTransform => ({
        selector: { kind: 'numberTypeNode', stack: selectorStack },
        transformer: (node) => {
          nodes.assertNumberTypeNode(node);
          switch (wrapper.kind) {
            case 'DateTime':
              return nodes.dateTimeTypeNode(node);
            case 'SolAmount':
              return nodes.solAmountTypeNode(node);
            case 'Amount':
              return nodes.amountTypeNode(
                node,
                wrapper.identifier,
                wrapper.decimals
              );
            default:
              throw new Error(`Invalid number wrapper kind: ${wrapper}`);
          }
        },
      })
    );

    super(transforms);
  }
}
