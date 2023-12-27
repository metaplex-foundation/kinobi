import * as nodes from '../../nodes';
import { LogLevel } from '../../shared/logs';
import {
  BaseThrowVisitor,
  throwValidatorItemsVisitor,
  visit,
  writeRenderMapVisitor,
} from '../../visitors';
import { deleteFolder } from '../utils';
import {
  GetJavaScriptRenderMapOptions,
  GetJavaScriptRenderMapVisitor,
} from './GetJavaScriptRenderMapVisitor';
import { getJavaScriptValidatorBagVisitor } from './getJavaScriptValidatorBagVisitor';

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
      writeRenderMapVisitor(
        new GetJavaScriptRenderMapVisitor(this.options),
        this.path
      )
    );
  }
}
