import fs from 'fs';
import nunjucks, { ConfigureOptions } from 'nunjucks';

export const createDirectory = (path: string): void => {
  fs.mkdirSync(path, { recursive: true });
};

export const createFile = (path: string, content: string): void => {
  const directory = path.substring(0, path.lastIndexOf('/'));
  if (!fs.existsSync(directory)) {
    createDirectory(directory);
  }
  fs.writeFileSync(path, content);
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
  if (fs.existsSync(path)) {
    fs.rmSync(path, { recursive: true });
  }
};
