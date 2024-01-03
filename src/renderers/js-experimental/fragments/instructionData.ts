import { InstructionNode } from '../../../nodes';
import { TypeManifest } from '../TypeManifest';
import type { GlobalFragmentScope } from '../getRenderMapVisitor';
import { Fragment, fragment } from './common';
import { getTypeWithCodecFragment } from './typeWithCodec';

export function getInstructionDataFragment(
  scope: Pick<GlobalFragmentScope, 'nameApi' | 'customInstructionData'> & {
    instructionNode: InstructionNode;
    dataArgsManifest: TypeManifest;
  }
): Fragment {
  const { instructionNode, dataArgsManifest, nameApi, customInstructionData } =
    scope;
  if (
    instructionNode.arguments.length === 0 ||
    customInstructionData.has(instructionNode.name)
  ) {
    return fragment('');
  }

  const instructionDataName = nameApi.instructionDataType(instructionNode.name);
  return getTypeWithCodecFragment({
    name: instructionDataName,
    manifest: dataArgsManifest,
    nameApi,
  });
}
