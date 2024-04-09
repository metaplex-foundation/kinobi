import test from 'ava';
import {
  fixedSizeTypeNode,
  numberTypeNode,
  resolveNestedTypeNode,
  sizePrefixTypeNode,
  stringTypeNode,
} from '../../../src';

test('it resolved nested type nodes', (t) => {
  const node = sizePrefixTypeNode(
    fixedSizeTypeNode(stringTypeNode(), 32),
    numberTypeNode('u8')
  );
  t.deepEqual(resolveNestedTypeNode(node), stringTypeNode());
});

test('it returns the same instance when resolving nested types nodes', (t) => {
  const node = numberTypeNode('u8');
  t.is(resolveNestedTypeNode(node), node);
});
