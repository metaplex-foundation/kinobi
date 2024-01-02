import { PdaNode, ProgramNode, isNode, isNodeFilter } from '../../../nodes';
import { visit } from '../../../visitors';
import { ImportMap } from '../ImportMap';
import type { GlobalFragmentScope } from '../getRenderMapVisitor';
import { Fragment, fragment, fragmentFromTemplate } from './common';

export function getPdaFunctionFragment(
  scope: Pick<
    GlobalFragmentScope,
    'nameApi' | 'typeManifestVisitor' | 'valueNodeVisitor'
  > & {
    pdaNode: PdaNode;
    programNode: ProgramNode;
  }
): Fragment {
  const {
    pdaNode,
    programNode,
    typeManifestVisitor,
    valueNodeVisitor,
    nameApi,
  } = scope;
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
      const valueManifest = visit(seedValue, valueNodeVisitor);
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

  return fragmentFromTemplate('pdaFunction.njk', {
    accountType: nameApi.accountType(pdaNode.name),
    pdaSeedsType: nameApi.pdaSeedsType(pdaNode.name),
    findPdaFunction: nameApi.pdaFindFunction(pdaNode.name),
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
