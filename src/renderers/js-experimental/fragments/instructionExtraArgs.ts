import * as nodes from '../../../nodes';
import { TypeManifest } from '../TypeManifest';
import { NameApi } from '../nameTransformers';
import { Fragment, fragment, fragmentFromTemplate } from './common';

export function getInstructionExtraArgsFragment(scope: {
  instructionNode: nodes.InstructionNode;
  extraArgsManifest: TypeManifest;
  nameApi: NameApi;
}): Fragment {
  const { instructionNode, extraArgsManifest, nameApi } = scope;
  if (
    instructionNode.extraArgs.struct.fields.length === 0 ||
    !!instructionNode.extraArgs.link
  ) {
    return fragment('');
  }

  return fragmentFromTemplate('instructionExtraArgs.njk', {
    strictName: nameApi.dataType(instructionNode.extraArgs.name),
    looseName: nameApi.dataArgsType(instructionNode.extraArgs.name),
    manifest: extraArgsManifest,
  }).mergeImportsWith(extraArgsManifest.looseType);
}
