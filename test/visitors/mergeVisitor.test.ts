import test from 'ava';
import {
  MergeVisitorInterceptor,
  mergeVisitor,
  numberTypeNode,
  publicKeyTypeNode,
  tupleTypeNode,
  visit,
} from '../../src';

test('it sets a value for all leaves and merges node values together', (t) => {
  // Given the following 3-nodes tree.
  const node = tupleTypeNode([numberTypeNode('u32'), publicKeyTypeNode()]);

  // And a visitor that sets the node kind for all leaves and combines
  // them together such that each node lists the kind of its children.
  const visitor = mergeVisitor(
    (node) => node.kind as string,
    (node, values) => `${node.kind}(${values.join(',')})`
  );

  // When we visit the tree using that visitor.
  const result = visit(node, visitor);

  // Then we get the following result.
  t.is(result, 'tupleTypeNode(numberTypeNode,publicKeyTypeNode)');
});

test('it can be used to count nodes', (t) => {
  // Given the following 3-nodes tree.
  const node = tupleTypeNode([numberTypeNode('u32'), publicKeyTypeNode()]);

  // When we visit the tree with a visitor that counts nodes.
  const visitor = mergeVisitor(
    () => 1,
    (_, values) => values.reduce((a, b) => a + b, 1)
  );
  const result = visit(node, visitor);

  // Then we expect to have 3 nodes.
  t.is(result, 3);
});

test('it accepts an interceptor used for each node', (t) => {
  // Given the following 3-nodes tree.
  const node = tupleTypeNode([numberTypeNode('u32'), publicKeyTypeNode()]);

  // And a visitor that intercepts all nodes such that it records the
  // events that happened during the visit.
  const events: string[] = [];
  const intercept: MergeVisitorInterceptor<void> = (fn) => (node) => {
    events.push(`down:${node.kind}`);
    fn(node);
    events.push(`up:${node.kind}`);
  };
  const visitor = mergeVisitor(
    () => undefined,
    () => undefined,
    { intercept }
  );

  // When we visit the tree using that visitor.
  visit(node, visitor);

  // Then we expect the following events to have happened.
  t.deepEqual(events, [
    'down:tupleTypeNode',
    'down:numberTypeNode',
    'up:numberTypeNode',
    'down:publicKeyTypeNode',
    'up:publicKeyTypeNode',
    'up:tupleTypeNode',
  ]);
});

test.todo('it accepts a next visitor to use for the next visits');

test('it can create partial visitors', (t) => {
  // Given the following 3-nodes tree.
  const node = tupleTypeNode([numberTypeNode('u32'), publicKeyTypeNode()]);

  // And a visitor that only supports 2 of these nodes.
  const visitor = mergeVisitor(
    (node) => node.kind as string,
    (node, values) => `${node.kind}(${values.join(',')})`,
    { nodeKeys: ['tupleTypeNode', 'numberTypeNode'] }
  );

  // When we visit the tree using that visitor.
  const result = visit(node, visitor);

  // Then the unsupported node is not included in the result.
  t.is(result, 'tupleTypeNode(numberTypeNode)');

  // And the unsupported node cannot be visited.
  // @ts-expect-error
  t.throws(() => visit(publicKeyTypeNode(), visitor));
});
