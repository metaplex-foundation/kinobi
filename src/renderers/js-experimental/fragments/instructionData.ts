import * as nodes from '../../../nodes';
import { Visitor, visit } from '../../../visitors';
import { TypeManifest } from '../TypeManifest';
import { Fragment, fragment } from './common';
import { getTypeWithCodecFragment } from './typeWithCodec';

export function getInstructionDataFragment(
  instructionNode: nodes.InstructionNode,
  typeManifestVisitor: Visitor<TypeManifest>
): Fragment {
  if (
    instructionNode.dataArgs.struct.fields.length === 0 ||
    !!instructionNode.dataArgs.link
  ) {
    return fragment('');
  }

  const manifest = visit(instructionNode.dataArgs, typeManifestVisitor);
  return getTypeWithCodecFragment(instructionNode.dataArgs.name, manifest);
}
