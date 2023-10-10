import { LogLevel } from '../../shared/logs';
import * as nodes from '../../nodes';
import { BaseThrowVisitor, visit } from '../../visitors';
import { deleteFolder } from '../utils';
import { WriteRenderMapVisitor } from '../WriteRenderMapVisitor';
import {
  GetJavaScriptExperimentalRenderMapOptions,
  GetJavaScriptExperimentalRenderMapVisitor,
} from './GetJavaScriptExperimentalRenderMapVisitor';

export type RenderJavaScriptExperimentalOptions =
  GetJavaScriptExperimentalRenderMapOptions & {
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
      new WriteRenderMapVisitor(
        new GetJavaScriptExperimentalRenderMapVisitor(this.options),
        this.path
      )
    );
  }
}
