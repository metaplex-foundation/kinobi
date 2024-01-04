import test from 'ava';
import { programNode, visit } from '../../../src';
import { getRenderMapVisitor } from '../../../src/renderers/js-experimental/getRenderMapVisitor';

test('it renders the program address constant', (t) => {
  // Given
  const node = programNode({
    name: 'splToken',
    publicKey: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  });

  // When
  const renderMap = visit(node, getRenderMapVisitor());

  // Then
  t.true(renderMap.has('programs/splToken.ts'));
  t.true(
    renderMap.contains(
      'programs/splToken.ts',
      /export const SPL_TOKEN_PROGRAM_ADDRESS =\s+'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' as Address<'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'>;/
    )
  );
});
