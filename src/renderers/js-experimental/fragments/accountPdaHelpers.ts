import { AccountNode, ProgramNode, isNodeFilter } from '../../../nodes';
import type { TypeManifest } from '../TypeManifest';
import type { GlobalFragmentScope } from '../getRenderMapVisitor';
import { Fragment, fragment, fragmentFromTemplate } from './common';

export function getAccountPdaHelpersFragment(
  scope: Pick<
    GlobalFragmentScope,
    'nameApi' | 'linkables' | 'customAccountData'
  > & {
    accountNode: AccountNode;
    programNode: ProgramNode;
    typeManifest: TypeManifest;
  }
): Fragment {
  const {
    accountNode,
    programNode,
    nameApi,
    linkables,
    customAccountData,
    typeManifest,
  } = scope;
  const pdaNode = accountNode.pda ? linkables.get(accountNode.pda) : undefined;
  if (!pdaNode) {
    return fragment('');
  }

  const accountTypeFragment = customAccountData.has(accountNode.name)
    ? typeManifest.strictType.clone()
    : fragment(nameApi.dataType(accountNode.name));

  const importFrom = 'generatedPdas';
  const pdaSeedsType = nameApi.pdaSeedsType(pdaNode.name);
  const findPdaFunction = nameApi.pdaFindFunction(pdaNode.name);
  const hasVariableSeeds =
    pdaNode.seeds.filter(isNodeFilter('variablePdaSeedNode')).length > 0;

  return fragmentFromTemplate('accountPdaHelpers.njk', {
    accountType: accountTypeFragment.render,
    pdaSeedsType,
    findPdaFunction,
    fetchFunction: nameApi.accountFetchFunction(accountNode.name),
    fetchMaybeFunction: nameApi.accountFetchMaybeFunction(accountNode.name),
    fetchFromSeedsFunction: nameApi.accountFetchFromSeedsFunction(
      accountNode.name
    ),
    fetchMaybeFromSeedsFunction: nameApi.accountFetchMaybeFromSeedsFunction(
      accountNode.name
    ),
    program: programNode,
    hasVariableSeeds,
  })
    .mergeImportsWith(accountTypeFragment)
    .addImports(
      importFrom,
      hasVariableSeeds ? [pdaSeedsType, findPdaFunction] : [findPdaFunction]
    )
    .addImports('solanaAddresses', ['Address'])
    .addImports('solanaAccounts', [
      'Account',
      'assertAccountExists',
      'FetchAccountConfig',
      'MaybeAccount',
    ]);
}
