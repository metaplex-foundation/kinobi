import { RenderMap } from '../shared';
import { rootNodeVisitor } from './singleNodeVisitor';
import { Visitor, visit } from './visitor';

/**
 * Combines several `RenderMap` visitors into one that visits the root node
 * with each of them in order and merges the results. Later visitors win
 * when they render the same relative path. This lets renderers accept
 * additional, user-provided render maps that are written in the same pass
 * as the generated client (see `extraRenderMaps` on the render visitors).
 */
export function mergeRenderMapVisitors(
  visitors: Visitor<RenderMap, 'rootNode'>[]
): Visitor<RenderMap, 'rootNode'> {
  return rootNodeVisitor((root) =>
    new RenderMap().mergeWith(
      ...visitors.map((visitor) => visit(root, visitor))
    )
  );
}
