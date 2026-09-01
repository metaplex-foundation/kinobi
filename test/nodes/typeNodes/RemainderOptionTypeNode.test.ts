import test from 'ava';
import {
  REGISTERED_TYPE_NODE_KINDS,
  TYPE_NODES,
  getVisitFunctionName,
  isNode,
  publicKeyTypeNode,
  remainderOptionTypeNode,
} from '../../../src';

test('it creates remainder option type nodes', (t) => {
  const node = remainderOptionTypeNode(publicKeyTypeNode());
  t.deepEqual(node, {
    kind: 'remainderOptionTypeNode',
    item: publicKeyTypeNode(),
  });
  t.true(isNode(node, 'remainderOptionTypeNode'));
});

test('it registers remainder option type nodes as type nodes', (t) => {
  t.true(
    (REGISTERED_TYPE_NODE_KINDS as readonly string[]).includes(
      'remainderOptionTypeNode'
    )
  );
  t.true(
    (TYPE_NODES as readonly string[]).includes('remainderOptionTypeNode')
  );
  t.is(
    getVisitFunctionName('remainderOptionTypeNode'),
    'visitRemainderOptionType'
  );
});
