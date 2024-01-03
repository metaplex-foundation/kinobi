import { sha256 } from '@noble/hashes/sha256';
import { ArrayValueNode, arrayValueNode, numberValueNode } from '../nodes';
import { pascalCase, snakeCase } from './utils';

export const getAnchorInstructionDiscriminator = (
  idlName: string
): ArrayValueNode => {
  const hash = sha256(`global:${snakeCase(idlName)}`).slice(0, 8);
  return arrayValueNode([...hash].map((byte) => numberValueNode(byte)));
};

export const getAnchorAccountDiscriminator = (
  idlName: string
): ArrayValueNode => {
  const hash = sha256(`account:${pascalCase(idlName)}`).slice(0, 8);
  return arrayValueNode([...hash].map((byte) => numberValueNode(byte)));
};
