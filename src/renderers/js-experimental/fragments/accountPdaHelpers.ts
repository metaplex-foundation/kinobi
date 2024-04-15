import { AccountNode, ProgramNode, isNodeFilter } from '../../../nodes';
import type { GlobalFragmentScope } from '../getRenderMapVisitor';
import { Fragment, fragment, fragmentFromTemplate } from './common';

export function getAccountPdaHelpersFragment(
  scope: Pick<GlobalFragmentScope, 'nameApi' | 'linkables'> & {
    accountNode: AccountNode;
    programNode: ProgramNode;
  }
): Fragment {
  const { accountNode, programNode, nameApi, linkables } = scope;
  const pdaNode = accountNode.pda ? linkables.get(accountNode.pda) : undefined;
  if (!pdaNode) {
    return fragment('');
  }

  const importFrom = 'generatedPdas';
  const pdaSeedsType = nameApi.pdaSeedsType(pdaNode.name);
  const findPdaFunction = nameApi.pdaFindFunction(pdaNode.name);
  const hasVariableSeeds =
    pdaNode.seeds.filter(isNodeFilter('variablePdaSeedNode')).length > 0;

  return fragmentFromTemplate('accountPdaHelpers.njk', {
    accountType: nameApi.dataType(accountNode.name),
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
