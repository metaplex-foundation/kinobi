import * as nodes from '../../../nodes';
import { pascalCase } from '../../../shared';
import { TypeManifest } from '../TypeManifest';
import { Fragment, fragmentFromTemplate } from './common';
import { getTypeWithCodecFragment } from './typeWithCodec';

export function getAccountTypeFragment(
  accountNode: nodes.AccountNode,
  manifest: TypeManifest
): Fragment {
  const typeWithCodecFragment = getTypeWithCodecFragment(
    accountNode.data.name,
    manifest
  );

  const accountTypeFragment = fragmentFromTemplate('accountType.njk', {
    name: pascalCase(accountNode.name),
    dataName: pascalCase(accountNode.data.name),
    link: accountNode.data.link,
    typeWithCodecFragment,
  }).addImports('some-magical-place', 'Account');

  if (!accountNode.data.link) {
    accountTypeFragment.mergeImportsWith(typeWithCodecFragment);
  }

  return accountTypeFragment;
}
