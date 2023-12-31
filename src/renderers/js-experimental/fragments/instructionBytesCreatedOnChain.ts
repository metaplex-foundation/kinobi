import { InstructionNode } from '../../../nodes';
import { NameApi } from '../nameTransformers';
import { Fragment, fragment, fragmentFromTemplate } from './common';

export function getInstructionBytesCreatedOnChainFragment(scope: {
  instructionNode: InstructionNode;
  asyncResolvers: string[];
  useAsync: boolean;
  nameApi: NameApi;
}): Fragment {
  const bytes = scope.instructionNode.bytesCreatedOnChain;
  if (!bytes) return fragment('');

  const isAsync =
    bytes?.kind === 'resolver' && scope.asyncResolvers.includes(bytes.name);
  if (!scope.useAsync && isAsync) return fragment('');

  const awaitKeyword = scope.useAsync && isAsync ? 'await ' : '';
  const bytesFragment = fragmentFromTemplate(
    'instructionBytesCreatedOnChain.njk',
    { bytes, awaitKeyword, nameApi: scope.nameApi }
  );

  if (bytes && 'includeHeader' in bytes && bytes.includeHeader) {
    bytesFragment.addImports('solanaAccounts', 'BASE_ACCOUNT_SIZE');
  }

  if (bytes?.kind === 'account') {
    const functionName = scope.nameApi.accountGetSizeFunction(bytes.name);
    const importFrom = bytes.importFrom ?? 'generatedAccounts';
    bytesFragment.addImports(importFrom, functionName);
  } else if (bytes?.kind === 'resolver') {
    const functionName = scope.nameApi.resolverFunction(bytes.name);
    bytesFragment.addImports(bytes.importFrom, functionName);
    bytesFragment.addFeatures(['instruction:resolverScopeVariable']);
  }

  return bytesFragment;
}
