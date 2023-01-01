import {
  RenderJavaScriptVisitor,
  Kinobi,
  ConsoleLogVisitor,
  GetNodeTreeStringVisitor,
} from '../dist/index.js';

const kinobi = new Kinobi('./tests/mpl_token_auth_rules.json');
kinobi.accept(new ConsoleLogVisitor(new GetNodeTreeStringVisitor()));
kinobi.accept(new RenderJavaScriptVisitor('./package/src/generated'));
