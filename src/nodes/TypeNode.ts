import type { IdlType } from '../idl';
import { TypeArrayNode } from './TypeArrayNode';
import { TypeDefinedLinkNode } from './TypeDefinedLinkNode';
import { TypeEnumNode } from './TypeEnumNode';
import { TypeLeafNode } from './TypeLeafNode';
import { TypeMapNode } from './TypeMapNode';
import { TypeOptionNode } from './TypeOptionNode';
import { TypeSetNode } from './TypeSetNode';
import { TypeStructNode } from './TypeStructNode';
import { TypeTupleNode } from './TypeTupleNode';
import { TypeVecNode } from './TypeVecNode';

export type TypeNode =
  | TypeArrayNode
  | TypeDefinedLinkNode
  | TypeEnumNode
  | TypeLeafNode
  | TypeMapNode
  | TypeOptionNode
  | TypeSetNode
  | TypeStructNode
  | TypeTupleNode
  | TypeVecNode;

export const createTypeNodeFromIdl = (idlType: IdlType): TypeNode => {
  // Leaf.
  if (typeof idlType === 'string' && TypeLeafNode.isValidType(idlType)) {
    return new TypeLeafNode(idlType);
  }

  // Ensure eveything else is an object.
  if (typeof idlType !== 'object') {
    throw new Error(`TypeNode: Unsupported type ${JSON.stringify(idlType)}`);
  }

  // Array.
  if (
    'array' in idlType &&
    Array.isArray(idlType.array) &&
    idlType.array.length === 2
  ) {
    return TypeArrayNode.fromIdl(idlType);
  }

  // Defined link.
  if ('defined' in idlType && typeof idlType.defined === 'string') {
    return new TypeDefinedLinkNode(idlType.defined);
  }

  // TODO: Enum.
  // TODO: Map.
  // TODO: Option.
  // TODO: Set.

  // Struct.
  if ('kind' in idlType && idlType.kind === 'struct') {
    return TypeStructNode.fromIdl(idlType);
  }

  // TODO: Tuple.
  // TODO: Vec.

  // Throw an error for unsupported types.
  throw new Error(`TypeNode: Unsupported type ${JSON.stringify(idlType)}`);
};
