import * as nodes from '../../nodes';
import { LogLevel } from '../../shared/logs';
import {
  BaseThrowVisitor,
  throwValidatorItemsVisitor,
  visit,
  writeRenderMapVisitor,
} from '../../visitors';
import { deleteFolder } from '../utils';
import { getJavaScriptValidatorBagVisitor } from './getJavaScriptValidatorBagVisitor';
import {
  getRenderMapVisitor,
  GetJavaScriptRenderMapOptions,
} from './getRenderMapVisitor';

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
    visit(
      root,
      throwValidatorItemsVisitor(
        getJavaScriptValidatorBagVisitor(),
        this.options.throwLevel
      )
    );

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
