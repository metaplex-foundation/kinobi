/* eslint-disable no-console */
import type { Idl } from './idl';
import idl from './idl.json';
import { Solita } from './Solita';
import { PrintVisitor, TransformU8ArraysToBytesVisitor } from './visitors';

const solita = new Solita(idl as Partial<Idl>);
solita.accept(new PrintVisitor());

console.log('---------');
console.log('AFTER VISITOR');
console.log('---------');

solita.updateRootNode(new TransformU8ArraysToBytesVisitor());
solita.accept(new PrintVisitor());
