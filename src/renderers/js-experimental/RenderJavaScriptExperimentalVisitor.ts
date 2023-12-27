import { LogLevel } from '../../shared/logs';
import * as nodes from '../../nodes';
import { BaseThrowVisitor, visit, writeRenderMapVisitor } from '../../visitors';
import { deleteFolder } from '../utils';
import {
  GetRenderMapOptions,
  getRenderMapVisitor,
} from './getRenderMapVisitor';

export type RenderJavaScriptExperimentalOptions = GetRenderMapOptions & {
  deleteFolderBeforeRendering?: boolean;
  throwLevel?: LogLevel;
};

export class RenderJavaScriptExperimentalVisitor extends BaseThrowVisitor<void> {
  constructor(
    readonly path: string,
    readonly options: RenderJavaScriptExperimentalOptions = {}
  ) {
    super();
  }

  visitRoot(root: nodes.RootNode): void {
    // Delete existing generated folder.
    if (this.options.deleteFolderBeforeRendering ?? true) {
      deleteFolder(this.path);
    }

    // Render the new files.
    visit(
      root,
      writeRenderMapVisitor(getRenderMapVisitor(this.options), this.path)
    );
  }
}
