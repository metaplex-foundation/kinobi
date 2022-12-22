const {
  RenderJavaScriptVisitor,
  Kinobi,
  InlineDefinedTypesForInstructionArgsVisitor,
  InlineDefinedTypesVisitor,
  InlineStructsForInstructionArgsVisitor,
  PrintVisitor,
  TransformU8ArraysToBytesVisitor,
  IdentifyDefaultInstructionAccountsVisitor,
} = require('../dist/index.js');

const kinobi = new Kinobi(__dirname + '/idl.json');
console.log('\n', '--- BEFORE VISITORS ---', '\n');
kinobi.accept(new PrintVisitor());
console.log('\n', '--- AFTER VISITORS ---', '\n');
kinobi.update(new IdentifyDefaultInstructionAccountsVisitor());
kinobi.update(new TransformU8ArraysToBytesVisitor());
kinobi.update(new InlineDefinedTypesVisitor(['Payload', 'SeedsVec']));
kinobi.update(new InlineDefinedTypesForInstructionArgsVisitor());
kinobi.update(new InlineStructsForInstructionArgsVisitor());
kinobi.accept(new PrintVisitor());
kinobi.accept(
  new RenderJavaScriptVisitor('./package/src/generated', { formatCode: true }),
);
