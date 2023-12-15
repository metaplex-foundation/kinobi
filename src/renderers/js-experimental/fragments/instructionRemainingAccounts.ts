import * as nodes from '../../../nodes';
import { NameApi } from '../nameTransformers';
import { Fragment, fragment, fragmentFromTemplate } from './common';

export function getInstructionRemainingAccountsFragment(scope: {
  instructionNode: nodes.InstructionNode;
  asyncResolvers: string[];
  useAsync: boolean;
  nameApi: NameApi;
}): Fragment {
  const { remainingAccounts } = scope.instructionNode;
  if (!remainingAccounts) return fragment('');

  const isAsync =
    remainingAccounts?.kind === 'resolver' &&
    scope.asyncResolvers.includes(remainingAccounts.name);
  if (!scope.useAsync && isAsync) return fragment('');

  const remainingAccountsFragment = fragmentFromTemplate(
    'instructionRemainingAccounts.njk',
    {
      remainingAccounts,
      awaitKeyword: scope.useAsync && isAsync ? 'await ' : '',
      nameApi: scope.nameApi,
    }
  ).addImports('solanaInstructions', ['IAccountMeta']);

  if (remainingAccounts?.kind === 'arg') {
    remainingAccountsFragment.addImports('solanaInstructions', ['AccountRole']);
  } else if (remainingAccounts?.kind === 'resolver') {
    const functionName = scope.nameApi.resolverFunction(remainingAccounts.name);
    remainingAccountsFragment
      .addImports(remainingAccounts.importFrom, functionName)
      .addFeatures(['instruction:resolverScopeVariable']);
  }

  return remainingAccountsFragment;
}
