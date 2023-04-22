import {
  NumberTypeNode,
  displayNumberTypeNode,
  numberTypeNode,
} from '../nodes/NumberTypeNode';

export type SizeStrategy =
  | { kind: 'fixed'; value: number }
  | { kind: 'prefixed'; prefixNode: NumberTypeNode }
  | { kind: 'remainder' };

export const fixedSize = (value: number): SizeStrategy => ({
  kind: 'fixed',
  value,
});

export const prefixedSize = (prefixNode?: NumberTypeNode): SizeStrategy => ({
  kind: 'prefixed',
  prefixNode: prefixNode ?? numberTypeNode('u32'),
});

export const remainderSize = (): SizeStrategy => ({ kind: 'remainder' });

export const displaySizeStrategy = (size: SizeStrategy): string => {
  if (size.kind === 'fixed') return `${size.value}`;
  if (size.kind === 'prefixed')
    return `${displayNumberTypeNode(size.prefixNode)}`;
  return 'remainder';
};
