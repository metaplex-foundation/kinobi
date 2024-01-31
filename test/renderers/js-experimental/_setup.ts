import type { ExecutionContext } from 'ava';
import chalk from 'chalk';
import { format, type Options as PrettierOptions } from 'prettier';
import type { RenderMap } from '../../../src';

const PRETTIER_OPTIONS: PrettierOptions = {
  semi: true,
  singleQuote: true,
  trailingComma: 'none',
  useTabs: false,
  tabWidth: 2,
  arrowParens: 'always',
  printWidth: 80,
  parser: 'typescript',
};

export function renderMapContains(
  t: ExecutionContext,
  renderMap: RenderMap,
  key: string,
  expected: (string | RegExp)[] | string | RegExp
) {
  t.true(renderMap.has(key), `RenderMap is missing key "${key}".`);
  return codeContains(t, renderMap.get(key), expected);
}

export function codeContains(
  t: ExecutionContext,
  actual: string,
  expected: (string | RegExp)[] | string | RegExp
) {
  const expectedArray = Array.isArray(expected) ? expected : [expected];
  const normalizedActual = normalizeCode(actual);
  expectedArray.forEach((e) => {
    if (typeof e === 'string') {
      const normalizeExpected = normalizeCode(e);
      t.true(
        normalizedActual.includes(normalizeExpected),
        `The following expected code is missing from the actual content:\n\n` +
          `${chalk.blue(normalizeExpected)}\n\n` +
          `Actual content:\n\n` +
          `${chalk.blue(normalizedActual)}`
      );
    } else {
      t.regex(normalizedActual, e);
    }
  });
}

export function renderMapContainsImports(
  t: ExecutionContext,
  renderMap: RenderMap,
  key: string,
  expectedImports: Record<string, string[]>
) {
  t.true(renderMap.has(key), `RenderMap is missing key "${key}".`);
  return codeContainsImports(t, renderMap.get(key), expectedImports);
}

export function codeContainsImports(
  t: ExecutionContext,
  actual: string,
  expectedImports: Record<string, string[]>
) {
  const normalizedActual = normalizeCode(actual);
  const importPairs = Object.entries(expectedImports).flatMap(
    ([key, value]) => {
      return value.map((v) => [key, v] as const);
    }
  );

  importPairs.forEach(([importFrom, importValue]) => {
    t.regex(
      normalizedActual,
      new RegExp(`import{[^}]*\\b${importValue}\\b[^}]*}from'${importFrom}'`)
    );
  });
}

function normalizeCode(code: string) {
  try {
    code = format(code, PRETTIER_OPTIONS);
  } catch (e) {}

  return code
    .replace(/\s+/g, ' ')
    .replace(/\s*(\W)\s*/g, '$1')
    .trim();
}
