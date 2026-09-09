import test from 'ava';
import { JavaScriptImportMap } from '../../../src';

test('it is exported and renders sorted, mapped import statements', (t) => {
  // Given an import map using a built-in module key and a custom one.
  const imports = new JavaScriptImportMap()
    .add('umi', ['PublicKey', 'Context'])
    .add('generated', 'BaseOracle')
    .add('plugins', 'Oracle');

  // When we render it with a custom dependency map.
  const code = imports.toString({ generated: '..', plugins: '../../plugins' });

  // Then external imports come first and each list is sorted.
  t.is(
    code,
    [
      "import { Context, PublicKey } from '@metaplex-foundation/umi';",
      "import { BaseOracle } from '..';",
      "import { Oracle } from '../../plugins';",
    ].join('\n')
  );
});
