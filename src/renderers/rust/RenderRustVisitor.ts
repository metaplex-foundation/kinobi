import * as nodes from '../../nodes';
import { LogLevel } from '../../shared/logs';
import { BaseThrowVisitor, visit } from '../../visitors';
import { WriteRenderMapVisitor } from '../WriteRenderMapVisitor';
import { deleteFolder } from '../utils';
import {
  GetRustRenderMapOptions,
  GetRustRenderMapVisitor,
} from './GetRustRenderMapVisitor';

export type RenderRustOptions = GetRustRenderMapOptions & {
  deleteFolderBeforeRendering?: boolean;
  throwLevel?: LogLevel;
};

export class RenderRustVisitor extends BaseThrowVisitor<void> {
  constructor(readonly path: string, readonly options: RenderRustOptions = {}) {
    super();
  }

  visitRoot(root: nodes.RootNode): void {
    // Validate nodes.
    // visit(
    //   root,
    //   new ThrowValidatorItemsVisitor(
    //     new GetRustValidatorBagVisitor(),
    //     this.options.throwLevel
    //   )
    // );

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
  }
}
