import * as nodes from '../../../nodes';
import { pascalCase } from '../../../shared';
import { Fragment, fragmentFromTemplate } from './common';

export function getAccountFetchHelpersFragment(
  accountNode: nodes.AccountNode
): Fragment {
  const accountDataName = accountNode.data.link
    ? accountNode.data.link.name
    : accountNode.data.name;

  return fragmentFromTemplate('accountFetchHelpers.njk', {
    pascalCaseName: pascalCase(accountNode.name),
    encoderFunction: `get${pascalCase(accountDataName)}Encoder`,
  })
    .addImports('solanaAddresses', ['Base58EncodedAddress'])
    .addImports('some-magical-place', [
      'assertAccountExists',
      'Context',
      'deserializeAccount',
      'RpcAccount',
      'RpcGetAccountOptions',
      'RpcGetAccountsOptions',
    ]);
}
