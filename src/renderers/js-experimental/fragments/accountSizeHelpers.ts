import * as nodes from '../../../nodes';
import { Fragment, fragment, fragmentFromTemplate } from './common';

export function getAccountSizeHelpersFragment(
  accountNode: nodes.AccountNode
): Fragment {
  if (accountNode.size == null) {
    return fragment('');
  }

  return fragmentFromTemplate('accountSizeHelpers.njk', {
    account: accountNode,
  });
}
