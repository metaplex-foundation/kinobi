import {
  NumberTypeNode,
  displayNumberTypeNode,
  numberTypeNode,
} from '../nodes/NumberTypeNode';

export type SizeStrategy =
  | { type: 'fixed'; bytes: number }
  | { type: 'prefixed'; prefixNode: NumberTypeNode }
  | { type: 'remainder' };

export const fixedSize = (bytes: number): SizeStrategy => ({
  type: 'fixed',
  bytes,
});

export const prefixedSize = (prefixNode?: NumberTypeNode): SizeStrategy => ({
  type: 'prefixed',
  prefixNode: prefixNode ?? numberTypeNode('u32'),
});

export const remainderSize = (): SizeStrategy => ({ type: 'remainder' });

export const displaySizeStrategy = (size: SizeStrategy): string => {
  if (size.type === 'fixed') return `${size.bytes}`;
  if (size.type === 'prefixed')
    return `${displayNumberTypeNode(size.prefixNode)}`;
  return 'remainder';
};
