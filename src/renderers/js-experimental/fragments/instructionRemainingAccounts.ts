import * as nodes from '../../../nodes';
import { camelCase } from '../../../shared';
import { Fragment, fragmentFromTemplate } from './common';

export function getInstructionRemainingAccountsFragment(scope: {
  instructionNode: nodes.InstructionNode;
  asyncResolvers: string[];
  useAsync: boolean;
}): Fragment {
  const { remainingAccounts } = scope.instructionNode;
  const isAsync =
    scope.useAsync &&
    remainingAccounts?.kind === 'resolver' &&
    scope.asyncResolvers.includes(remainingAccounts.name);
  const awaitKeyword = isAsync ? 'await ' : '';
  const remainingAccountsFragment = fragmentFromTemplate(
    'instructionRemainingAccounts.njk',
    { remainingAccounts, awaitKeyword }
  ).addImports('solanaInstructions', ['IAccountMeta']);

  if (remainingAccounts?.kind === 'arg') {
    remainingAccountsFragment.addImports('solanaInstructions', ['AccountRole']);
  } else if (remainingAccounts?.kind === 'resolver') {
    remainingAccountsFragment
      .addImports(
        remainingAccounts.importFrom,
        camelCase(remainingAccounts.name)
      )
      .addFeatures([
        'context:getProgramAddress',
        'context:getProgramDerivedAddress',
        'instruction:resolverScopeVariable',
      ]);
  }

  return remainingAccountsFragment;
}
