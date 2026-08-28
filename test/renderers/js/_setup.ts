import { format } from '@prettier/sync';
import type { ExecutionContext } from 'ava';
import { type Options as PrettierOptions } from 'prettier';
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
  expectedArray.forEach((expectedResult) => {
    if (typeof expectedResult === 'string') {
      t.regex(normalizedActual, stringToRegex(expectedResult));
    } else {
      t.regex(normalizedActual, expectedResult);
    }
  });
}

export function codeDoesNotContain(
  t: ExecutionContext,
  actual: string,
  unexpected: (string | RegExp)[] | string | RegExp
) {
  const unexpectedArray = Array.isArray(unexpected) ? unexpected : [unexpected];
  const normalizedActual = normalizeCode(actual);
  unexpectedArray.forEach((unexpectedResult) => {
    if (typeof unexpectedResult === 'string') {
      t.notRegex(normalizedActual, stringToRegex(unexpectedResult));
    } else {
      t.notRegex(normalizedActual, unexpectedResult);
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
  const normalizedActual = inlineCode(actual);
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
  return code.trim();
}

function inlineCode(code: string) {
  return normalizeCode(code)
    .replace(/\s+/g, ' ')
    .replace(/\s*(\W)\s*/g, '$1');
}

function escapeRegex(stringAsRegex: string) {
  return stringAsRegex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function stringToRegex(expected: string): RegExp {
  const stringAsRegex = escapeRegex(expected)
    // Transform spaces between words into required whitespace.
    .replace(/(\w)\s+(\w)/g, '$1\\s+$2')
    // Do it again for single-character words — e.g. "as[ ]a[ ]token".
    .replace(/(\w)\s+(\w)/g, '$1\\s+$2')
    // Transform other spaces into optional whitespace.
    .replace(/\s+/g, '\\s*');
  return new RegExp(stringAsRegex);
}
