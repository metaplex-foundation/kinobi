import test from 'ava';
import { validateCodamaVersion } from '../../src';

test('it throws for an unsupported major version', (t) => {
  t.throws(() => validateCodamaVersion('2.0.0'), {
    message: /Codama/,
  });
});

test('it passes for major version 1', (t) => {
  t.notThrows(() => validateCodamaVersion('1.0.0'));
  t.notThrows(() => validateCodamaVersion('1.2.3'));
});
