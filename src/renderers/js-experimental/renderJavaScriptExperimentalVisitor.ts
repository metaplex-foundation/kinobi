import { deleteFolder, LogLevel } from '../../shared';
import { rootNodeVisitor, visit, writeRenderMapVisitor } from '../../visitors';
import {
  GetRenderMapOptions,
  getRenderMapVisitor,
} from './getRenderMapVisitor';

export type RenderJavaScriptExperimentalOptions = GetRenderMapOptions & {
  deleteFolderBeforeRendering?: boolean;
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
    visit(root, writeRenderMapVisitor(getRenderMapVisitor(options), path));
  });
}
