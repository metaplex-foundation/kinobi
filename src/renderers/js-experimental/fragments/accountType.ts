import { AccountNode } from '../../../nodes';
import { TypeManifest } from '../TypeManifest';
import type { GlobalFragmentScope } from '../getRenderMapVisitor';
import { Fragment, fragment, fragmentFromTemplate } from './common';
import { getTypeWithCodecFragment } from './typeWithCodec';

export function getAccountTypeFragment(
  scope: Pick<GlobalFragmentScope, 'nameApi'> & {
    accountNode: AccountNode;
    typeManifest: TypeManifest;
  }
): Fragment {
  const { accountNode, typeManifest, nameApi } = scope;
  const typeWithCodecFragment = accountNode.data.link
    ? fragment('')
    : getTypeWithCodecFragment({
        name: accountNode.data.name,
        manifest: typeManifest,
        nameApi,
      });

  const dataNameFragment = accountNode.data.link
    ? typeManifest.strictType.clone()
    : fragment(nameApi.dataType(accountNode.data.name));

  return fragmentFromTemplate('accountType.njk', {
    accountType: nameApi.accountType(accountNode.name),
    dataName: dataNameFragment.render,
    typeWithCodec: typeWithCodecFragment,
  })
    .mergeImportsWith(dataNameFragment, typeWithCodecFragment)
    .addImports('solanaAccounts', 'Account');
}
