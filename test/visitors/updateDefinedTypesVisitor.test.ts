import test from 'ava';
import {
  DefinedTypeUpdates,
  MainCaseString,
  assertIsNode,
  definedTypeLinkNode,
  definedTypeNode,
  isNode,
  numberTypeNode,
  pascalCase,
  programNode,
  structFieldTypeNode,
  structTypeNode,
  updateDefinedTypesVisitor,
  visit,
} from '../../src';

const programWithLinkedTypes = () =>
  programNode({
    name: 'myProgram',
    publicKey: '1111',
    definedTypes: [
      definedTypeNode({ name: 'oracle', type: structTypeNode([]) }),
      definedTypeNode({ name: 'oracleInitInfo', type: structTypeNode([]) }),
      definedTypeNode({ name: 'royalties', type: structTypeNode([]) }),
      definedTypeNode({
        name: 'adapter',
        type: structTypeNode([
          structFieldTypeNode({
            name: 'oracle',
            type: definedTypeLinkNode('oracle'),
          }),
          structFieldTypeNode({
            name: 'info',
            type: definedTypeLinkNode('oracleInitInfo'),
          }),
          structFieldTypeNode({
            name: 'royalties',
            type: definedTypeLinkNode('royalties'),
          }),
        ]),
      }),
    ],
  });

const linkNamesOf = (node: ReturnType<typeof programNode>) => {
  const adapter = node.definedTypes.find((t) => t.name === 'adapter')!;
  assertIsNode(adapter.type, 'structTypeNode');
  return adapter.type.fields.map((f) => {
    assertIsNode(f.type, 'definedTypeLinkNode');
    return f.type.name;
  });
};

test('it updates the name of a defined type and its links', (t) => {
  // Given a program with a defined type that is linked from another type.
  const node = programWithLinkedTypes();

  // When we rename it using the record form.
  const result = visit(
    node,
    updateDefinedTypesVisitor({ oracle: { name: 'baseOracle' } })
  );

  // Then both the defined type and the link are renamed.
  assertIsNode(result, 'programNode');
  t.is(result.definedTypes[0].name, 'baseOracle' as MainCaseString);
  t.is(result.definedTypes[0].idlName, 'oracle');
  t.deepEqual(linkNamesOf(result), [
    'baseOracle',
    'oracleInitInfo',
    'royalties',
  ]);
});

test('it deletes a defined type using the record form', (t) => {
  // Given a program with three named defined types.
  const node = programWithLinkedTypes();

  // When we delete one of them.
  const result = visit(
    node,
    updateDefinedTypesVisitor({ royalties: { delete: true } })
  );

  // Then it is gone from the program.
  assertIsNode(result, 'programNode');
  t.false(result.definedTypes.some((d) => d.name === 'royalties'));
});

test('it renames defined types matched by a selector function', (t) => {
  // Given a program with several defined types linked from another type.
  const node = programWithLinkedTypes();

  // When we rename every type matching a pattern via the array form.
  const result = visit(
    node,
    updateDefinedTypesVisitor([
      {
        select: (n) => 'name' in n && /^oracle/.test(n.name),
        update: (n) => ({ name: `base${pascalCase(n.name)}` }),
      },
    ])
  );

  // Then all matching defined types are renamed.
  assertIsNode(result, 'programNode');
  t.deepEqual(
    result.definedTypes.map((d) => d.name),
    ['baseOracle', 'baseOracleInitInfo', 'royalties', 'adapter']
  );

  // And so are every link pointing at them, but nothing else.
  t.deepEqual(linkNamesOf(result), [
    'baseOracle',
    'baseOracleInitInfo',
    'royalties',
  ]);
});

test('it accepts a static update object in the array form', (t) => {
  // Given a program with a defined type.
  const node = programWithLinkedTypes();

  // When we update it using a string selector and a static update object.
  const result = visit(
    node,
    updateDefinedTypesVisitor([
      { select: 'royalties', update: { name: 'baseRoyalties' } },
    ])
  );

  // Then the defined type and its link are renamed.
  assertIsNode(result, 'programNode');
  t.is(result.definedTypes[2].name, 'baseRoyalties' as MainCaseString);
  t.deepEqual(linkNamesOf(result), [
    'oracle',
    'oracleInitInfo',
    'baseRoyalties',
  ]);
});

test('it can inspect the defined type node inside the update function', (t) => {
  // Given a program with an empty struct and a non-empty struct.
  const node = programNode({
    name: 'myProgram',
    publicKey: '1111',
    definedTypes: [
      definedTypeNode({ name: 'empty', type: structTypeNode([]) }),
      definedTypeNode({
        name: 'full',
        type: structTypeNode([
          structFieldTypeNode({ name: 'a', type: numberTypeNode('u8') }),
        ]),
      }),
    ],
  });

  // When we delete only the defined types whose struct has no fields.
  const result = visit(
    node,
    updateDefinedTypesVisitor([
      {
        select: '[definedTypeNode]',
        update: (n): DefinedTypeUpdates =>
          isNode(n, 'definedTypeNode') &&
          isNode(n.type, 'structTypeNode') &&
          n.type.fields.length === 0
            ? { delete: true }
            : {},
      },
    ])
  );

  // Then only the empty struct is removed.
  assertIsNode(result, 'programNode');
  t.deepEqual(
    result.definedTypes.map((d) => d.name),
    ['full']
  );
});
