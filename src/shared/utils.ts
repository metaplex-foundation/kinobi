import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import nunjucks, { ConfigureOptions } from 'nunjucks';

export type MainCaseString = string & {
  readonly __mainCaseString: unique symbol;
};

export type PickPartial<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type PartialExcept<T, K extends keyof T> = Pick<T, K> &
  Partial<Omit<T, K>>;

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type DontInfer<T> = T extends any ? T : never;

export function capitalize(str: string): string {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function titleCase(str: string): string {
  return str
    .replace(/([A-Z])/g, ' $1')
    .split(/[-_\s+.]/)
    .filter((word) => word.length > 0)
    .map(capitalize)
    .join(' ');
}

export function pascalCase(str: string): string {
  return titleCase(str).split(' ').join('');
}

export function camelCase(str: string): string {
  if (str.length === 0) return str;
  const pascalStr = pascalCase(str);
  return pascalStr.charAt(0).toLowerCase() + pascalStr.slice(1);
}

export function kebabCase(str: string): string {
  return titleCase(str).split(' ').join('-').toLowerCase();
}

export function snakeCase(str: string): string {
  return titleCase(str).split(' ').join('_').toLowerCase();
}

export function mainCase(str: string): MainCaseString {
  return camelCase(str) as MainCaseString;
}

export function jsDocblock(docs: string[]): string {
  if (docs.length <= 0) return '';
  if (docs.length === 1) return `/** ${docs[0]} */\n`;
  const lines = docs.map((doc) => ` * ${doc}`);
  return `/**\n${lines.join('\n')}\n */\n`;
}

export function rustDocblock(docs: string[]): string {
  if (docs.length <= 0) return '';
  const lines = docs.map((doc) => `/// ${doc}`);
  return `${lines.join('\n')}\n`;
}

export function readJson<T extends object>(value: string): T {
  return JSON.parse(readFileSync(value, 'utf-8')) as T;
}

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
  options?: ConfigureOptions
): string => {
  const env = nunjucks.configure(directory, {
    trimBlocks: true,
    autoescape: false,
    ...options,
  });
  env.addFilter('pascalCase', pascalCase);
  env.addFilter('camelCase', camelCase);
  env.addFilter('snakeCase', snakeCase);
  env.addFilter('kebabCase', kebabCase);
  env.addFilter('titleCase', titleCase);
  env.addFilter('jsDocblock', jsDocblock);
  env.addFilter('rustDocblock', rustDocblock);
  return env.render(file, context);
};

export const deleteFolder = (path: string): void => {
  if (existsSync(path)) {
    rmSync(path, { recursive: true });
  }
};
