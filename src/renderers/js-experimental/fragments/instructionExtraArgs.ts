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
  if (instructionNode.extraArgs.extraArguments.length === 0) {
    return fragment('');
  }

  return fragmentFromTemplate('instructionExtraArgs.njk', {
    strictName: nameApi.dataType(instructionNode.extraArgs.name),
    looseName: nameApi.dataArgsType(instructionNode.extraArgs.name),
    manifest: extraArgsManifest,
  }).mergeImportsWith(extraArgsManifest.looseType);
}
