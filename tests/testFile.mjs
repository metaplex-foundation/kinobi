import idl from './idl.json';
import {
  RenderJavaScriptVisitor,
  Solita,
  InlineDefinedTypesForInstructionArgsVisitor,
  InlineDefinedTypesVisitor,
  InlineStructsForInstructionArgsVisitor,
  PrintVisitor,
  TransformU8ArraysToBytesVisitor,
} from './dist/index.js';

const solita = new Solita(idl);
solita.accept(new PrintVisitor());
console.log('\n', '--- AFTER VISITORS ---', '\n');
solita.update(new TransformU8ArraysToBytesVisitor());
solita.update(new InlineDefinedTypesVisitor(['Payload', 'SeedsVec']));
solita.update(new InlineDefinedTypesForInstructionArgsVisitor());
solita.update(new InlineStructsForInstructionArgsVisitor());
solita.accept(new PrintVisitor());
solita.accept(new RenderJavaScriptVisitor('./generated'));
