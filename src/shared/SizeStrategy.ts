import {
  NumberTypeNode,
  displayNumberTypeNode,
  numberTypeNode,
} from '../nodes/NumberTypeNode';

export type SizeStrategy =
  | { kind: 'fixed'; value: number }
  | { kind: 'prefixed'; prefix: NumberTypeNode }
  | { kind: 'remainder' };

export const fixedSize = (value: number): SizeStrategy => ({
  kind: 'fixed',
  value,
});

export const prefixedSize = (prefix?: NumberTypeNode): SizeStrategy => ({
  kind: 'prefixed',
  prefix: prefix ?? numberTypeNode('u32'),
});

export const remainderSize = (): SizeStrategy => ({ kind: 'remainder' });

export const displaySizeStrategy = (size: SizeStrategy): string => {
  if (size.kind === 'fixed') return `${size.value}`;
  if (size.kind === 'prefixed') return `${displayNumberTypeNode(size.prefix)}`;
  return 'remainder';
};
