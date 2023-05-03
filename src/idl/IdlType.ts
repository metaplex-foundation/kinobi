export type IdlType =
  | IdlTypeDefinedLink
  | IdlTypeOption
  | IdlTypeTuple
  | IdlTypeVec
  | IdlTypeArray
  | IdlTypeMap
  | IdlTypeSet
  | IdlTypeStruct
  | IdlTypeEnum
  | IdlTypeLeaf;

// Defined.
export type IdlTypeDefinedLink = { defined: string };

// Options.
export type IdlTypeOption = ({ option: IdlType } | { coption: IdlType }) & {
  prefix?: IdlTypeUnsignedInteger;
  fixed?: boolean;
};

// Lists.
export type IdlTypeTuple = { tuple: IdlType[] };
export type IdlTypeVec = {
  vec: IdlType;
  size?: IdlTypeUnsignedInteger | 'remainder';
};
export type IdlTypeArray = { array: [idlType: IdlType, size: number] };

// Maps.
export type IdlTypeHashMap = { hashMap: [IdlType, IdlType] };
export type IdlTypeBTreeMap = { bTreeMap: [IdlType, IdlType] };
export type IdlTypeMap = (IdlTypeHashMap | IdlTypeBTreeMap) & {
  size?: IdlTypeUnsignedInteger | number | 'remainder';
};

// Sets.
export type IdlTypeHashSet = { hashSet: IdlType };
export type IdlTypeBTreeSet = { bTreeSet: IdlType };
export type IdlTypeSet = (IdlTypeHashSet | IdlTypeBTreeSet) & {
  size?: IdlTypeUnsignedInteger | number | 'remainder';
};

// Struct.
export type IdlTypeStruct = { kind: 'struct'; fields: IdlTypeStructField[] };
export type IdlTypeStructField = {
  name: string;
  type: IdlType;
  docs?: string[];
  defaultsValue?: any;
};

// Enums.
export type IdlTypeEnum = {
  kind: 'enum';
  variants: IdlTypeEnumVariant[];
  size?: IdlTypeUnsignedInteger;
};
export type IdlTypeEnumVariant = { name: string; fields?: IdlTypeEnumFields };
export type IdlTypeEnumFields = IdlTypeEnumField[] | IdlType[];
export type IdlTypeEnumField = { name: string; type: IdlType; docs?: string[] };

// Leaves.
export const IDL_TYPE_LEAVES = [
  'string',
  'publicKey',
  'bytes',
  'bool',
  'u8',
  'u16',
  'u32',
  'u64',
  'u128',
  'i8',
  'i16',
  'i32',
  'i64',
  'i128',
  'f32',
  'f64',
] as const;
export type IdlTypeLeaf = typeof IDL_TYPE_LEAVES[number];

export type IdlTypeUnsignedInteger = 'u8' | 'u16' | 'u32' | 'u64' | 'u128';
export type IdlTypeSignedInteger = 'i8' | 'i16' | 'i32' | 'i64' | 'i128';
export type IdlTypeInteger = IdlTypeUnsignedInteger | IdlTypeSignedInteger;
export type IdlTypeDecimals = 'f32' | 'f64';
export type IdlTypeNumber = IdlTypeInteger | IdlTypeDecimals;
