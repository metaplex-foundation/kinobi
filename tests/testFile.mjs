import {
  PrintVisitor,
  RenderJavaScriptVisitor,
  Kinobi,
} from '../dist/index.js';

const kinobi = new Kinobi('./tests/mpl_token_auth_rules.json');
kinobi.accept(new PrintVisitor());
kinobi.accept(new RenderJavaScriptVisitor('./package/src/generated'));
