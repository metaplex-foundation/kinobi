import type { IdlType } from 'src/idl';
import { TypeLeafNode } from './TypeLeafNode';

export type TypeNode = TypeLeafNode;

export const createTypeNodeFromIdl = (idlType: IdlType): TypeNode => {
  if (typeof idlType === 'string') {
    return new TypeLeafNode(idlType);
  }

  throw new Error(`TypeNode: Unsupported type ${JSON.stringify(idlType)}`);
};
