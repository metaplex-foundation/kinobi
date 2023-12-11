import * as nodes from '../../../nodes';
import { pascalCase } from '../../../shared';
import { TypeManifest } from '../TypeManifest';
import { Fragment, fragment, fragmentFromTemplate } from './common';

export function getAccountFetchHelpersFragment(
  accountNode: nodes.AccountNode,
  manifest: TypeManifest
): Fragment {
  const decoderFunctionFragment = accountNode.data.link
    ? manifest.decoder.clone()
    : fragment(`get${pascalCase(accountNode.data.name)}Decoder()`);

  return fragmentFromTemplate('accountFetchHelpers.njk', {
    pascalCaseName: pascalCase(accountNode.name),
    decoderFunction: decoderFunctionFragment.render,
  })
    .mergeImportsWith(decoderFunctionFragment)
    .addImports('solanaAddresses', ['Address'])
    .addImports('shared', ['Context'])
    .addImports('solanaAccounts', [
      'assertAccountExists',
      'decodeAccount',
      'EncodedAccount',
      'FetchAccountConfig',
      'FetchAccountsConfig',
    ]);
}
