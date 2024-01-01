import { LinkableDictionary } from 'src/shared';
import { AccountNode, ProgramNode, isNodeFilter } from '../../../nodes';
import { NameApi } from '../nameTransformers';
import { Fragment, fragment, fragmentFromTemplate } from './common';

export function getAccountPdaHelpersFragment(scope: {
  accountNode: AccountNode;
  programNode: ProgramNode;
  nameApi: NameApi;
  linkables: LinkableDictionary;
}): Fragment {
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
    accountType: nameApi.accountType(accountNode.name),
    pdaSeedsType,
    findPdaFunction,
    fetchFunction: nameApi.accountFetchFunction(accountNode.name),
    safeFetchFunction: nameApi.accountSafeFetchFunction(accountNode.name),
    fetchFromSeedsFunction: nameApi.accountFetchFromSeedsFunction(
      accountNode.name
    ),
    safeFetchFromSeedsFunction: nameApi.accountSafeFetchFromSeedsFunction(
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
    .addImports('solanaAccounts', ['FetchAccountConfig']);
}
