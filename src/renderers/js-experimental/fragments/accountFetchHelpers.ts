import { AccountNode } from '../../../nodes';
import { TypeManifest } from '../TypeManifest';
import type { GlobalFragmentScope } from '../getRenderMapVisitor';
import { Fragment, fragment, fragmentFromTemplate } from './common';

export function getAccountFetchHelpersFragment(
  scope: Pick<GlobalFragmentScope, 'nameApi' | 'customAccountData'> & {
    accountNode: AccountNode;
    typeManifest: TypeManifest;
  }
): Fragment {
  const { accountNode, typeManifest, nameApi, customAccountData } = scope;
  const accountDataName = nameApi.accountDataType(accountNode.name);
  const decoderFunctionFragment = customAccountData.has(accountNode.name)
    ? typeManifest.decoder.clone()
    : fragment(`${nameApi.decoderFunction(accountDataName)}()`);

  return fragmentFromTemplate('accountFetchHelpers.njk', {
    decoderFunction: decoderFunctionFragment.render,
    accountType: nameApi.accountType(accountNode.name),
    decodeFunction: nameApi.accountDecodeFunction(accountNode.name),
    fetchFunction: nameApi.accountFetchFunction(accountNode.name),
    safeFetchFunction: nameApi.accountSafeFetchFunction(accountNode.name),
    fetchAllFunction: nameApi.accountFetchAllFunction(accountNode.name),
    safeFetchAllFunction: nameApi.accountSafeFetchAllFunction(accountNode.name),
  })
    .mergeImportsWith(decoderFunctionFragment)
    .addImports('solanaAddresses', ['Address'])
    .addImports('solanaAccounts', [
      'assertAccountExists',
      'decodeAccount',
      'EncodedAccount',
      'fetchEncodedAccount',
      'fetchEncodedAccounts',
      'FetchAccountConfig',
      'FetchAccountsConfig',
    ]);
}
