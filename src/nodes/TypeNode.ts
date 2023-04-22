import { IDL_TYPE_LEAVES, IdlType } from '../idl';
import { ArrayTypeNode, arrayTypeNodeFromIdl } from './ArrayTypeNode';
import { BoolTypeNode, boolTypeNode } from './BoolTypeNode';
import { BytesTypeNode, bytesTypeNode } from './BytesTypeNode';
import { EnumTypeNode, enumTypeNodeFromIdl } from './EnumTypeNode';
import { LinkTypeNode, linkTypeNode } from './LinkTypeNode';
import { MapTypeNode, mapTypeNodeFromIdl } from './MapTypeNode';
import type { Node } from './Node';
import { NumberTypeNode, numberTypeNode } from './NumberTypeNode';
import { NumberWrapperTypeNode } from './NumberWrapperTypeNode';
import { OptionTypeNode, optionTypeNodeFromIdl } from './OptionTypeNode';
import { PublicKeyTypeNode, publicKeyTypeNode } from './PublicKeyTypeNode';
import { SetTypeNode, setTypeNodeFromIdl } from './SetTypeNode';
import { StringTypeNode, stringTypeNode } from './StringTypeNode';
import { StructTypeNode, structTypeNodeFromIdl } from './StructTypeNode';
import { TupleTypeNode, tupleTypeNodeFromIdl } from './TupleTypeNode';

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
    if (idlType === 'bool') return boolTypeNode();
    if (idlType === 'string') return stringTypeNode();
    if (idlType === 'publicKey') return publicKeyTypeNode();
    if (idlType === 'bytes') return bytesTypeNode();
    return numberTypeNode(idlType);
  }

  // Ensure eveything else is an object.
  if (typeof idlType !== 'object') {
    throw new Error(`TypeNode: Unsupported type ${JSON.stringify(idlType)}`);
  }

  // Array.
  if ('array' in idlType && isArrayOfSize(idlType.array, 2)) {
    return arrayTypeNodeFromIdl(idlType);
  }

  // Vec.
  if ('vec' in idlType) {
    return arrayTypeNodeFromIdl(idlType);
  }

  // Defined link.
  if ('defined' in idlType && typeof idlType.defined === 'string') {
    return linkTypeNode(idlType.defined);
  }

  // Enum.
  if ('kind' in idlType && idlType.kind === 'enum' && 'variants' in idlType) {
    return enumTypeNodeFromIdl(idlType);
  }

  // Map.
  if (
    ('hashMap' in idlType && isArrayOfSize(idlType.hashMap, 2)) ||
    ('bTreeMap' in idlType && isArrayOfSize(idlType.bTreeMap, 2))
  ) {
    return mapTypeNodeFromIdl(idlType);
  }

  // Option.
  if ('option' in idlType || 'coption' in idlType) {
    return optionTypeNodeFromIdl(idlType);
  }

  // Set.
  if ('hashSet' in idlType || 'bTreeSet' in idlType) {
    return setTypeNodeFromIdl(idlType);
  }

  // Struct.
  if ('kind' in idlType && idlType.kind === 'struct') {
    return structTypeNodeFromIdl(idlType);
  }

  // Tuple.
  if ('tuple' in idlType && Array.isArray(idlType.tuple)) {
    return tupleTypeNodeFromIdl(idlType);
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
    (node.nodeClass === 'structTypeNode' || node.nodeClass === 'linkTypeNode')
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
