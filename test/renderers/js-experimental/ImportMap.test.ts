import test from 'ava';
import { ImportMap } from '../../../src/renderers/js-experimental/ImportMap';

test('it renders JavaScript import statements', (t) => {
  // Given an import map with 3 imports from 2 sources.
  const importMap = new ImportMap()
    .add('@solana/addresses', ['getAddressEncoder', 'Address'])
    .add('@solana/instructions', 'IInstructionWithData');

  // When we render it.
  const importStatements = importMap.toString();

  // Then we expect the following import statements.
  t.is(
    importStatements,
    "import { Address, getAddressEncoder } from '@solana/addresses';\n" +
      "import { IInstructionWithData } from '@solana/instructions';"
  );
});

test('it renders JavaScript import aliases', (t) => {
  // Given an import map with an import alias.
  const importMap = new ImportMap()
    .add('@solana/addresses', 'Address')
    .addAlias('@solana/addresses', 'Address', 'SolanaAddress');

  // When we render it.
  const importStatements = importMap.toString();

  // Then we expect the following import statement.
  t.is(
    importStatements,
    "import { Address as SolanaAddress } from '@solana/addresses';"
  );
});

test('it offers some default dependency mappings', (t) => {
  // Given an import map with some recognized dependency keys.
  const importMap = new ImportMap()
    .add('solanaAddresses', 'Address')
    .add('solanaCodecsCore', 'Codec')
    .add('generatedTypes', 'MyType')
    .add('shared', 'myHelper')
    .add('hooked', 'MyCustomType');

  // When we render it.
  const importStatements = importMap.toString();

  // Then we expect the following import statements.
  t.is(
    importStatements,
    "import { Address } from '@solana/addresses';\n" +
      "import { Codec } from '@solana/codecs-core';\n" +
      "import { MyCustomType } from '../../hooked';\n" +
      "import { myHelper } from '../shared';\n" +
      "import { MyType } from '../types';"
  );
});

test('it supports custom dependency mappings', (t) => {
  // Given an import map with some custom dependency keys.
  const importMap = new ImportMap().add('myDependency', 'MyType');

  // When we render it whilst providing custom dependency mappings.
  const importStatements = importMap.toString({
    myDependency: 'my/custom/path',
  });

  // Then we expect the following import statement.
  t.is(importStatements, "import { MyType } from 'my/custom/path';");
});

test('it does not render empty import statements', (t) => {
  t.is(new ImportMap().toString(), '');
  t.is(new ImportMap().add('shared', []).toString(), '');
  t.is(new ImportMap().addAlias('shared', 'Foo', 'Bar').toString(), '');
});
