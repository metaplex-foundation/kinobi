import * as nodes from '../../../nodes';
import { NameApi } from '../nameTransformers';
import { Fragment, fragment, fragmentFromTemplate } from './common';

export function getAccountSizeHelpersFragment(scope: {
  accountNode: nodes.AccountNode;
  nameApi: NameApi;
}): Fragment {
  const { accountNode, nameApi } = scope;
  if (accountNode.size == null) {
    return fragment('');
  }

  return fragmentFromTemplate('accountSizeHelpers.njk', {
    account: accountNode,
    getSizeFunction: nameApi.accountGetSizeFunction(accountNode.name),
  });
}
