import test from 'ava';
import { isNode, tupleTypeNode } from '../../src';

test('it can check if a given node is of the given kind', (t) => {
  t.true(isNode(tupleTypeNode([]), 'tupleTypeNode'));
  t.true(isNode(tupleTypeNode([]), ['tupleTypeNode', 'publicKeyTypeNode']));
  t.false(isNode(tupleTypeNode([]), 'publicKeyTypeNode'));
});
