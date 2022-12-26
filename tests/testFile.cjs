const {
  RenderJavaScriptVisitor,
  Kinobi,
  InlineDefinedTypesForInstructionArgsVisitor,
  InlineStructsForInstructionArgsVisitor,
  PrintVisitor,
  TransformU8ArraysToBytesVisitor,
  IdentifyDefaultInstructionAccountsVisitor,
  ValidateTreeVisitor,
} = require('../dist/index.js');

const kinobi = new Kinobi(__dirname + '/mpl_token_metadata.json', false);
console.log('\n', '--- BEFORE VISITORS ---', '\n');
kinobi.accept(new PrintVisitor());
console.log('\n', '--- AFTER VISITORS ---', '\n');
kinobi.update(new IdentifyDefaultInstructionAccountsVisitor());
kinobi.update(new TransformU8ArraysToBytesVisitor());
kinobi.update(new InlineDefinedTypesForInstructionArgsVisitor());
kinobi.update(new InlineStructsForInstructionArgsVisitor());
kinobi.accept(new PrintVisitor());
const items = kinobi.accept(new ValidateTreeVisitor());
console.log(
  items
    .map(
      (item) => `${item.level}: ${item.message}.\n[${item.stack.join(' -> ')}].`
    )
    .join('\n\n')
);
kinobi.accept(
  new RenderJavaScriptVisitor('./package/src/generated', { formatCode: true })
);
