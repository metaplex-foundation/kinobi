import { IdlType, IDL_TYPE_LEAVES } from '../idl';
import type { Node } from './Node';
import { ArrayTypeNode } from './ArrayTypeNode';
import { BoolTypeNode } from './BoolTypeNode';
import { BytesTypeNode } from './BytesTypeNode';
import { LinkTypeNode } from './LinkTypeNode';
import { EnumTypeNode } from './EnumTypeNode';
import { MapTypeNode } from './MapTypeNode';
import { NumberTypeNode } from './NumberTypeNode';
import { NumberWrapperTypeNode } from './NumberWrapperTypeNode';
import { OptionTypeNode } from './OptionTypeNode';
import { PublicKeyTypeNode } from './PublicKeyTypeNode';
import { SetTypeNode } from './SetTypeNode';
import { StringTypeNode } from './StringTypeNode';
import { StructTypeNode } from './StructTypeNode';
import { TupleTypeNode } from './TupleTypeNode';

export type TypeNode =
  | ArrayTypeNode
  | BoolTypeNode
  | BytesTypeNode
  | LinkTypeNode
  | EnumTypeNode
  | MapTypeNode
  | NumberTypeNode
  | NumberWrapperTypeNode
  | OptionTypeNode
  | PublicKeyTypeNode
  | SetTypeNode
  | StringTypeNode
  | StructTypeNode
  | TupleTypeNode;

const TYPE_NODE_CLASSES = [
  'ArrayTypeNode',
  'BoolTypeNode',
  'BytesTypeNode',
  'LinkTypeNode',
  'EnumTypeNode',
  'MapTypeNode',
  'NumberTypeNode',
  'NumberWrapperTypeNode',
  'OptionTypeNode',
  'PublicKeyTypeNode',
  'SetTypeNode',
  'StringTypeNode',
  'StructTypeNode',
  'TupleTypeNode',
];

function isArrayOfSize(array: any, size: number): boolean {
  return Array.isArray(array) && array.length === size;
}

export const createTypeNodeFromIdl = (idlType: IdlType): TypeNode => {
  // Leaf.
  if (typeof idlType === 'string' && IDL_TYPE_LEAVES.includes(idlType)) {
    if (idlType === 'bool') return new BoolTypeNode();
    if (idlType === 'string') return new StringTypeNode();
    if (idlType === 'publicKey') return new PublicKeyTypeNode();
    if (idlType === 'bytes') return new BytesTypeNode();
    return new NumberTypeNode(idlType);
  }

  // Ensure eveything else is an object.
  if (typeof idlType !== 'object') {
    throw new Error(`TypeNode: Unsupported type ${JSON.stringify(idlType)}`);
  }

  // Array.
  if ('array' in idlType && isArrayOfSize(idlType.array, 2)) {
    return ArrayTypeNode.fromIdl(idlType);
  }

  // Vec.
  if ('vec' in idlType) {
    return ArrayTypeNode.fromIdl(idlType);
  }

  // Defined link.
  if ('defined' in idlType && typeof idlType.defined === 'string') {
    return new LinkTypeNode(idlType.defined);
  }

  // Enum.
  if ('kind' in idlType && idlType.kind === 'enum' && 'variants' in idlType) {
    return EnumTypeNode.fromIdl(idlType);
  }

  // Map.
  if (
    ('hashMap' in idlType && isArrayOfSize(idlType.hashMap, 2)) ||
    ('bTreeMap' in idlType && isArrayOfSize(idlType.bTreeMap, 2))
  ) {
    return MapTypeNode.fromIdl(idlType);
  }

  // Option.
  if ('option' in idlType || 'coption' in idlType) {
    return OptionTypeNode.fromIdl(idlType);
  }

  // Set.
  if ('hashSet' in idlType || 'bTreeSet' in idlType) {
    return SetTypeNode.fromIdl(idlType);
  }

  // Struct.
  if ('kind' in idlType && idlType.kind === 'struct') {
    return StructTypeNode.fromIdl(idlType);
  }

  // Tuple.
  if ('tuple' in idlType && Array.isArray(idlType.tuple)) {
    return TupleTypeNode.fromIdl(idlType);
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

export function isStructOrLinkTypeNode(
  node: Node | null
): node is StructTypeNode | LinkTypeNode {
  return (
    !!node &&
    (node.nodeClass === 'StructTypeNode' || node.nodeClass === 'LinkTypeNode')
  );
}

export function assertStructOrLinkTypeNode(
  node: Node | null
): asserts node is StructTypeNode | LinkTypeNode {
  if (!isStructOrLinkTypeNode(node)) {
    throw new Error(
      `Expected StructTypeNode | LinkTypeNode, got ${
        node?.nodeClass ?? 'null'
      }.`
    );
  }
}
