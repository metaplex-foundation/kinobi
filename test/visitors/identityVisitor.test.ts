import test from 'ava';
import {
  assertIsNode,
  enumStructVariantTypeNode,
  identityVisitor,
  interceptVisitor,
  numberTypeNode,
  publicKeyTypeNode,
  remainderOptionTypeNode,
  sizePrefixTypeNode,
  structFieldTypeNode,
  structTypeNode,
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
  assertIsNode(result, 'tupleTypeNode');
  t.not(result.items[0], node.items[0]);
  t.not(result.items[1], node.items[1]);
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
  assertIsNode(result, 'tupleTypeNode');
  t.not(result.items[0], node.items[0]);
  t.not(result.items[1], node.items[1]);

  // But the unsupported node was not visited.
  t.deepEqual(events, ['visiting:tupleTypeNode', 'visiting:numberTypeNode']);

  // And the unsupported node cannot be visited.
  // @ts-expect-error
  t.throws(() => visit(publicKeyTypeNode(), visitor));
});

test('it visits remainder option type nodes', (t) => {
  // Given a remainder option node wrapping a public key.
  const node = remainderOptionTypeNode(publicKeyTypeNode());

  // When we visit it using the identity visitor.
  const result = visit(node, identityVisitor());

  // Then we get a new instance of the same tree back.
  t.deepEqual(result, node);
  t.not(result, node);

  // And the item itself was recursed into (not just shallow-copied), proving
  // the visitor traverses into `node.item` rather than falling back to the
  // generic top-level clone.
  assertIsNode(result, 'remainderOptionTypeNode');
  t.not(result.item, node.item);
});

test('it keeps nested structs on enum struct variant type nodes', (t) => {
  // Given an enum struct variant whose struct is wrapped in a size prefix,
  // as found in the Token-2022 extension TLV entries, and which carries a
  // discriminator (as Token-2022's TLV extension entries do).
  const node = enumStructVariantTypeNode(
    'transferFeeConfig',
    sizePrefixTypeNode(
      structTypeNode([
        structFieldTypeNode({ name: 'value', type: numberTypeNode('u64') }),
      ]),
      numberTypeNode('u16')
    ),
    7
  );

  // When we visit it using the identity visitor.
  const result = visit(node, identityVisitor());

  // Then the nested struct is preserved as-is, and the discriminator survives
  // the visit instead of being silently dropped.
  t.deepEqual(result, node);
  assertIsNode(result, 'enumStructVariantTypeNode');
  t.is(result.discriminator, 7);
});
