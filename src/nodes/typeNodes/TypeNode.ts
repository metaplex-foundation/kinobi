import { IDL_TYPE_LEAVES, IdlType } from '../../idl';
import { getNodeKinds } from '../../shared/utils';
import {
  DefinedTypeLinkNode,
  definedTypeLinkNode,
} from '../linkNodes/DefinedTypeLinkNode';
import { prefixedSizeNode } from '../sizeNodes/PrefixedSizeNode';
import { AmountTypeNode } from './AmountTypeNode';
import { ArrayTypeNode, arrayTypeNodeFromIdl } from './ArrayTypeNode';
import { BooleanTypeNode, booleanTypeNode } from './BooleanTypeNode';
import { BytesTypeNode, bytesTypeNode } from './BytesTypeNode';
import { DateTimeTypeNode } from './DateTimeTypeNode';
import { EnumEmptyVariantTypeNode } from './EnumEmptyVariantTypeNode';
import { EnumStructVariantTypeNode } from './EnumStructVariantTypeNode';
import { EnumTupleVariantTypeNode } from './EnumTupleVariantTypeNode';
import { EnumTypeNode, enumTypeNodeFromIdl } from './EnumTypeNode';
import { MapTypeNode, mapTypeNodeFromIdl } from './MapTypeNode';
import { NumberTypeNode, numberTypeNode } from './NumberTypeNode';
import { OptionTypeNode, optionTypeNodeFromIdl } from './OptionTypeNode';
import { PublicKeyTypeNode, publicKeyTypeNode } from './PublicKeyTypeNode';
import { SetTypeNode, setTypeNodeFromIdl } from './SetTypeNode';
import { SolAmountTypeNode } from './SolAmountTypeNode';
import { StringTypeNode, stringTypeNode } from './StringTypeNode';
import { StructFieldTypeNode } from './StructFieldTypeNode';
import { StructTypeNode, structTypeNodeFromIdl } from './StructTypeNode';
import { TupleTypeNode, tupleTypeNodeFromIdl } from './TupleTypeNode';

// Standalone Type Node Registration.

export const STANDALONE_TYPE_NODES = {
  amountTypeNode: {} as AmountTypeNode,
  arrayTypeNode: {} as ArrayTypeNode,
  booleanTypeNode: {} as BooleanTypeNode,
  bytesTypeNode: {} as BytesTypeNode,
  dateTimeTypeNode: {} as DateTimeTypeNode,
  enumTypeNode: {} as EnumTypeNode,
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

export const STANDALONE_TYPE_NODE_KINDS = getNodeKinds(STANDALONE_TYPE_NODES);
export type StandaloneTypeNodeKind = typeof STANDALONE_TYPE_NODE_KINDS[number];
export type StandaloneTypeNode =
  typeof STANDALONE_TYPE_NODES[StandaloneTypeNodeKind];

// Type Node Registration.

export const REGISTERED_TYPE_NODES = {
  ...STANDALONE_TYPE_NODES,

  // The following are not valid standalone types.
  structFieldTypeNode: {} as StructFieldTypeNode,
  enumEmptyVariantTypeNode: {} as EnumEmptyVariantTypeNode,
  enumStructVariantTypeNode: {} as EnumStructVariantTypeNode,
  enumTupleVariantTypeNode: {} as EnumTupleVariantTypeNode,
};

export const REGISTERED_TYPE_NODE_KINDS = getNodeKinds(REGISTERED_TYPE_NODES);
export type RegisteredTypeNodeKind = typeof REGISTERED_TYPE_NODE_KINDS[number];
export type RegisteredTypeNode =
  typeof REGISTERED_TYPE_NODES[RegisteredTypeNodeKind];

// Type Node Helpers.
// This only includes type nodes that can be used as standalone types.
// E.g. this excludes structFieldTypeNode, enumEmptyVariantTypeNode, etc.
// It also includes the definedTypeLinkNode to compose types.

export const TYPE_NODES = [
  ...STANDALONE_TYPE_NODE_KINDS,
  'definedTypeLinkNode' as const,
];
export type TypeNodeKind = typeof TYPE_NODES[number];
export type TypeNode = StandaloneTypeNode | DefinedTypeLinkNode;

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
    return definedTypeLinkNode(idlType.defined);
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
