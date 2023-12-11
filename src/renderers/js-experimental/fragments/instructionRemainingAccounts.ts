import * as nodes from '../../../nodes';
import { camelCase } from '../../../shared';
import { ContextMap } from '../ContextMap';
import {
  Fragment,
  fragmentFromTemplate,
  fragmentWithContextMap,
} from './common';

export function getInstructionRemainingAccountsFragment(scope: {
  instructionNode: nodes.InstructionNode;
}): Fragment & { interfaces: ContextMap } {
  const { remainingAccounts } = scope.instructionNode;
  const remainingAccountsFragment = fragmentWithContextMap('').addImports(
    'solanaInstructions',
    ['IAccountMeta']
  );

  if (remainingAccounts?.kind === 'arg') {
    remainingAccountsFragment.addImports('solanaInstructions', ['AccountRole']);
  } else if (remainingAccounts?.kind === 'resolver') {
    remainingAccountsFragment.addImports(
      remainingAccounts.importFrom,
      camelCase(remainingAccounts.name)
    );
    remainingAccountsFragment.interfaces.add([
      'getProgramAddress',
      'getProgramDerivedAddress',
    ]);
  }

  remainingAccountsFragment.setRender(
    fragmentFromTemplate('instructionRemainingAccounts.njk', {
      remainingAccounts,
    }).render
  );

  return remainingAccountsFragment;
}
