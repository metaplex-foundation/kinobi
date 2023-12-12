import * as nodes from '../../../nodes';
import { camelCase } from '../../../shared';
import { Fragment, fragmentFromTemplate } from './common';

export function getInstructionRemainingAccountsFragment(scope: {
  instructionNode: nodes.InstructionNode;
}): Fragment {
  const { remainingAccounts } = scope.instructionNode;
  const remainingAccountsFragment = fragmentFromTemplate(
    'instructionRemainingAccounts.njk',
    { remainingAccounts }
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
      ]);
  }

  return remainingAccountsFragment;
}
