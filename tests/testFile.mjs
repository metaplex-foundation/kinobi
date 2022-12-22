import {
  IdentifyDefaultInstructionAccountsVisitor,
  InlineDefinedTypesForInstructionArgsVisitor,
  InlineDefinedTypesVisitor,
  InlineStructsForInstructionArgsVisitor,
  PrintVisitor,
  RenderJavaScriptVisitor,
  Solita,
  TransformU8ArraysToBytesVisitor,
} from '../dist/index.js';

const solita = new Solita('./tests/idl.json');
console.log('\n', '--- BEFORE VISITORS ---', '\n');
solita.accept(new PrintVisitor());
console.log('\n', '--- AFTER VISITORS ---', '\n');
solita.update(new IdentifyDefaultInstructionAccountsVisitor());
solita.update(new TransformU8ArraysToBytesVisitor());
solita.update(new InlineDefinedTypesVisitor(['Payload', 'SeedsVec']));
solita.update(new InlineDefinedTypesForInstructionArgsVisitor());
solita.update(new InlineStructsForInstructionArgsVisitor());
solita.accept(new PrintVisitor());
solita.accept(new RenderJavaScriptVisitor('./package/src/generated'));
