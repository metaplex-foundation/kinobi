import type { ExecutionContext } from 'ava';
import { format, type Options as PrettierOptions } from 'prettier';
import type { RenderMap } from '../../../src';

const PRETTIER_OPTIONS: PrettierOptions = {
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
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
  expected: string[] | string | RegExp[] | RegExp
) {
  t.true(renderMap.has(key), `RenderMap is missing key "${key}".`);
  return codeContains(t, renderMap.get(key), expected);
}

export function renderMapContainsAny(
  t: ExecutionContext,
  renderMap: RenderMap,
  key: string,
  expected: string[] | RegExp[]
) {
  t.true(renderMap.has(key), `RenderMap is missing key "${key}".`);
  return codeContainsAny(t, renderMap.get(key), expected);
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

export function codeContains(
  t: ExecutionContext,
  actual: string,
  expected: string[] | string | RegExp[] | RegExp
) {
  const expectedArray = Array.isArray(expected) ? expected : [expected];
  const formattedActual = format(actual, PRETTIER_OPTIONS);
  const formattedExpected = expectedArray.map((e) =>
    typeof e === 'string' ? format(e, PRETTIER_OPTIONS) : e
  );
  formattedExpected.forEach((e) => {
    t.true(
      typeof e === 'string'
        ? formattedActual.includes(e)
        : e.test(formattedActual),
      `The following expected code is missing from the actual content:\n` +
        `${e}\n\n` +
        `Actual content:\n` +
        `${actual}`
    );
  });
}

export function codeContainsAny(
  t: ExecutionContext,
  actual: string,
  expected: string[] | RegExp[]
) {
  const formattedActual = format(actual, PRETTIER_OPTIONS);
  const formattedExpected = expected.map((e) =>
    typeof e === 'string' ? format(e, PRETTIER_OPTIONS) : e
  );
  const found = formattedExpected.some((e) =>
    typeof e === 'string'
      ? formattedActual.includes(e)
      : e.test(formattedActual)
  );
  t.true(
    found,
    `None of the following expected code pieces are present in the actual content:\n` +
      `${formattedExpected.join('\n')}\n\n` +
      `Actual content:\n` +
      `${actual}`
  );
}

export function codeContainsImports(
  t: ExecutionContext,
  actual: string,
  expectedImports: Record<string, string[]>
) {
  const formattedActual = format(actual, PRETTIER_OPTIONS);
  const importPairs = Object.entries(expectedImports).flatMap(
    ([key, value]) => {
      return value.map((v) => [key, v] as const);
    }
  );

  importPairs.forEach(([importFrom, importValue]) => {
    t.true(
      new RegExp(
        `import { [^}]*\\b${importValue}\\b[^}]* } from '${importFrom}'`
      ).test(formattedActual),
      `The following expected import is missing from the actual content:\n` +
        `${importValue} from ${importFrom}\n\n` +
        `Actual content:\n` +
        `${actual}`
    );
  });
}
