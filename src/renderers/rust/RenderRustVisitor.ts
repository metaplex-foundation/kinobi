import { spawnSync } from 'child_process';
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
  crateFolder?: string;
  formatCode?: boolean;
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

    // format the code
    if (this.options.formatCode) {
      if (this.options.crateFolder) {
        runFormatter('cargo-fmt', [
          '--manifest-path',
          `${this.options.crateFolder}/Cargo.toml`,
        ]);
      } else {
        console.warn('No crate folder specified, skipping formatting.');
      }
    }
  }
}

function runFormatter(cmd: string, args: string[]) {
  const { stdout, stderr } = spawnSync(cmd, args);
  if (stderr.length > 0) {
    console.error(`Formatting ${stderr}`);
  }
}
