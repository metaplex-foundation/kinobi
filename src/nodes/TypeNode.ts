import type { IdlType } from '../idl';
import { TypeDefinedLinkNode } from './TypeDefinedLinkNode';
import { TypeLeafNode } from './TypeLeafNode';
import { TypeStructNode } from './TypeStructNode';

export type TypeNode = TypeDefinedLinkNode | TypeLeafNode | TypeStructNode;

export const createTypeNodeFromIdl = (idlType: IdlType): TypeNode => {
  // Handle leaf types such as 'u8', 'u64', 'publicKey', etc.
  if (typeof idlType === 'string') {
    return new TypeLeafNode(idlType);
  }

  // Ensure eveything else is an object.
  if (typeof idlType !== 'object') {
    throw new Error(`TypeNode: Unsupported type ${JSON.stringify(idlType)}`);
  }

  // Handle links to defined types.
  if ('defined' in idlType && typeof idlType.defined === 'string') {
    return new TypeDefinedLinkNode(idlType.defined);
  }

  // Handle struct types with fields.
  if ('kind' in idlType && idlType.kind === 'struct') {
    return TypeStructNode.fromIdl(idlType);
  }

  // Throw an error for unsupported types.
  throw new Error(`TypeNode: Unsupported type ${JSON.stringify(idlType)}`);
};
