import { LogLevel } from '../../logs';
import * as nodes from '../../nodes';
import { BaseThrowVisitor, ThrowValidatorItemsVisitor } from '../../visitors';
import { deleteFolder } from '../utils';
import { WriteRenderMapVisitor } from '../WriteRenderMapVisitor';
import {
  GetJavaScriptRenderMapOptions,
  GetJavaScriptRenderMapVisitor,
} from './GetJavaScriptRenderMapVisitor';
import { GetJavaScriptValidatorBagVisitor } from './GetJavaScriptValidatorBagVisitor';

export type RenderJavaScriptOptions = GetJavaScriptRenderMapOptions & {
  deleteFolderBeforeRendering?: boolean;
  throwLevel?: LogLevel;
};

export class RenderJavaScriptVisitor extends BaseThrowVisitor<void> {
  constructor(
    readonly path: string,
    readonly options: RenderJavaScriptOptions = {}
  ) {
    super();
  }

  visitRoot(root: nodes.RootNode): void {
    // Validate nodes.
    root.accept(
      new ThrowValidatorItemsVisitor(
        new GetJavaScriptValidatorBagVisitor(),
        this.options.throwLevel
      )
    );

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
