import * as nodes from '../../../nodes';
import { camelCase, pascalCase } from '../../../shared';
import { Fragment, fragment, fragmentFromTemplate } from './common';

export function getInstructionBytesCreatedOnChainFragment(scope: {
  instructionNode: nodes.InstructionNode;
  asyncResolvers: string[];
  useAsync: boolean;
}): Fragment {
  const bytes = scope.instructionNode.bytesCreatedOnChain;
  if (!bytes) return fragment('');

  const isAsync =
    bytes?.kind === 'resolver' && scope.asyncResolvers.includes(bytes.name);
  if (!scope.useAsync && isAsync) return fragment('');

  const awaitKeyword = scope.useAsync && isAsync ? 'await ' : '';
  const bytesFragment = fragmentFromTemplate(
    'instructionBytesCreatedOnChain.njk',
    { bytes, awaitKeyword }
  );

  if (bytes && 'includeHeader' in bytes && bytes.includeHeader) {
    bytesFragment.addImports('solanaAccounts', 'BASE_ACCOUNT_SIZE');
  }

  if (bytes?.kind === 'account') {
    const importFrom =
      bytes.importFrom === 'generated' ? 'generatedAccounts' : bytes.importFrom;
    bytesFragment.addImports(importFrom, `get${pascalCase(bytes.name)}Size`);
  } else if (bytes?.kind === 'resolver') {
    bytesFragment.addImports(bytes.importFrom, camelCase(bytes.name));
    bytesFragment.addFeatures(['instruction:resolverScopeVariable']);
  }

  return bytesFragment;
}
