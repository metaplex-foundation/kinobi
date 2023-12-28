import { spawnSync } from 'child_process';
import * as nodes from '../../nodes';
import { LogLevel, deleteFolder, logError, logWarn } from '../../shared';
import { BaseThrowVisitor, visit, writeRenderMapVisitor } from '../../visitors';
import {
  GetRustRenderMapOptions,
  getRenderMapVisitor,
} from './getRenderMapVisitor';

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
      writeRenderMapVisitor(getRenderMapVisitor(this.options), this.path)
    );

    // format the code
    if (this.options.formatCode) {
      if (this.options.crateFolder) {
        runFormatter('cargo-fmt', [
          '--manifest-path',
          `${this.options.crateFolder}/Cargo.toml`,
        ]);
      } else {
        logWarn('No crate folder specified, skipping formatting.');
      }
    }
  }
}

function runFormatter(cmd: string, args: string[]) {
  const { stdout, stderr, error } = spawnSync(cmd, args);
  if (error?.message?.includes('ENOENT')) {
    logWarn(`Could not find ${cmd}, skipping formatting.`);
    return;
  }
  if (stdout.length > 0) {
    logWarn(`(cargo-fmt) ${stdout || error}`);
  }
  if (stderr.length > 0) {
    logError(`(cargo-fmt) ${stderr || error}`);
  }
}
