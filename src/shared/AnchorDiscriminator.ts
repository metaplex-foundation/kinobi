import { sha256 } from '@noble/hashes/sha256';
import { pascalCase, snakeCase } from './utils';
import { ArrayValueNode, arrayValueNode, numberValueNode } from '../nodes';

export type AnchorDiscriminator = ArrayValueNode;

export const getAnchorInstructionDiscriminator = (
  idlName: string
): AnchorDiscriminator => {
  const hash = sha256(`global:${snakeCase(idlName)}`).slice(0, 8);
  return arrayValueNode([...hash].map((byte) => numberValueNode(byte)));
};

export const getAnchorAccountDiscriminator = (
  idlName: string
): AnchorDiscriminator => {
  const hash = sha256(`account:${pascalCase(idlName)}`).slice(0, 8);
  return arrayValueNode([...hash].map((byte) => numberValueNode(byte)));
};
