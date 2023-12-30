import {
  AccountNode,
  ProgramNode,
  RegisteredTypeNodes,
  isConstantPdaSeedNode,
  isVariablePdaSeedNode,
} from '../../../nodes';
import { Visitor, visit } from '../../../visitors';
import { ImportMap } from '../ImportMap';
import { TypeManifest } from '../TypeManifest';
import { NameApi } from '../nameTransformers';
import { Fragment, fragment, fragmentFromTemplate } from './common';
import { getValueNodeFragment } from './valueNode';

export function getAccountPdaHelpersFragment(scope: {
  accountNode: AccountNode;
  programNode: ProgramNode;
  typeManifestVisitor: Visitor<TypeManifest, keyof RegisteredTypeNodes>;
  nameApi: NameApi;
}): Fragment {
  const { accountNode, programNode, typeManifestVisitor, nameApi } = scope;
  if (accountNode.seeds.length === 0) {
    return fragment('');
  }

  // Seeds.
  const imports = new ImportMap();
  const seeds = accountNode.seeds.map((seed) => {
    if (isConstantPdaSeedNode(seed)) {
      const seedManifest = visit(seed.type, typeManifestVisitor);
      imports.mergeWith(seedManifest.encoder);
      const seedValue = seed.value;
      const valueManifest = getValueNodeFragment(seedValue, nameApi);
      (seedValue as any).render = valueManifest.render;
      imports.mergeWith(valueManifest.imports);
      return { ...seed, typeManifest: seedManifest };
    }
    if (isVariablePdaSeedNode(seed)) {
      const seedManifest = visit(seed.type, typeManifestVisitor);
      imports.mergeWith(seedManifest.looseType, seedManifest.encoder);
      return { ...seed, typeManifest: seedManifest };
    }
    imports.add('solanaAddresses', 'getAddressEncoder');
    return seed;
  });
  const hasVariableSeeds =
    accountNode.seeds.filter(isVariablePdaSeedNode).length > 0;

  return fragmentFromTemplate('accountPdaHelpers.njk', {
    accountType: nameApi.accountType(accountNode.name),
    fetchFunction: nameApi.accountFetchFunction(accountNode.name),
    safeFetchFunction: nameApi.accountSafeFetchFunction(accountNode.name),
    accountSeedsType: nameApi.accountSeedsType(accountNode.name),
    findPdaFunction: nameApi.accountFindPdaFunction(accountNode.name),
    fetchFromSeedsFunction: nameApi.accountFetchFromSeedsFunction(
      accountNode.name
    ),
    safeFetchFromSeedsFunction: nameApi.accountSafeFetchFromSeedsFunction(
      accountNode.name
    ),
    program: programNode,
    seeds,
    hasVariableSeeds,
  })
    .mergeImportsWith(imports)
    .addImports('solanaAddresses', [
      'Address',
      'getProgramDerivedAddress',
      'ProgramDerivedAddress',
    ])
    .addImports('solanaAccounts', ['FetchAccountConfig']);
}
