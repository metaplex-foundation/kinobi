import { AccountNode } from '../../../nodes';
import { TypeManifest } from '../TypeManifest';
import type { GlobalFragmentScope } from '../getRenderMapVisitor';
import { Fragment, fragment } from './common';
import { getTypeWithCodecFragment } from './typeWithCodec';

export function getAccountTypeFragment(
  scope: Pick<GlobalFragmentScope, 'nameApi' | 'customAccountData'> & {
    accountNode: AccountNode;
    typeManifest: TypeManifest;
  }
): Fragment {
  const { accountNode, typeManifest, nameApi, customAccountData } = scope;
  const customData = customAccountData.get(accountNode.name);

  if (customData) {
    // TODO
    // const dataNameFragment = typeManifest.strictType.clone();
    return fragment('');
  }

  return getTypeWithCodecFragment({
    name: accountNode.name,
    manifest: typeManifest,
    nameApi,
  });
}
