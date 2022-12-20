const {
  RenderJavaScriptVisitor,
  Solita,
  InlineDefinedTypesForInstructionArgsVisitor,
  InlineDefinedTypesVisitor,
  InlineStructsForInstructionArgsVisitor,
  PrintVisitor,
  TransformU8ArraysToBytesVisitor,
  GetJavaScriptTypeDefinitionVisitor,
} = require('../dist/index.js');

const solita = new Solita(__dirname + '/idl.json');
console.log('\n', '--- BEFORE VISITORS ---', '\n');
solita.accept(new PrintVisitor());
console.log('\n', '--- AFTER VISITORS ---', '\n');
solita.update(new TransformU8ArraysToBytesVisitor());
solita.update(new InlineDefinedTypesVisitor(['Payload', 'SeedsVec']));
solita.update(new InlineDefinedTypesForInstructionArgsVisitor());
solita.update(new InlineStructsForInstructionArgsVisitor());
solita.accept(new PrintVisitor());
solita.accept(new RenderJavaScriptVisitor('./generated', { formatCode: true }));
