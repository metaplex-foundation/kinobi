import test from 'ava';
import {
  IdentityVisitorInterceptor,
  assertTupleTypeNode,
  identityVisitor,
  numberTypeNode,
  publicKeyTypeNode,
  tupleTypeNode,
  visit,
} from '../../src';

test('it visits all nodes and returns different instances of the same nodes', (t) => {
  // Given the following 3-nodes tree.
  const node = tupleTypeNode([numberTypeNode('u32'), publicKeyTypeNode()]);

  // When we visit it using the identity visitor.
  const result = visit(node, identityVisitor());

  // Then we get the same tree back.
  t.deepEqual(result, node);

  // But the nodes are different instances.
  t.not(result, node);
  assertTupleTypeNode(result);
  t.not(result.children[0], node.children[0]);
  t.not(result.children[1], node.children[1]);
});

test('it can remove nodes by returning null', (t) => {
  // Given the following 3-nodes tree.
  const node = tupleTypeNode([numberTypeNode('u32'), publicKeyTypeNode()]);

  // And given an identity visitor overidden to remove all public key nodes.
  const visitor = identityVisitor();
  visitor.visitPublicKeyType = () => null;

  // When we visit it using that visitor.
  const result = visit(node, visitor);

  // Then we expect the following tree back.
  t.deepEqual(result, tupleTypeNode([numberTypeNode('u32')]));
});

test('it accepts an interceptor used for each node', (t) => {
  // Given the following 3-nodes tree.
  const node = tupleTypeNode([numberTypeNode('u32'), publicKeyTypeNode()]);

  // And a visitor that intercepts all nodes such that it records the
  // events that happened during the visit.
  const events: string[] = [];
  const intercept: IdentityVisitorInterceptor = (fn) => (node) => {
    events.push(`down:${node.kind}`);
    const newNode = fn(node);
    events.push(`up:${node.kind}`);
    return newNode;
  };
  const visitor = identityVisitor({ intercept });

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

test.todo('it can create partial visitors');
