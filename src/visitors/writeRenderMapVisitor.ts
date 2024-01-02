import { NodeKind } from '../nodes';
import { RenderMap } from '../shared';
import { mapVisitor } from './mapVisitor';
import { Visitor } from './visitor';

export function writeRenderMapVisitor<TNodeKind extends NodeKind = NodeKind>(
  visitor: Visitor<RenderMap, TNodeKind>,
  path: string
): Visitor<void, TNodeKind> {
  return mapVisitor(visitor, (renderMap) => renderMap.write(path));
}
