/* eslint-disable no-console */
import type { Idl } from './idl';
import idl from './idl.json';
import { Solita } from './Solita';
import {
  GetDefinedTypeHistogramVisitor,
  InlineDefinedTypesVisitor,
  PrintVisitor,
  TransformU8ArraysToBytesVisitor,
} from './visitors';

const solita = new Solita(idl as Partial<Idl>);
solita.accept(new PrintVisitor());

console.log('---------');
console.log('AFTER VISITORS');
console.log('---------');

const histogram = solita.accept(new GetDefinedTypeHistogramVisitor());
const definedTypesToInline = solita.rootNode.definedTypes.filter(
  (definedType) =>
    (histogram[definedType.name] ?? 0) === 1 &&
    definedType.name.endsWith('Args'),
);

solita.updateRootNode(new InlineDefinedTypesVisitor(definedTypesToInline));
solita.updateRootNode(new TransformU8ArraysToBytesVisitor());
solita.accept(new PrintVisitor());
