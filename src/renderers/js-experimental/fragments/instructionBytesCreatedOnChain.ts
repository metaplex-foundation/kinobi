import { MainCaseString } from 'src/shared';
import { InstructionNode } from '../../../nodes';
import type { GlobalFragmentScope } from '../getRenderMapVisitor';
import { Fragment, fragment, fragmentFromTemplate } from './common';

export function getInstructionBytesCreatedOnChainFragment(
  scope: Pick<GlobalFragmentScope, 'nameApi' | 'asyncResolvers'> & {
    instructionNode: InstructionNode;
    useAsync: boolean;
  }
): Fragment {
  const bytes = scope.instructionNode.bytesCreatedOnChain;
  if (!bytes) return fragment('');

  const isAsync =
    bytes?.kind === 'resolver' &&
    scope.asyncResolvers.includes(bytes.name as MainCaseString);
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
