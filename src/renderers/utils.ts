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
  path: string,
  context?: object,
  options?: ConfigureOptions,
): string => {
  const env = nunjucks.configure({ trimBlocks: true, ...options });
  return env.render(`${__dirname}/${path}`, context);
};

export type ResolveTemplateFunction = (
  path: string,
  context?: object,
) => string;

export const resolveTemplateInsideDir =
  (directory: string) =>
  (template: string, context?: object): string =>
    resolveTemplate(`${directory}/${template}`, context);
