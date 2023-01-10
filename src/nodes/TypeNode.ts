import type { IdlType } from '../idl';
import type { Node } from './Node';
import { TypeArrayNode } from './TypeArrayNode';
import { TypeDefinedLinkNode } from './TypeDefinedLinkNode';
import { TypeEnumNode } from './TypeEnumNode';
import { TypeLeafNode } from './TypeLeafNode';
import { TypeLeafWrapperNode } from './TypeLeafWrapperNode';
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
  | TypeLeafWrapperNode
  | TypeMapNode
  | TypeOptionNode
  | TypeSetNode
  | TypeStructNode
  | TypeTupleNode
  | TypeVecNode;

const TYPE_NODE_CLASSES = [
  'TypeArrayNode',
  'TypeDefinedLinkNode',
  'TypeEnumNode',
  'TypeLeafNode',
  'TypeLeafWrapperNode',
  'TypeMapNode',
  'TypeOptionNode',
  'TypeSetNode',
  'TypeStructNode',
  'TypeTupleNode',
  'TypeVecNode',
];

function isArrayOfSize(array: any, size: number): boolean {
  return Array.isArray(array) && array.length === size;
}

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
  if ('array' in idlType && isArrayOfSize(idlType.array, 2)) {
    return TypeArrayNode.fromIdl(idlType);
  }

  // Defined link.
  if ('defined' in idlType && typeof idlType.defined === 'string') {
    return new TypeDefinedLinkNode(idlType.defined);
  }

  // Enum.
  if ('kind' in idlType && idlType.kind === 'enum' && 'variants' in idlType) {
    return TypeEnumNode.fromIdl(idlType);
  }

  // Map.
  if (
    ('hashMap' in idlType && isArrayOfSize(idlType.hashMap, 2)) ||
    ('bTreeMap' in idlType && isArrayOfSize(idlType.bTreeMap, 2))
  ) {
    return TypeMapNode.fromIdl(idlType);
  }

  // Option.
  if ('option' in idlType || 'coption' in idlType) {
    return TypeOptionNode.fromIdl(idlType);
  }

  // Set.
  if ('hashSet' in idlType || 'bTreeSet' in idlType) {
    return TypeSetNode.fromIdl(idlType);
  }

  // Struct.
  if ('kind' in idlType && idlType.kind === 'struct') {
    return TypeStructNode.fromIdl(idlType);
  }

  // Tuple.
  if ('tuple' in idlType && Array.isArray(idlType.tuple)) {
    return TypeTupleNode.fromIdl(idlType);
  }

  // Vec.
  if ('vec' in idlType) {
    return TypeVecNode.fromIdl(idlType);
  }

  // Throw an error for unsupported types.
  throw new Error(`TypeNode: Unsupported type ${JSON.stringify(idlType)}`);
};

export function isTypeNode(node: Node | null): node is TypeNode {
  return !!node && TYPE_NODE_CLASSES.includes(node.nodeClass);
}

export function assertTypeNode(node: Node | null): asserts node is TypeNode {
  if (!isTypeNode(node)) {
    throw new Error(`Expected TypeNode, got ${node?.nodeClass ?? 'null'}.`);
  }
}

export function isTypeStructOrEnumNode(
  node: Node | null
): node is TypeStructNode | TypeEnumNode {
  return (
    !!node &&
    (node.nodeClass === 'TypeStructNode' || node.nodeClass === 'TypeEnumNode')
  );
}

export function assertTypeStructOrEnumNode(
  node: Node | null
): asserts node is TypeStructNode | TypeEnumNode {
  if (!isTypeStructOrEnumNode(node)) {
    throw new Error(
      `Expected TypeStructNode | TypeEnumNode, got ${
        node?.nodeClass ?? 'null'
      }.`
    );
  }
}
