import {
  PdaNode,
  ProgramNode,
  RegisteredTypeNodes,
  isNode,
  isNodeFilter,
} from '../../../nodes';
import { Visitor, visit } from '../../../visitors';
import { ImportMap } from '../ImportMap';
import { TypeManifest } from '../TypeManifest';
import { NameApi } from '../nameTransformers';
import { Fragment, fragment, fragmentFromTemplate } from './common';
import { getValueNodeFragment } from './valueNode';

export function getPdaFunctionFragment(scope: {
  pdaNode: PdaNode;
  programNode: ProgramNode;
  typeManifestVisitor: Visitor<
    TypeManifest,
    keyof RegisteredTypeNodes | 'definedTypeLinkNode'
  >;
  nameApi: NameApi;
}): Fragment {
  const { pdaNode, programNode, typeManifestVisitor, nameApi } = scope;
  if (pdaNode.seeds.length === 0) {
    return fragment('');
  }

  // Seeds.
  const imports = new ImportMap();
  const seeds = pdaNode.seeds.map((seed) => {
    if (isNode(seed, 'constantPdaSeedNode')) {
      const seedManifest = visit(seed.type, typeManifestVisitor);
      imports.mergeWith(seedManifest.encoder);
      const seedValue = seed.value;
      const valueManifest = getValueNodeFragment(seedValue, nameApi);
      (seedValue as any).render = valueManifest.render;
      imports.mergeWith(valueManifest.imports);
      return { ...seed, typeManifest: seedManifest };
    }
    if (isNode(seed, 'variablePdaSeedNode')) {
      const seedManifest = visit(seed.type, typeManifestVisitor);
      imports.mergeWith(seedManifest.looseType, seedManifest.encoder);
      return { ...seed, typeManifest: seedManifest };
    }
    imports.add('solanaAddresses', 'getAddressEncoder');
    return seed;
  });
  const hasVariableSeeds =
    pdaNode.seeds.filter(isNodeFilter('variablePdaSeedNode')).length > 0;

  return fragmentFromTemplate('accountPdaHelpers.njk', {
    accountType: nameApi.accountType(pdaNode.name),
    accountSeedsType: nameApi.accountSeedsType(pdaNode.name),
    findPdaFunction: nameApi.accountFindPdaFunction(pdaNode.name),
    program: programNode,
    seeds,
    hasVariableSeeds,
  })
    .mergeImportsWith(imports)
    .addImports('solanaAddresses', [
      'Address',
      'getProgramDerivedAddress',
      'ProgramDerivedAddress',
    ]);
}
