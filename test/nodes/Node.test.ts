import test from 'ava';
import {
  isNode,
  numberTypeNode,
  publicKeyTypeNode,
  tupleTypeNode,
} from '../../src';

test('it can check if a given node is of the given kind', (t) => {
  t.true(isNode(tupleTypeNode([]), 'tupleTypeNode'));
  t.false(isNode(tupleTypeNode([]), 'publicKeyTypeNode'));
});

test('it can check if a given node is part of the given kinds', (t) => {
  t.true(isNode(tupleTypeNode([]), ['tupleTypeNode', 'publicKeyTypeNode']));
  t.true(isNode(publicKeyTypeNode(), ['tupleTypeNode', 'publicKeyTypeNode']));
  t.false(isNode(numberTypeNode('u8'), ['tupleTypeNode', 'publicKeyTypeNode']));
});
