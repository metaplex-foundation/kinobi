import { ValueNode } from './ValueNode';

export interface MapEntryValueNode<
  TKey extends ValueNode = ValueNode,
  TValue extends ValueNode = ValueNode,
> {
  readonly kind: 'mapEntryValueNode';

  // Children.
  readonly key: TKey;
  readonly value: TValue;
}

export function mapEntryValueNode<
  TKey extends ValueNode,
  TValue extends ValueNode,
>(key: TKey, value: TValue): MapEntryValueNode<TKey, TValue> {
  return { kind: 'mapEntryValueNode', key, value };
}
