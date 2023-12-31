import { IDL_TYPE_LEAVES, IdlType } from '../../idl';
import { ArrayTypeNode, arrayTypeNodeFromIdl } from './ArrayTypeNode';
import { BooleanTypeNode, booleanTypeNode } from './BooleanTypeNode';
import { BytesTypeNode, bytesTypeNode } from './BytesTypeNode';
import { EnumTypeNode, enumTypeNodeFromIdl } from './EnumTypeNode';
import { LinkTypeNode, linkTypeNode } from './LinkTypeNode';
import { MapTypeNode, mapTypeNodeFromIdl } from './MapTypeNode';
import type { Node } from '../Node';
import { NumberTypeNode, numberTypeNode } from './NumberTypeNode';
import { OptionTypeNode, optionTypeNodeFromIdl } from './OptionTypeNode';
import { PublicKeyTypeNode, publicKeyTypeNode } from './PublicKeyTypeNode';
import { SetTypeNode, setTypeNodeFromIdl } from './SetTypeNode';
import { StringTypeNode, stringTypeNode } from './StringTypeNode';
import { StructTypeNode, structTypeNodeFromIdl } from './StructTypeNode';
import { TupleTypeNode, tupleTypeNodeFromIdl } from './TupleTypeNode';
import { DateTimeTypeNode } from './DateTimeTypeNode';
import { SolAmountTypeNode } from './SolAmountTypeNode';
import { AmountTypeNode } from './AmountTypeNode';
import { StructFieldTypeNode } from './StructFieldTypeNode';
import { EnumEmptyVariantTypeNode } from './EnumEmptyVariantTypeNode';
import { EnumStructVariantTypeNode } from './EnumStructVariantTypeNode';
import { EnumTupleVariantTypeNode } from './EnumTupleVariantTypeNode';
import { prefixedSizeNode } from '../sizeNodes';

// Type Node Registration.
// This only includes type nodes that can be used as standalone types.
// E.g. this excludes structFieldTypeNode, enumEmptyVariantTypeNode, etc.

export const STANDALONE_TYPE_NODES = {
  amountTypeNode: {} as AmountTypeNode,
  arrayTypeNode: {} as ArrayTypeNode,
  booleanTypeNode: {} as BooleanTypeNode,
  bytesTypeNode: {} as BytesTypeNode,
  dateTimeTypeNode: {} as DateTimeTypeNode,
  enumTypeNode: {} as EnumTypeNode,
  linkTypeNode: {} as LinkTypeNode,
  mapTypeNode: {} as MapTypeNode,
  numberTypeNode: {} as NumberTypeNode,
  optionTypeNode: {} as OptionTypeNode,
  publicKeyTypeNode: {} as PublicKeyTypeNode,
  setTypeNode: {} as SetTypeNode,
  solAmountTypeNode: {} as SolAmountTypeNode,
  stringTypeNode: {} as StringTypeNode,
  structTypeNode: {} as StructTypeNode,
  tupleTypeNode: {} as TupleTypeNode,
};

export const TYPE_NODES = Object.keys(
  STANDALONE_TYPE_NODES
) as (keyof typeof STANDALONE_TYPE_NODES)[];

export type TypeNode =
  typeof STANDALONE_TYPE_NODES[keyof typeof STANDALONE_TYPE_NODES];

// Node Group Registration.
// This includes all type nodes.

export const REGISTERED_TYPE_NODES = {
  ...STANDALONE_TYPE_NODES,

  // The following are not valid standalone types.
  structFieldTypeNode: {} as StructFieldTypeNode,
  enumEmptyVariantTypeNode: {} as EnumEmptyVariantTypeNode,
  enumStructVariantTypeNode: {} as EnumStructVariantTypeNode,
  enumTupleVariantTypeNode: {} as EnumTupleVariantTypeNode,
};

export const REGISTERED_TYPE_NODE_KEYS = Object.keys(
  REGISTERED_TYPE_NODES
) as (keyof typeof REGISTERED_TYPE_NODES)[];

export type RegisteredTypeNodes = typeof REGISTERED_TYPE_NODES;

// Node Group Helpers.

function isArrayOfSize(array: any, size: number): boolean {
  return Array.isArray(array) && array.length === size;
}

export const createTypeNodeFromIdl = (idlType: IdlType): TypeNode => {
  // Leaf.
  if (typeof idlType === 'string' && IDL_TYPE_LEAVES.includes(idlType)) {
    if (idlType === 'bool') return booleanTypeNode();
    if (idlType === 'string') return stringTypeNode();
    if (idlType === 'publicKey') return publicKeyTypeNode();
    if (idlType === 'bytes')
      return bytesTypeNode(prefixedSizeNode(numberTypeNode('u32')));
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
  return !!node && (REGISTERED_TYPE_NODE_KEYS as string[]).includes(node.kind);
}

export function assertTypeNode(node: Node | null): asserts node is TypeNode {
  if (!isTypeNode(node)) {
    throw new Error(`Expected typeNode, got ${node?.kind ?? 'null'}.`);
  }
}

export function isStructOrLinkTypeNode(
  node: Node | null
): node is StructTypeNode | LinkTypeNode {
  return (
    !!node && (node.kind === 'structTypeNode' || node.kind === 'linkTypeNode')
  );
}

export function assertStructOrLinkTypeNode(
  node: Node | null
): asserts node is StructTypeNode | LinkTypeNode {
  if (!isStructOrLinkTypeNode(node)) {
    throw new Error(
      `Expected structTypeNode | LinkTypeNode, got ${node?.kind ?? 'null'}.`
    );
  }
}
