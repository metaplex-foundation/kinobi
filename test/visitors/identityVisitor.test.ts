import test from 'ava';
import {
  Node,
  VisitorInterceptor,
  assertTupleTypeNode,
  identityVisitor,
  interceptVisitor,
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

test('it can create partial visitors', (t) => {
  // Given the following 3-nodes tree.
  const node = tupleTypeNode([numberTypeNode('u32'), publicKeyTypeNode()]);

  // And an identity visitor that only supports 2 of these nodes
  // whilst using an interceptor to record the events that happened.
  const events: string[] = [];
  const visitor = interceptVisitor(
    identityVisitor(['tupleTypeNode', 'numberTypeNode']),
    (node, next) => {
      events.push(`visiting:${node.kind}`);
      return next(node);
    }
  );

  // When we visit the tree using that visitor.
  const result = visit(node, visitor);

  // Then we still get the full tree back as different instances.
  t.deepEqual(result, node);
  t.not(result, node);
  assertTupleTypeNode(result);
  t.not(result.children[0], node.children[0]);
  t.not(result.children[1], node.children[1]);

  // But the unsupported node was not visited.
  t.deepEqual(events, ['visiting:tupleTypeNode', 'visiting:numberTypeNode']);

  // And the unsupported node cannot be visited.
  // @ts-expect-error
  t.throws(() => visit(publicKeyTypeNode(), visitor));
});
