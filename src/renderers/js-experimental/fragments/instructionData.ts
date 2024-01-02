import { InstructionNode } from '../../../nodes';
import { TypeManifest } from '../TypeManifest';
import type { GlobalFragmentScope } from '../getRenderMapVisitor';
import { Fragment, fragment } from './common';
import { getTypeWithCodecFragment } from './typeWithCodec';

export function getInstructionDataFragment(
  scope: Pick<GlobalFragmentScope, 'nameApi'> & {
    instructionNode: InstructionNode;
    dataArgsManifest: TypeManifest;
  }
): Fragment {
  const { instructionNode, dataArgsManifest, nameApi } = scope;
  if (
    instructionNode.dataArgs.struct.fields.length === 0 ||
    !!instructionNode.dataArgs.link
  ) {
    return fragment('');
  }

  return getTypeWithCodecFragment({
    name: instructionNode.dataArgs.name,
    manifest: dataArgsManifest,
    nameApi,
  });
}
