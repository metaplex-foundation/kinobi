import * as nodes from '../../../nodes';
import { pascalCase } from '../../../shared';
import { Visitor, visit } from '../../../visitors';
import { ImportMap } from '../ImportMap';
import { TypeManifest } from '../TypeManifest';
import { Fragment, fragment, fragmentFromTemplate } from './common';
import { getValueNodeFragment } from './valueNode';

export function getAccountPdaHelpersFragment(
  accountNode: nodes.AccountNode,
  typeManifestVisitor: Visitor<TypeManifest>
): Fragment {
  if (accountNode.seeds.length === 0) {
    return fragment('');
  }

  // Seeds.
  const imports = new ImportMap();
  const seeds = accountNode.seeds.map((seed) => {
    if (seed.kind === 'constant') {
      const seedManifest = visit(seed.type, typeManifestVisitor);
      imports.mergeWith(seedManifest.encoder);
      const seedValue = seed.value;
      const valueManifest = getValueNodeFragment(seedValue);
      (seedValue as any).render = valueManifest.render;
      imports.mergeWith(valueManifest.imports);
      return { ...seed, typeManifest: seedManifest };
    }
    if (seed.kind === 'variable') {
      const seedManifest = visit(seed.type, typeManifestVisitor);
      imports.mergeWith(seedManifest.looseType, seedManifest.encoder);
      return { ...seed, typeManifest: seedManifest };
    }
    imports.add('solanaAddresses', 'getAddressEncoder');
    return seed;
  });
  const hasVariableSeeds =
    accountNode.seeds.filter((seed) => seed.kind === 'variable').length > 0;

  return fragmentFromTemplate('accountPdaHelpers.njk', {
    pascalCaseName: pascalCase(accountNode.name),
    seeds,
    hasVariableSeeds,
  })
    .mergeImportsWith(imports)
    .addImports('solanaAddresses', ['ProgramDerivedAddress'])
    .addImports('some-magical-place', ['Context', 'RpcGetAccountOptions']);
}
