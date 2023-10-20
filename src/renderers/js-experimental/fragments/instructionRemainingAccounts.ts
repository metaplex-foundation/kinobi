import * as nodes from '../../../nodes';
import { camelCase } from '../../../shared';
import { ContextMap } from '../ContextMap';
import {
  Fragment,
  fragmentFromTemplate,
  fragmentWithContextMap,
} from './common';

export function getInstructionRemainingAccountsFragment(
  instructionNode: nodes.InstructionNode
): Fragment & { interfaces: ContextMap } {
  const { remainingAccounts } = instructionNode;
  const remainingAccountsFragment = fragmentWithContextMap('');
  if (!remainingAccounts) {
    return remainingAccountsFragment;
  }

  if (remainingAccounts?.kind === 'resolver') {
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
