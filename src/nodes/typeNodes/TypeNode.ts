import { IDL_TYPE_LEAVES, IdlType } from '../../idl';
import {
  DefinedTypeLinkNode,
  definedTypeLinkNode,
} from '../linkNodes/DefinedTypeLinkNode';
import { AmountTypeNode } from './AmountTypeNode';
import { ArrayTypeNode, arrayTypeNodeFromIdl } from './ArrayTypeNode';
import { BooleanTypeNode, booleanTypeNode } from './BooleanTypeNode';
import { BytesTypeNode, bytesTypeNode } from './BytesTypeNode';
import { DateTimeTypeNode } from './DateTimeTypeNode';
import { EnumEmptyVariantTypeNode } from './EnumEmptyVariantTypeNode';
import { EnumStructVariantTypeNode } from './EnumStructVariantTypeNode';
import { EnumTupleVariantTypeNode } from './EnumTupleVariantTypeNode';
import { EnumTypeNode, enumTypeNodeFromIdl } from './EnumTypeNode';
import { FixedSizeTypeNode } from './FixedSizeTypeNode';
import { MapTypeNode, mapTypeNodeFromIdl } from './MapTypeNode';
import { NumberTypeNode, numberTypeNode } from './NumberTypeNode';
import { OptionTypeNode, optionTypeNodeFromIdl } from './OptionTypeNode';
import { PublicKeyTypeNode, publicKeyTypeNode } from './PublicKeyTypeNode';
import { SetTypeNode, setTypeNodeFromIdl } from './SetTypeNode';
import { SizePrefixTypeNode, sizePrefixTypeNode } from './SizePrefixTypeNode';
import { SolAmountTypeNode } from './SolAmountTypeNode';
import { StringTypeNode, stringTypeNode } from './StringTypeNode';
import { StructFieldTypeNode } from './StructFieldTypeNode';
import { StructTypeNode, structTypeNodeFromIdl } from './StructTypeNode';
import { TupleTypeNode, tupleTypeNodeFromIdl } from './TupleTypeNode';

// Standalone Type Node Registration.
export type StandaloneTypeNode =
  | AmountTypeNode
  | ArrayTypeNode
  | BooleanTypeNode
  | BytesTypeNode
  | DateTimeTypeNode
  | EnumTypeNode
  | FixedSizeTypeNode
  | MapTypeNode
  | NumberTypeNode
  | OptionTypeNode
  | PublicKeyTypeNode
  | SetTypeNode
  | SizePrefixTypeNode
  | SolAmountTypeNode
  | StringTypeNode
  | StructTypeNode
  | TupleTypeNode;
export const STANDALONE_TYPE_NODE_KINDS = [
  'amountTypeNode',
  'arrayTypeNode',
  'booleanTypeNode',
  'bytesTypeNode',
  'dateTimeTypeNode',
  'enumTypeNode',
  'fixedSizeTypeNode',
  'mapTypeNode',
  'numberTypeNode',
  'optionTypeNode',
  'publicKeyTypeNode',
  'setTypeNode',
  'sizePrefixTypeNode',
  'solAmountTypeNode',
  'stringTypeNode',
  'structTypeNode',
  'tupleTypeNode',
] satisfies readonly StandaloneTypeNode['kind'][];
null as unknown as StandaloneTypeNode['kind'] satisfies (typeof STANDALONE_TYPE_NODE_KINDS)[number];

// Type Node Registration.
export type RegisteredTypeNode =
  | StandaloneTypeNode
  | StructFieldTypeNode
  | EnumEmptyVariantTypeNode
  | EnumStructVariantTypeNode
  | EnumTupleVariantTypeNode;
export const REGISTERED_TYPE_NODE_KINDS = [
  ...STANDALONE_TYPE_NODE_KINDS,
  'structFieldTypeNode',
  'enumEmptyVariantTypeNode',
  'enumStructVariantTypeNode',
  'enumTupleVariantTypeNode',
] satisfies readonly RegisteredTypeNode['kind'][];
null as unknown as RegisteredTypeNode['kind'] satisfies (typeof REGISTERED_TYPE_NODE_KINDS)[number];

// Type Node Helpers.
// This only includes type nodes that can be used as standalone types.
// E.g. this excludes structFieldTypeNode, enumEmptyVariantTypeNode, etc.
// It also includes the definedTypeLinkNode to compose types.

export type TypeNode = StandaloneTypeNode | DefinedTypeLinkNode;
export const TYPE_NODES = [
  ...STANDALONE_TYPE_NODE_KINDS,
  'definedTypeLinkNode',
] satisfies readonly TypeNode['kind'][];

export type ResolveNestedTypeNode<TType extends TypeNode> =
  | TType
  | ((FixedSizeTypeNode | SizePrefixTypeNode) & {
      type: ResolveNestedTypeNode<TType>;
    });

export function resolveNestedTypeNode<TType extends TypeNode>(
  typeNode: ResolveNestedTypeNode<TType>
): TType {
  switch (typeNode.kind) {
    case 'fixedSizeTypeNode':
    case 'sizePrefixTypeNode':
      return resolveNestedTypeNode<TType>(
        typeNode.type as ResolveNestedTypeNode<TType>
      );
    default:
      return typeNode;
  }
}

function isArrayOfSize(array: any, size: number): boolean {
  return Array.isArray(array) && array.length === size;
}

export const createTypeNodeFromIdl = (idlType: IdlType): TypeNode => {
  // Leaf.
  if (typeof idlType === 'string' && IDL_TYPE_LEAVES.includes(idlType)) {
    if (idlType === 'bool') return booleanTypeNode();
    if (idlType === 'publicKey') return publicKeyTypeNode();
    if (idlType === 'string')
      return sizePrefixTypeNode(stringTypeNode(), numberTypeNode('u32'));
    if (idlType === 'bytes')
      return sizePrefixTypeNode(bytesTypeNode(), numberTypeNode('u32'));
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
