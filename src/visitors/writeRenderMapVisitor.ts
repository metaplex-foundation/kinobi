import { RegisteredNodes } from '../nodes';
import { RenderMap } from '../shared';
import { mapVisitor } from './mapVisitor';
import { Visitor } from './visitor';

export function writeRenderMapVisitor<
  TNodeKeys extends keyof RegisteredNodes = keyof RegisteredNodes
>(
  visitor: Visitor<RenderMap, TNodeKeys>,
  path: string
): Visitor<void, TNodeKeys> {
  return mapVisitor(visitor, (renderMap) => renderMap.write(path));
}
