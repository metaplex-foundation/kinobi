import { AccountNode, ProgramNode } from '../../../nodes';
import { NameApi } from '../nameTransformers';
import { Fragment, fragment, fragmentFromTemplate } from './common';

export function getAccountPdaHelpersFragment(scope: {
  accountNode: AccountNode;
  programNode: ProgramNode;
  nameApi: NameApi;
}): Fragment {
  const { accountNode, programNode, nameApi } = scope;
  if (!accountNode.pda) {
    return fragment('');
  }

  const importFrom = accountNode.pda.importFrom ?? 'generatedPdas';
  const accountSeedsType = nameApi.accountSeedsType(accountNode.pda.name);
  const findPdaFunction = nameApi.accountFindPdaFunction(accountNode.pda.name);

  return fragmentFromTemplate('accountPdaHelpers.njk', {
    accountType: nameApi.accountType(accountNode.name),
    accountSeedsType,
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
    hasVariableSeeds: true, // TODO: fetch information from PdaNode or fallback to true.
  })
    .addImports(importFrom, [accountSeedsType, findPdaFunction])
    .addImports('solanaAddresses', [
      'Address',
      'getProgramDerivedAddress',
      'ProgramDerivedAddress',
    ])
    .addImports('solanaAccounts', ['FetchAccountConfig']);
}
