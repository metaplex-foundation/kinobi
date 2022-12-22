import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import nunjucks, { ConfigureOptions } from 'nunjucks';

export const createDirectory = (path: string): void => {
  mkdirSync(path, { recursive: true });
};

export const createFile = (path: string, content: string): void => {
  const directory = path.substring(0, path.lastIndexOf('/'));
  if (!existsSync(directory)) {
    createDirectory(directory);
  }
  writeFileSync(path, content);
};

export const resolveTemplate = (
  directory: string,
  file: string,
  context?: object,
  options?: ConfigureOptions,
): string => {
  const env = nunjucks.configure(directory, {
    trimBlocks: true,
    autoescape: false,
    ...options,
  });
  return env.render(file, context);
};

export const deleteFolder = (path: string): void => {
  if (existsSync(path)) {
    rmSync(path, { recursive: true });
  }
};
