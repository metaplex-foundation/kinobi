import * as nodes from '../../../nodes';
import { pascalCase } from '../../../shared';
import { TypeManifest } from '../TypeManifest';
import { Fragment, fragment, fragmentFromTemplate } from './common';
import { getTypeWithCodecFragment } from './typeWithCodec';

export function getAccountTypeFragment(
  accountNode: nodes.AccountNode,
  manifest: TypeManifest
): Fragment {
  const typeWithCodecFragment = accountNode.data.link
    ? fragment('')
    : getTypeWithCodecFragment(accountNode.data.name, manifest);

  const dataNameFragment = accountNode.data.link
    ? manifest.strictType.clone()
    : fragment(pascalCase(accountNode.data.name));

  return fragmentFromTemplate('accountType.njk', {
    name: pascalCase(accountNode.name),
    dataName: dataNameFragment.render,
    link: accountNode.data.link,
    typeWithCodec: typeWithCodecFragment,
  })
    .mergeImportsWith(dataNameFragment, typeWithCodecFragment)
    .addImports('shared', 'Account');
}
