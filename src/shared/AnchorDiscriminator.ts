import { sha256 } from '@noble/hashes/sha256';
import { ListValueNode, vList, vScalar } from '../nodes/ValueNode';
import { pascalCase, snakeCase } from './utils';

export type AnchorDiscriminator = ListValueNode;

export const getAnchorInstructionDiscriminator = (
  idlName: string
): AnchorDiscriminator => {
  const hash = sha256(`global:${snakeCase(idlName)}`).slice(0, 8);
  return vList([...hash].map((byte) => vScalar(byte)));
};

export const getAnchorAccountDiscriminator = (
  idlName: string
): AnchorDiscriminator => {
  const hash = sha256(`account:${pascalCase(idlName)}`).slice(0, 8);
  return vList([...hash].map((byte) => vScalar(byte)));
};
