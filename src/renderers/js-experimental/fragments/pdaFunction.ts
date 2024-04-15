import { PdaNode, ProgramNode, isNode, isNodeFilter } from '../../../nodes';
import { visit } from '../../../visitors';
import { ImportMap } from '../ImportMap';
import type { GlobalFragmentScope } from '../getRenderMapVisitor';
import { Fragment, fragmentFromTemplate } from './common';

export function getPdaFunctionFragment(
  scope: Pick<GlobalFragmentScope, 'nameApi' | 'typeManifestVisitor'> & {
    pdaNode: PdaNode;
    programNode: ProgramNode;
  }
): Fragment {
  const { pdaNode, programNode, typeManifestVisitor, nameApi } = scope;

  // Seeds.
  const imports = new ImportMap();
  const seeds = pdaNode.seeds.map((seed) => {
    if (isNode(seed, 'variablePdaSeedNode')) {
      const seedManifest = visit(seed.type, typeManifestVisitor);
      imports.mergeWith(seedManifest.looseType, seedManifest.encoder);
      return { ...seed, typeManifest: seedManifest };
    }
    if (isNode(seed.value, 'programIdValueNode')) {
      imports.add('solanaAddresses', 'getAddressEncoder');
      return seed;
    }
    const seedManifest = visit(seed.type, typeManifestVisitor);
    imports.mergeWith(seedManifest.encoder);
    const seedValue = seed.value;
    const valueManifest = visit(seedValue, typeManifestVisitor).value;
    (seedValue as any).render = valueManifest.render;
    imports.mergeWith(valueManifest.imports);
    return { ...seed, typeManifest: seedManifest };
  });
  const hasVariableSeeds =
    pdaNode.seeds.filter(isNodeFilter('variablePdaSeedNode')).length > 0;

  return fragmentFromTemplate('pdaFunction.njk', {
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
