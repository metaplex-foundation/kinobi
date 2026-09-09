import { deleteFolder, LogLevel, RenderMap } from '../../shared';
import {
  mergeRenderMapVisitors,
  rootNodeVisitor,
  visit,
  Visitor,
  writeRenderMapVisitor,
} from '../../visitors';
import {
  GetRenderMapOptions,
  getRenderMapVisitor,
} from './getRenderMapVisitor';

export type RenderJavaScriptExperimentalOptions = GetRenderMapOptions & {
  deleteFolderBeforeRendering?: boolean;
  /**
   * Additional `RenderMap` visitors whose files are written alongside the
   * generated client, in the same pass and under the same output folder.
   * Later maps win on conflicting paths.
   */
  extraRenderMaps?: Visitor<RenderMap, 'rootNode'>[];
  throwLevel?: LogLevel;
};

export function renderJavaScriptExperimentalVisitor(
  path: string,
  options: RenderJavaScriptExperimentalOptions = {}
) {
  return rootNodeVisitor((root) => {
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
