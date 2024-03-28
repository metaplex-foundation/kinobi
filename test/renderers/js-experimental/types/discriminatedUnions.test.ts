import test from 'ava';
import {
  definedTypeNode,
  enumEmptyVariantTypeNode,
  enumStructVariantTypeNode,
  enumTupleVariantTypeNode,
  enumTypeNode,
  numberTypeNode,
  stringTypeNode,
  structFieldTypeNode,
  structTypeNode,
  tupleTypeNode,
  visit,
} from '../../../../src';
import { getRenderMapVisitor } from '../../../../src/renderers/js-experimental/getRenderMapVisitor';
import { renderMapContains } from '../_setup';

// Given the following event discriminated union.
const eventTypeNode = definedTypeNode({
  name: 'event',
  type: enumTypeNode([
    enumEmptyVariantTypeNode('quit'),
    enumTupleVariantTypeNode('write', tupleTypeNode([stringTypeNode()])),
    enumStructVariantTypeNode(
      'move',
      structTypeNode([
        structFieldTypeNode({ name: 'x', type: numberTypeNode('u32') }),
        structFieldTypeNode({ name: 'y', type: numberTypeNode('u32') }),
      ])
    ),
  ]),
});

test('it exports discriminated union codecs', (t) => {
  // When we render a discriminated union.
  const renderMap = visit(eventTypeNode, getRenderMapVisitor());

  // Then we expect the following codec helpers to be exported.
  renderMapContains(t, renderMap, 'types/event.ts', [
    'export function getEventEncoder(): Encoder< EventArgs >',
    'export function getEventDecoder(): Decoder< Event >',
    'export function getEventCodec(): Codec< EventArgs, Event >',
  ]);
});
