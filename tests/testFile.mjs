import {
  IdentifyDefaultInstructionAccountsVisitor,
  InlineDefinedTypesForInstructionArgsVisitor,
  InlineDefinedTypesVisitor,
  InlineStructsForInstructionArgsVisitor,
  PrintVisitor,
  RenderJavaScriptVisitor,
  Kinobi,
  TransformU8ArraysToBytesVisitor,
} from '../dist/index.js';

const kinobi = new Kinobi('./tests/mpl_token_auth_rules.json');
console.log('\n', '--- BEFORE VISITORS ---', '\n');
kinobi.accept(new PrintVisitor());
console.log('\n', '--- AFTER VISITORS ---', '\n');
kinobi.update(new IdentifyDefaultInstructionAccountsVisitor());
kinobi.update(new TransformU8ArraysToBytesVisitor());
kinobi.update(new InlineDefinedTypesVisitor(['Payload', 'SeedsVec']));
kinobi.update(new InlineDefinedTypesForInstructionArgsVisitor());
kinobi.update(new InlineStructsForInstructionArgsVisitor());
kinobi.accept(new PrintVisitor());
kinobi.accept(new RenderJavaScriptVisitor('./package/src/generated'));
