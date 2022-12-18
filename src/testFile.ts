/* eslint-disable no-console */
import type { Idl } from './idl';
import idl from './idl.json';
import { Solita } from './Solita';
import {
  InlineInstructionArgsVisitor,
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

solita.updateRootNode(new TransformU8ArraysToBytesVisitor());
solita.updateRootNode(new InlineInstructionArgsVisitor());
solita.accept(new PrintVisitor());
