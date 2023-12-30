import test from 'ava';
import {
  assertIsNode,
  isNode,
  numberTypeNode,
  publicKeyTypeNode,
  tupleTypeNode,
} from '../../src';

test('it checks if a given node is of the given kind', (t) => {
  t.true(isNode(tupleTypeNode([]), 'tupleTypeNode'));
  t.false(isNode(publicKeyTypeNode(), 'tupleTypeNode'));
  t.false(isNode(null, 'tupleTypeNode'));
});

test('it checks if a given node is part of the given kinds', (t) => {
  t.true(isNode(tupleTypeNode([]), ['tupleTypeNode', 'publicKeyTypeNode']));
  t.true(isNode(publicKeyTypeNode(), ['tupleTypeNode', 'publicKeyTypeNode']));
  t.false(isNode(numberTypeNode('u8'), ['tupleTypeNode', 'publicKeyTypeNode']));
  t.false(isNode(null, ['tupleTypeNode', 'publicKeyTypeNode']));
});

test('it asserts that a given node is of the given kind', (t) => {
  t.notThrows(() => assertIsNode(tupleTypeNode([]), 'tupleTypeNode'));
  t.throws(() => assertIsNode(publicKeyTypeNode(), 'tupleTypeNode'), {
    message: 'Expected tupleTypeNode, got publicKeyTypeNode.',
  });
  t.throws(() => assertIsNode(null, 'tupleTypeNode'), {
    message: 'Expected tupleTypeNode, got null.',
  });
});

test('it asserts that a given node is part of the given kinds', (t) => {
  t.notThrows(() =>
    assertIsNode(tupleTypeNode([]), ['tupleTypeNode', 'publicKeyTypeNode'])
  );
  t.notThrows(() =>
    assertIsNode(publicKeyTypeNode(), ['tupleTypeNode', 'publicKeyTypeNode'])
  );
  t.throws(
    () =>
      assertIsNode(numberTypeNode('u8'), [
        'tupleTypeNode',
        'publicKeyTypeNode',
      ]),
    {
      message:
        'Expected tupleTypeNode | publicKeyTypeNode, got numberTypeNode.',
    }
  );
  t.throws(() => assertIsNode(null, ['tupleTypeNode', 'publicKeyTypeNode']), {
    message: 'Expected tupleTypeNode | publicKeyTypeNode, got null.',
  });
});
