import test from 'ava';
import {
  RenderMap,
  mergeRenderMapVisitors,
  programNode,
  rootNode,
  rootNodeVisitor,
  visit,
} from '../../src';

test('it merges the render maps of several visitors in order', (t) => {
  // Given a root node and two visitors producing overlapping render maps.
  const node = rootNode(programNode({ name: 'myProgram', publicKey: '1111' }));
  const first = rootNodeVisitor(() =>
    new RenderMap().add('a.ts', 'first a').add('shared.ts', 'first shared')
  );
  const second = rootNodeVisitor((root) =>
    new RenderMap()
      .add('b.ts', `second b for ${root.program.name}`)
      .add('shared.ts', 'second shared')
  );

  // When we merge them.
  const result = visit(node, mergeRenderMapVisitors([first, second]));

  // Then we get every file, with later visitors winning on conflicts.
  t.is(result.get('a.ts'), 'first a');
  t.is(result.get('b.ts'), 'second b for myProgram');
  t.is(result.get('shared.ts'), 'second shared');
});
