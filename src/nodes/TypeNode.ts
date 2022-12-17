import type { IdlType } from 'src/idl';
import { TypeLeafNode } from './TypeLeafNode';
import { TypeStructNode } from './TypeStructNode';

export type TypeNode = TypeLeafNode | TypeStructNode;

export const createTypeNodeFromIdl = (idlType: IdlType): TypeNode => {
  // Handle leaf types such as 'u8', 'u64', 'publicKey', etc.
  if (typeof idlType === 'string') {
    return new TypeLeafNode(idlType);
  }

  // Ensure eveything else is an object.
  if (typeof idlType !== 'object') {
    throw new Error(`TypeNode: Unsupported type ${JSON.stringify(idlType)}`);
  }

  // Handle struct types with fields.
  if ('kind' in idlType && idlType.kind === 'struct') {
    const fields = idlType.fields.map((field) => ({
      name: field.name ?? '',
      type: createTypeNodeFromIdl(field.type),
      docs: field.docs ?? [],
    }));

    return new TypeStructNode(fields);
  }

  // Throw an error for unsupported types.
  throw new Error(`TypeNode: Unsupported type ${JSON.stringify(idlType)}`);
};
