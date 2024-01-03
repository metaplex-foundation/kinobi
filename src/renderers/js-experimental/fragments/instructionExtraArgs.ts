import { InstructionNode } from '../../../nodes';
import { TypeManifest } from '../TypeManifest';
import { GlobalFragmentScope } from '../getRenderMapVisitor';
import { Fragment, fragment, fragmentFromTemplate } from './common';

export function getInstructionExtraArgsFragment(
  scope: Pick<GlobalFragmentScope, 'nameApi'> & {
    instructionNode: InstructionNode;
    extraArgsManifest: TypeManifest;
  }
): Fragment {
  const { instructionNode, extraArgsManifest, nameApi } = scope;
  if ((instructionNode.extraArguments ?? []).length === 0) {
    return fragment('');
  }

  const instructionExtraName = nameApi.instructionExtraType(
    instructionNode.name
  );
  return fragmentFromTemplate('instructionExtraArgs.njk', {
    strictName: nameApi.dataType(instructionExtraName),
    looseName: nameApi.dataArgsType(instructionExtraName),
    manifest: extraArgsManifest,
  }).mergeImportsWith(extraArgsManifest.looseType);
}
