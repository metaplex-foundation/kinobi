import * as nodes from '../../../nodes';
import { TypeManifest } from '../TypeManifest';
import { Fragment, fragment } from './common';
import { getTypeWithCodecFragment } from './typeWithCodec';

export function getInstructionDataFragment(scope: {
  instructionNode: nodes.InstructionNode;
  dataArgsManifest: TypeManifest;
}): Fragment {
  const { instructionNode, dataArgsManifest } = scope;
  if (
    instructionNode.dataArgs.struct.fields.length === 0 ||
    !!instructionNode.dataArgs.link
  ) {
    return fragment('');
  }

  return getTypeWithCodecFragment(
    instructionNode.dataArgs.name,
    dataArgsManifest
  );
}
