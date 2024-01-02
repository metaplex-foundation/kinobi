import { MapEntryValueNode } from './MapEntryValueNode';

export type MapValueNode = {
  readonly kind: 'mapValueNode';

  // Children.
  readonly entries: MapEntryValueNode[];
};

export function mapValueNode(entries: MapEntryValueNode[]): MapValueNode {
  return { kind: 'mapValueNode', entries };
}
