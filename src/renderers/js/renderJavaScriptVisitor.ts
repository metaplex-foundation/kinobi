import { LogLevel, deleteFolder } from '../../shared';
import {
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
    visit(root, writeRenderMapVisitor(getRenderMapVisitor(options), path));
  });
}
