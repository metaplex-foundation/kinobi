import { LogLevel, RenderMap, deleteFolder } from '../../shared';
import {
  Visitor,
  mergeRenderMapVisitors,
  rootNodeVisitor,
  throwValidatorItemsVisitor,
  visit,
  writeRenderMapVisitor,
} from '../../visitors';
import {
  GetJavaScriptRenderMapOptions,
  getRenderMapVisitor,
} from './getRenderMapVisitor';
import { getValidatorBagVisitor } from './getValidatorBagVisitor';

export type RenderJavaScriptOptions = GetJavaScriptRenderMapOptions & {
  deleteFolderBeforeRendering?: boolean;
  /**
   * Additional `RenderMap` visitors whose files are written alongside the
   * generated client, in the same pass and under the same output folder.
   * Later maps win on conflicting paths.
   */
  extraRenderMaps?: Visitor<RenderMap, 'rootNode'>[];
  throwLevel?: LogLevel;
};

export function renderJavaScriptVisitor(
  path: string,
  options: RenderJavaScriptOptions = {}
) {
  return rootNodeVisitor((root) => {
    // Validate nodes.
    visit(
      root,
      throwValidatorItemsVisitor(getValidatorBagVisitor(), options.throwLevel)
    );

    // Delete existing generated folder.
    if (options.deleteFolderBeforeRendering ?? true) {
      deleteFolder(path);
    }

    // Render the new files.
    const renderMapVisitor = mergeRenderMapVisitors([
      getRenderMapVisitor(options),
      ...(options.extraRenderMaps ?? []),
    ]);
    visit(root, writeRenderMapVisitor(renderMapVisitor, path));
  });
}
