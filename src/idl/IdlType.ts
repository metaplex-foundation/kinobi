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
export type IdlTypeOption = { option: IdlType };

// Lists.
export type IdlTypeTuple = { tuple: IdlType[] };
export type IdlTypeVec = { vec: IdlType };
export type IdlTypeArray = { array: [idlType: IdlType, size: number] };

// Maps.
export type IdlTypeMap = IdlTypeHashMap | IdlTypeBTreeMap;
export type IdlTypeHashMap = { hashMap: [IdlType, IdlType] };
export type IdlTypeBTreeMap = { bTreeMap: [IdlType, IdlType] };

// Sets.
export type IdlTypeSet = IdlTypeHashSet | IdlTypeBTreeSet;
export type IdlTypeHashSet = { hashSet: IdlType };
export type IdlTypeBTreeSet = { bTreeSet: IdlType };

// Struct.
export type IdlTypeStruct = {
  kind: 'struct';
  fields: IdlTypeStructField[];
};
export type IdlTypeStructField = {
  name: string;
  type: IdlType;
  docs?: string[];
};

// Enums.
export type IdlTypeEnum = {
  kind: 'enum';
  name?: string;
  variants: IdlTypeEnumVariant[];
};
export type IdlTypeEnumVariant = { name: string; fields?: IdlTypeEnumFields };
export type IdlTypeEnumFields = IdlTypeEnumField[] | IdlType[];
export type IdlTypeEnumField = { name: string; type: IdlType; docs?: string[] };

// Leaves.
export type IdlTypeLeaf = IdlTypeNumber | 'string' | 'publicKey' | 'bytes';
export type IdlTypeNumber =
  | 'bool'
  | 'u8'
  | 'u16'
  | 'u32'
  | 'u64'
  | 'u128'
  | 'i8'
  | 'i16'
  | 'i32'
  | 'i64'
  | 'i128'
  | 'f32'
  | 'f64';
