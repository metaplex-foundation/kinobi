import test from 'ava';
import {
  accountNode,
  arrayTypeNode,
  definedTypeLinkNode,
  definedTypeNode,
  fixedSizeNode,
  getByteSizeVisitor,
  getGpaFieldsFromAccount,
  getNestedGpaFieldsFromAccount,
  LinkableDictionary,
  numberTypeNode,
  publicKeyTypeNode,
  structFieldTypeNode,
  structTypeNode,
} from '../../src';

test('it extracts nested struct fields with correct offsets', (t) => {
  // Create a defined type with a simple struct.
  const configType = definedTypeNode({
    name: 'config',
    type: structTypeNode([
      structFieldTypeNode({ name: 'maxItems', type: numberTypeNode('u32') }),
      structFieldTypeNode({ name: 'authority', type: publicKeyTypeNode() }),
    ]),
  });

  // Create an account that references the struct type.
  const account = accountNode({
    name: 'myAccount',
    data: structTypeNode([
      structFieldTypeNode({ name: 'owner', type: publicKeyTypeNode() }),
      structFieldTypeNode({
        name: 'config',
        type: definedTypeLinkNode('config'),
      }),
    ]),
  });

  const linkables = new LinkableDictionary().record(configType);
  const byteSizeVisitor = getByteSizeVisitor(linkables);
  const gpaFields = getGpaFieldsFromAccount(account, byteSizeVisitor);
  const nestedFields = getNestedGpaFieldsFromAccount(
    gpaFields,
    linkables,
    byteSizeVisitor
  );

  t.is(nestedFields.length, 1);
  t.is(nestedFields[0].parentFieldName, 'config');
  t.is(nestedFields[0].fields.length, 2);

  // maxItems at offset 32 (after 32-byte publicKey)
  t.is(nestedFields[0].fields[0].name, 'maxItems');
  t.is(nestedFields[0].fields[0].offset, 32);

  // authority at offset 36 (32 + 4 bytes for u32)
  t.is(nestedFields[0].fields[1].name, 'authority');
  t.is(nestedFields[0].fields[1].offset, 36);
});

test('it filters out padding fields from nested structs', (t) => {
  // Create a struct type with padding between fields.
  const paddedConfigType = definedTypeNode({
    name: 'paddedConfig',
    type: structTypeNode([
      structFieldTypeNode({ name: 'maxItems', type: numberTypeNode('u32') }),
      structFieldTypeNode({
        name: 'padding',
        type: arrayTypeNode(numberTypeNode('u8'), fixedSizeNode(4)),
        defaultValueStrategy: 'omitted',
      }),
      structFieldTypeNode({ name: 'authority', type: publicKeyTypeNode() }),
    ]),
  });

  const account = accountNode({
    name: 'myAccount',
    data: structTypeNode([
      structFieldTypeNode({ name: 'owner', type: publicKeyTypeNode() }),
      structFieldTypeNode({
        name: 'config',
        type: definedTypeLinkNode('paddedConfig'),
      }),
    ]),
  });

  const linkables = new LinkableDictionary().record(paddedConfigType);
  const byteSizeVisitor = getByteSizeVisitor(linkables);
  const gpaFields = getGpaFieldsFromAccount(account, byteSizeVisitor);
  const nestedFields = getNestedGpaFieldsFromAccount(
    gpaFields,
    linkables,
    byteSizeVisitor
  );

  t.is(nestedFields.length, 1);
  // Padding field should be filtered out.
  t.is(nestedFields[0].fields.length, 2);

  // maxItems at offset 32 (after 32-byte publicKey)
  t.is(nestedFields[0].fields[0].name, 'maxItems');
  t.is(nestedFields[0].fields[0].offset, 32);

  // authority at offset 40 (32 + 4 bytes u32 + 4 bytes padding),
  // NOT 36, which would be wrong if padding was simply omitted
  // without accounting for its size.
  t.is(nestedFields[0].fields[1].name, 'authority');
  t.is(nestedFields[0].fields[1].offset, 40);
});

test('it skips non-struct defined types', (t) => {
  // An enum type, not a struct — should not produce nested fields.
  const enumType = definedTypeNode({
    name: 'myEnum',
    type: numberTypeNode('u8'),
  });

  const account = accountNode({
    name: 'myAccount',
    data: structTypeNode([
      structFieldTypeNode({
        name: 'status',
        type: definedTypeLinkNode('myEnum'),
      }),
    ]),
  });

  const linkables = new LinkableDictionary().record(enumType);
  const byteSizeVisitor = getByteSizeVisitor(linkables);
  const gpaFields = getGpaFieldsFromAccount(account, byteSizeVisitor);
  const nestedFields = getNestedGpaFieldsFromAccount(
    gpaFields,
    linkables,
    byteSizeVisitor
  );

  t.is(nestedFields.length, 0);
});

test('it skips imported (external) type links', (t) => {
  const configType = definedTypeNode({
    name: 'config',
    type: structTypeNode([
      structFieldTypeNode({ name: 'value', type: numberTypeNode('u64') }),
    ]),
  });

  const account = accountNode({
    name: 'myAccount',
    data: structTypeNode([
      structFieldTypeNode({
        name: 'config',
        type: definedTypeLinkNode('config', 'someOtherProgram'),
      }),
    ]),
  });

  const linkables = new LinkableDictionary().record(configType);
  const byteSizeVisitor = getByteSizeVisitor(linkables);
  const gpaFields = getGpaFieldsFromAccount(account, byteSizeVisitor);
  const nestedFields = getNestedGpaFieldsFromAccount(
    gpaFields,
    linkables,
    byteSizeVisitor
  );

  t.is(nestedFields.length, 0);
});
