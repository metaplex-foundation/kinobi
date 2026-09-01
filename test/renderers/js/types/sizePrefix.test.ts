import test from 'ava';
import {
  definedTypeNode,
  numberTypeNode,
  sizePrefixTypeNode,
  stringTypeNode,
  structFieldTypeNode,
  structTypeNode,
  visit,
} from '../../../../src';
import { getRenderMapVisitor } from '../../../../src/renderers/js/getRenderMapVisitor';
import {
  codeDoesNotContain,
  renderMapContains,
  renderMapContainsImports,
} from '../_setup';

test('it wraps non-string types with a size prefix serializer', (t) => {
  // Given a size-prefixed struct, as used by Token-2022 TLV extensions.
  const node = definedTypeNode({
    name: 'myType',
    type: sizePrefixTypeNode(
      structTypeNode([
        structFieldTypeNode({ name: 'value', type: numberTypeNode('u64') }),
      ]),
      numberTypeNode('u16')
    ),
  });

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then the struct serializer is wrapped with a size prefix.
  renderMapContains(t, renderMap, 'types/myType.ts', [
    /sizePrefix\(\s*struct[\s\S]*?,\s*u16\(\)\s*\)/,
  ]);
  renderMapContainsImports(t, renderMap, 'types/myType.ts', {
    '../shared': ['sizePrefix'],
  });
});

test('it keeps delegating size prefixes to string serializers', (t) => {
  // Given a size-prefixed string (the legacy-compatible case).
  const node = definedTypeNode({
    name: 'myType',
    type: sizePrefixTypeNode(stringTypeNode('utf8'), numberTypeNode('u32')),
  });

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then the string serializer handles the prefix itself, exactly as before.
  renderMapContains(t, renderMap, 'types/myType.ts', ['string()']);
  codeDoesNotContain(t, renderMap.get('types/myType.ts'), 'sizePrefix(');
});
