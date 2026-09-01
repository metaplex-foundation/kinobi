import test from 'ava';
import {
  bytesTypeNode,
  definedTypeNode,
  fixedSizeTypeNode,
  numberTypeNode,
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

test('it renders fixed size serializers for non-string types', (t) => {
  // Given a fixed-size struct.
  const node = definedTypeNode({
    name: 'myType',
    type: fixedSizeTypeNode(
      structTypeNode([
        structFieldTypeNode({ name: 'value', type: numberTypeNode('u64') }),
      ]),
      100
    ),
  });

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then the struct serializer is wrapped with fixSerializer.
  renderMapContains(t, renderMap, 'types/myType.ts', [
    /fixSerializer\(\s*struct[\s\S]*?,\s*100\s*\)/,
  ]);
  renderMapContainsImports(t, renderMap, 'types/myType.ts', {
    '@metaplex-foundation/umi/serializers': ['fixSerializer'],
  });
});

test('it keeps delegating fixed sizes to bytes serializers', (t) => {
  // Given fixed-size bytes (the legacy-compatible case).
  const node = definedTypeNode({
    name: 'myType',
    type: fixedSizeTypeNode(bytesTypeNode(), 32),
  });

  // When we render it.
  const renderMap = visit(node, getRenderMapVisitor());

  // Then the bytes serializer handles the size itself, exactly as before.
  renderMapContains(t, renderMap, 'types/myType.ts', ['bytes({ size: 32 })']);
  codeDoesNotContain(t, renderMap.get('types/myType.ts'), 'fixSerializer(');
});
