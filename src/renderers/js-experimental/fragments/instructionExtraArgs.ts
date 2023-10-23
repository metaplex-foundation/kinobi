import * as nodes from '../../../nodes';
import { pascalCase } from '../../../shared';
import { TypeManifest } from '../TypeManifest';
import { Fragment, fragment, fragmentFromTemplate } from './common';

export function getInstructionExtraArgsFragment(
  instructionNode: nodes.InstructionNode,
  extraArgsManifest: TypeManifest
): Fragment {
  if (
    instructionNode.extraArgs.struct.fields.length === 0 ||
    !!instructionNode.extraArgs.link
  ) {
    return fragment('');
  }

  const strictName = pascalCase(instructionNode.extraArgs.name);
  const looseName = `${strictName}Args`;
  return fragmentFromTemplate('instructionExtraArgs.njk', {
    looseName,
    manifest: extraArgsManifest,
  }).mergeImportsWith(extraArgsManifest.looseType);
}
