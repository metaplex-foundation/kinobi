import { LogLevel } from '../../shared/logs';
import * as nodes from '../../nodes';
import {
  BaseThrowVisitor,
  ThrowValidatorItemsVisitor,
  visit,
} from '../../visitors';
import { deleteFolder } from '../utils';
import { WriteRenderMapVisitor } from '../WriteRenderMapVisitor';
/*
import {
  GetRustRenderMapOptions,
  GetRustRenderMapVisitor,
} from './GetRustRenderMapVisitor._ts';
import { GetRustValidatorBagVisitor } from './GetRustValidatorBagVisitor';
*/

export type RenderRustOptions = {
  deleteFolderBeforeRendering?: boolean;
  throwLevel?: LogLevel;
};

export class RenderRustVisitor extends BaseThrowVisitor<void> {
  constructor(
    readonly path: string,
    readonly options: RenderRustOptions = {}
  ) {
    super();
  }

  visitRoot(root: nodes.RootNode): void {
    console.log(root);
    /*
    // Validate nodes.
    visit(
      root,
      new ThrowValidatorItemsVisitor(
        new GetRustValidatorBagVisitor(),
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
      new WriteRenderMapVisitor(
        new GetRustRenderMapVisitor(this.options),
        this.path
      )
    );
    */
  }
}
