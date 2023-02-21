import { IdlType, IDL_TYPE_LEAVES } from '../idl';
import type { Node } from './Node';
import { TypeArrayNode } from './TypeArrayNode';
import { TypeBoolNode } from './TypeBoolNode';
import { TypeBytesNode } from './TypeBytesNode';
import { TypeDefinedLinkNode } from './TypeDefinedLinkNode';
import { TypeEnumNode } from './TypeEnumNode';
import { TypeMapNode } from './TypeMapNode';
import { TypeNumberNode } from './TypeNumberNode';
import { TypeNumberWrapperNode } from './TypeNumberWrapperNode';
import { TypeOptionNode } from './TypeOptionNode';
import { TypePublicKeyNode } from './TypePublicKeyNode';
import { TypeSetNode } from './TypeSetNode';
import { TypeStringNode } from './TypeStringNode';
import { TypeStructNode } from './TypeStructNode';
import { TypeTupleNode } from './TypeTupleNode';

export type TypeNode =
  | TypeArrayNode
  | TypeBoolNode
  | TypeBytesNode
  | TypeDefinedLinkNode
  | TypeEnumNode
  | TypeMapNode
  | TypeNumberNode
  | TypeNumberWrapperNode
  | TypeOptionNode
  | TypePublicKeyNode
  | TypeSetNode
  | TypeStringNode
  | TypeStructNode
  | TypeTupleNode;

const TYPE_NODE_CLASSES = [
  'TypeArrayNode',
  'TypeBoolNode',
  'TypeBytesNode',
  'TypeDefinedLinkNode',
  'TypeEnumNode',
  'TypeMapNode',
  'TypeNumberNode',
  'TypeNumberWrapperNode',
  'TypeOptionNode',
  'TypePublicKeyNode',
  'TypeSetNode',
  'TypeStringNode',
  'TypeStructNode',
  'TypeTupleNode',
];

function isArrayOfSize(array: any, size: number): boolean {
  return Array.isArray(array) && array.length === size;
}

export const createTypeNodeFromIdl = (idlType: IdlType): TypeNode => {
  // Leaf.
  if (typeof idlType === 'string' && IDL_TYPE_LEAVES.includes(idlType)) {
    if (idlType === 'bool') return new TypeBoolNode();
    if (idlType === 'string') return new TypeStringNode();
    if (idlType === 'publicKey') return new TypePublicKeyNode();
    if (idlType === 'bytes') return new TypeBytesNode();
    return new TypeNumberNode(idlType);
  }

  // Ensure eveything else is an object.
  if (typeof idlType !== 'object') {
    throw new Error(`TypeNode: Unsupported type ${JSON.stringify(idlType)}`);
  }

  // Array.
  if ('array' in idlType && isArrayOfSize(idlType.array, 2)) {
    return TypeArrayNode.fromIdl(idlType);
  }

  // Vec.
  if ('vec' in idlType) {
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

export function isTypeStructOrDefinedLinkNode(
  node: Node | null
): node is TypeStructNode | TypeDefinedLinkNode {
  return (
    !!node &&
    (node.nodeClass === 'TypeStructNode' ||
      node.nodeClass === 'TypeDefinedLinkNode')
  );
}

export function assertTypeStructOrDefinedLinkNode(
  node: Node | null
): asserts node is TypeStructNode | TypeDefinedLinkNode {
  if (!isTypeStructOrDefinedLinkNode(node)) {
    throw new Error(
      `Expected TypeStructNode | TypeDefinedLinkNode, got ${
        node?.nodeClass ?? 'null'
      }.`
    );
  }
}
