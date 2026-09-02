import test from 'ava';
import {
  bytesValueNode,
  getBytesFromBytesValueNode,
  isNode,
} from '../../../../src';
import {
  deleteNodesVisitorMacro,
  getDebugStringVisitorMacro,
  identityVisitorMacro,
  mergeVisitorMacro,
} from '../_setup';

const node = bytesValueNode('base16', 'ff');

test('it builds a bytesValueNode', (t) => {
  t.deepEqual(node, { kind: 'bytesValueNode', data: 'ff', encoding: 'base16' });
  t.true(isNode(node, 'bytesValueNode'));
  t.false(isNode(node, 'numberValueNode'));
});

test(mergeVisitorMacro, node, 1);
test(identityVisitorMacro, node);
test(deleteNodesVisitorMacro, node, '[bytesValueNode]', null);
test(getDebugStringVisitorMacro, node, `bytesValueNode`);

test('getBytesFromBytesValueNode: utf8', (t) => {
  t.deepEqual(
    getBytesFromBytesValueNode(bytesValueNode('utf8', 'hi')),
    new Uint8Array([104, 105])
  );
});

test('getBytesFromBytesValueNode: base16', (t) => {
  t.deepEqual(
    getBytesFromBytesValueNode(bytesValueNode('base16', '01')),
    new Uint8Array([1])
  );
});

test('getBytesFromBytesValueNode: base58', (t) => {
  t.deepEqual(
    getBytesFromBytesValueNode(bytesValueNode('base58', '2VfUX')),
    new Uint8Array([1, 2, 3, 4])
  );
});

test('getBytesFromBytesValueNode: base64', (t) => {
  t.deepEqual(
    getBytesFromBytesValueNode(bytesValueNode('base64', 'AQIDBA==')),
    new Uint8Array([1, 2, 3, 4])
  );
});
