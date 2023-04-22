import {
  NumberTypeNode,
  displayNumberTypeNode,
  numberTypeNode,
} from '../nodes/NumberTypeNode';

export type SizeStrategy =
  | { kind: 'fixed'; bytes: number }
  | { kind: 'prefixed'; prefixNode: NumberTypeNode }
  | { kind: 'remainder' };

export const fixedSize = (bytes: number): SizeStrategy => ({
  kind: 'fixed',
  bytes,
});

export const prefixedSize = (prefixNode?: NumberTypeNode): SizeStrategy => ({
  kind: 'prefixed',
  prefixNode: prefixNode ?? numberTypeNode('u32'),
});

export const remainderSize = (): SizeStrategy => ({ kind: 'remainder' });

export const displaySizeStrategy = (size: SizeStrategy): string => {
  if (size.kind === 'fixed') return `${size.bytes}`;
  if (size.kind === 'prefixed')
    return `${displayNumberTypeNode(size.prefixNode)}`;
  return 'remainder';
};
