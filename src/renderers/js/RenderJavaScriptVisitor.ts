import * as nodes from '../../nodes';
import { BaseThrowVisitor } from '../../visitors';
import { deleteFolder } from '../utils';
import { WriteRenderMapVisitor } from '../WriteRenderMapVisitor';
import {
  GetJavaScriptRenderMapOptions,
  GetJavaScriptRenderMapVisitor,
} from './GetJavaScriptRenderMapVisitor';

export type RenderJavaScriptOptions = GetJavaScriptRenderMapOptions & {
  deleteFolderBeforeRendering?: boolean;
};

export class RenderJavaScriptVisitor extends BaseThrowVisitor<void> {
  constructor(
    readonly path: string,
    readonly options: RenderJavaScriptOptions = {}
  ) {
    super();
  }

  visitRoot(root: nodes.RootNode): void {
    // Delete existing generated folder.
    if (this.options.deleteFolderBeforeRendering ?? true) {
      deleteFolder(this.path);
    }

    // Render the new files.
    new WriteRenderMapVisitor(
      new GetJavaScriptRenderMapVisitor(this.options),
      this.path
    ).visitRoot(root);
  }
}
