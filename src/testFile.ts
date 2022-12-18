/* eslint-disable no-console */
import type { Idl } from './idl';
import idl from './idl.json';
import { RenderJavaScriptVisitor } from './renderers';
import { Solita } from './Solita';
import {
  InlineDefinedTypesForInstructionArgsVisitor,
  InlineDefinedTypesVisitor,
  InlineStructsForInstructionArgsVisitor,
  PrintVisitor,
  TransformU8ArraysToBytesVisitor,
} from './visitors';

const solita = new Solita(idl as Partial<Idl>);
solita.accept(new PrintVisitor());
console.log('\n', '--- AFTER VISITORS ---', '\n');
solita.update(new TransformU8ArraysToBytesVisitor());
solita.update(new InlineDefinedTypesVisitor(['Payload', 'SeedsVec']));
solita.update(new InlineDefinedTypesForInstructionArgsVisitor());
solita.update(new InlineStructsForInstructionArgsVisitor());
solita.accept(new PrintVisitor());
solita.accept(new RenderJavaScriptVisitor('./generated'));
