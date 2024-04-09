import {
  amountTypeNode,
  assertIsNestedTypeNode,
  dateTimeTypeNode,
  solAmountTypeNode,
} from '../nodes';
import {
  BottomUpNodeTransformerWithSelector,
  bottomUpTransformerVisitor,
} from './bottomUpTransformerVisitor';

export type NumberWrapper =
  | { kind: 'DateTime' }
  | { kind: 'SolAmount' }
  | { kind: 'Amount'; decimals: number; unit?: string };

type NumberWrapperMap = Record<string, NumberWrapper>;

export function setNumberWrappersVisitor(map: NumberWrapperMap) {
  return bottomUpTransformerVisitor(
    Object.entries(map).map(
      ([selectorStack, wrapper]): BottomUpNodeTransformerWithSelector => ({
        select: `${selectorStack}.[numberTypeNode]`,
        transform: (node) => {
          assertIsNestedTypeNode(node, 'numberTypeNode');
          switch (wrapper.kind) {
            case 'DateTime':
              return dateTimeTypeNode(node);
            case 'SolAmount':
              return solAmountTypeNode(node);
            case 'Amount':
              return amountTypeNode(node, wrapper.decimals, wrapper.unit);
            default:
              throw new Error(`Invalid number wrapper kind: ${wrapper}`);
          }
        },
      })
    )
  );
}
