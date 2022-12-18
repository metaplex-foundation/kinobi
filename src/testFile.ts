/* eslint-disable no-console */
import type { Idl } from './idl';
import idl from './idl.json';
import { Solita } from './Solita';
import { PrintVisitor, TransformU8ArraysToBytesVisitor } from './visitors';
import { InlineDefinedTypesVisitor } from './visitors/InlineDefinedTypesVisitor';

const solita = new Solita(idl as Partial<Idl>);
solita.accept(new PrintVisitor());

console.log('---------');
console.log('AFTER VISITOR');
console.log('---------');

const { definedTypes } = solita.rootNode;

solita.updateRootNode(new InlineDefinedTypesVisitor(definedTypes));
solita.updateRootNode(new TransformU8ArraysToBytesVisitor());
solita.accept(new PrintVisitor());
