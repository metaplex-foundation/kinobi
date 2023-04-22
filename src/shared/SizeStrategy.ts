import {
  NumberTypeNode,
  displayNumberTypeNode,
  numberTypeNode,
} from '../nodes/NumberTypeNode';

export type SizeStrategy =
  | { type: 'fixed'; bytes: number }
  | { type: 'prefixed'; prefix: NumberTypeNode }
  | { type: 'remainder' };

export const fixedSize = (bytes: number): SizeStrategy => ({
  type: 'fixed',
  bytes,
});

export const prefixedSize = (prefix?: NumberTypeNode): SizeStrategy => ({
  type: 'prefixed',
  prefix: prefix ?? numberTypeNode('u32'),
});

export const remainderSize = (): SizeStrategy => ({ type: 'remainder' });

export const displaySizeStrategy = (size: SizeStrategy): string => {
  if (size.type === 'fixed') return `${size.bytes}`;
  if (size.type === 'prefixed') return `${displayNumberTypeNode(size.prefix)}`;
  return 'remainder';
};
