import test from 'ava';
import {
  LinkableDictionary,
  fixedSizeTypeNode,
  hiddenPrefixTypeNode,
  numberTypeNode,
  preOffsetTypeNode,
  publicKeyTypeNode,
  remainderOptionTypeNode,
  sizePrefixTypeNode,
  visit,
  zeroableOptionTypeNode,
} from '../../../src';
import { getTypeManifestVisitor } from '../../../src/renderers/js-experimental/getTypeManifestVisitor';
import {
  DEFAULT_NAME_TRANSFORMERS,
  getNameApi,
} from '../../../src/renderers/js-experimental/nameTransformers';
import { renderValueNodeVisitor } from '../../../src/renderers/js-experimental/renderValueNodeVisitor';

function createTypeManifestVisitor() {
  const linkables = new LinkableDictionary();
  const nameApi = getNameApi(DEFAULT_NAME_TRANSFORMERS);
  return getTypeManifestVisitor({
    nameApi,
    valueNodeVisitor: renderValueNodeVisitor({
      nameApi,
      linkables,
      nonScalarEnums: [],
    }),
    customAccountData: new Map(),
    customInstructionData: new Map(),
  });
}

// Codama v1.0 added six new type nodes (zeroableOptionTypeNode,
// remainderOptionTypeNode, sizePrefixTypeNode, fixedSizeTypeNode,
// hiddenPrefixTypeNode, preOffsetTypeNode) that this renderer does not yet
// support. Before this hardening fix, visiting them silently fell through to
// the staticVisitor default (an empty manifest, no recursion into children)
// instead of failing loudly. These tests assert each one now throws a clear,
// specific error instead of mis-rendering silently.

test('it throws when visiting a zeroableOptionTypeNode', (t) => {
  const node = zeroableOptionTypeNode(publicKeyTypeNode());
  t.throws(() => visit(node, createTypeManifestVisitor()), {
    message:
      'zeroableOptionTypeNode is not yet supported by the experimental JavaScript renderer.',
  });
});

test('it throws when visiting a remainderOptionTypeNode', (t) => {
  const node = remainderOptionTypeNode(numberTypeNode('u8'));
  t.throws(() => visit(node, createTypeManifestVisitor()), {
    message:
      'remainderOptionTypeNode is not yet supported by the experimental JavaScript renderer.',
  });
});

test('it throws when visiting a sizePrefixTypeNode', (t) => {
  const node = sizePrefixTypeNode(numberTypeNode('u8'), numberTypeNode('u16'));
  t.throws(() => visit(node, createTypeManifestVisitor()), {
    message:
      'sizePrefixTypeNode is not yet supported by the experimental JavaScript renderer.',
  });
});

test('it throws when visiting a fixedSizeTypeNode', (t) => {
  const node = fixedSizeTypeNode(numberTypeNode('u8'), 8);
  t.throws(() => visit(node, createTypeManifestVisitor()), {
    message:
      'fixedSizeTypeNode is not yet supported by the experimental JavaScript renderer.',
  });
});

test('it throws when visiting a hiddenPrefixTypeNode', (t) => {
  const node = hiddenPrefixTypeNode(numberTypeNode('u8'), []);
  t.throws(() => visit(node, createTypeManifestVisitor()), {
    message:
      'hiddenPrefixTypeNode is not yet supported by the experimental JavaScript renderer.',
  });
});

test('it throws when visiting a preOffsetTypeNode', (t) => {
  const node = preOffsetTypeNode(numberTypeNode('u8'), 4, 'relative');
  t.throws(() => visit(node, createTypeManifestVisitor()), {
    message:
      'preOffsetTypeNode is not yet supported by the experimental JavaScript renderer.',
  });
});
