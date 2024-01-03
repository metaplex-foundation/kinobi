import { AccountNode } from '../../../nodes';
import { TypeManifest } from '../TypeManifest';
import type { GlobalFragmentScope } from '../getRenderMapVisitor';
import { Fragment, fragment, fragmentFromTemplate } from './common';
import { getTypeWithCodecFragment } from './typeWithCodec';

export function getAccountTypeFragment(
  scope: Pick<GlobalFragmentScope, 'nameApi' | 'customAccountData'> & {
    accountNode: AccountNode;
    typeManifest: TypeManifest;
  }
): Fragment {
  const { accountNode, typeManifest, nameApi, customAccountData } = scope;
  const customData = customAccountData.get(accountNode.name);
  const accountDataName = nameApi.accountDataType(accountNode.name);
  const typeWithCodecFragment = customData
    ? fragment('')
    : getTypeWithCodecFragment({
        name: accountDataName,
        manifest: typeManifest,
        nameApi,
      });

  const dataNameFragment = customData
    ? typeManifest.strictType.clone()
    : fragment(nameApi.dataType(accountDataName));

  return fragmentFromTemplate('accountType.njk', {
    accountType: nameApi.accountType(accountNode.name),
    dataName: dataNameFragment.render,
    typeWithCodec: typeWithCodecFragment,
  })
    .mergeImportsWith(dataNameFragment, typeWithCodecFragment)
    .addImports('solanaAccounts', 'Account');
}
