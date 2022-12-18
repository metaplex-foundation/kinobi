/* eslint-disable no-console */
import type { Idl } from './idl';
import idl from './idl.json';
import { Solita } from './Solita';
import {
  InlineDefinedTypesForInstructionArgsVisitor,
  InlineStructsForInstructionArgsVisitor,
  PrintVisitor,
  TransformU8ArraysToBytesVisitor,
} from './visitors';

const solita = new Solita(idl as Partial<Idl>);
solita.accept(new PrintVisitor());

console.log('\n');
console.log('---------');
console.log('AFTER VISITORS');
console.log('---------');
console.log('\n');

solita.update(new TransformU8ArraysToBytesVisitor());
solita.update(new InlineDefinedTypesForInstructionArgsVisitor());
solita.update(new InlineStructsForInstructionArgsVisitor());
solita.accept(new PrintVisitor());
