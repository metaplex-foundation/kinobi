import * as nodes from '../../../nodes';
import { camelCase, pascalCase } from '../../../shared';
import { Fragment, fragmentFromTemplate } from './common';

export function getInstructionBytesCreatedOnChainFragment(scope: {
  instructionNode: nodes.InstructionNode;
  asyncResolvers: string[];
  useAsync: boolean;
}): Fragment {
  const bytes = scope.instructionNode.bytesCreatedOnChain;
  const isAsync =
    scope.useAsync &&
    bytes?.kind === 'resolver' &&
    scope.asyncResolvers.includes(bytes.name);
  const awaitKeyword = isAsync ? 'await ' : '';
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
    bytesFragment.addFeatures([
      'context:getProgramAddress',
      'context:getProgramDerivedAddress',
      'instruction:resolverScopeVariable',
    ]);
  }

  return bytesFragment;
}
