import { MapEntryValueNode } from './MapEntryValueNode';

export interface MapValueNode<
  TEntries extends MapEntryValueNode[] = MapEntryValueNode[],
> {
  readonly kind: 'mapValueNode';

  // Children.
  readonly entries: TEntries;
}

export function mapValueNode<const TEntries extends MapEntryValueNode[]>(
  entries: TEntries
): MapValueNode<TEntries> {
  return { kind: 'mapValueNode', entries };
}
