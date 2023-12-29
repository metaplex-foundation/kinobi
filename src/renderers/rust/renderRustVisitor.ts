import { spawnSync } from 'child_process';
import { LogLevel, deleteFolder, logError, logWarn } from '../../shared';
import { rootNodeVisitor, visit, writeRenderMapVisitor } from '../../visitors';
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

export function renderRustVisitor(
  path: string,
  options: RenderRustOptions = {}
) {
  return rootNodeVisitor((root) => {
    // Delete existing generated folder.
    if (options.deleteFolderBeforeRendering ?? true) {
      deleteFolder(path);
    }

    // Render the new files.
    visit(root, writeRenderMapVisitor(getRenderMapVisitor(options), path));

    // format the code
    if (options.formatCode) {
      if (options.crateFolder) {
        runFormatter('cargo-fmt', [
          '--manifest-path',
          `${options.crateFolder}/Cargo.toml`,
        ]);
      } else {
        logWarn('No crate folder specified, skipping formatting.');
      }
    }
  });
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
