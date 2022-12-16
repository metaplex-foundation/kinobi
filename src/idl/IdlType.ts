export type IdlType =
  | IdlTypeDefined
  | IdlTypeOption
  | IdlTypeTuple
  | IdlTypeVec
  | IdlTypeArray
  | IdlTypeMap
  | IdlTypeSet
  | IdlTypeEnum
  | IdlTypeLeaf;

// Defined.
export type IdlTypeDefined = { defined: string };

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

// Enums.
export type IdlTypeEnum = IdlTypeScalarEnum | IdlTypeDataEnum;
export type IdlTypeScalarEnum = {
  kind: 'enum';
  name?: string;
  variants: IdlEnumVariant[];
};
export type IdlTypeDataEnum = {
  kind: 'enum';
  name?: string;
  variants: IdlDataEnumVariant[];
};
export type IdlEnumVariant = {
  name: string;
};
export type IdlDataEnumVariant =
  | IdlDataEnumVariantWithNamedFields
  | IdlDataEnumVariantWithUnnamedFields
  | IdlEnumVariant;
export type IdlDataEnumVariantWithNamedFields = {
  name: string;
  fields: IdlField[];
};
export type IdlDataEnumVariantWithUnnamedFields = {
  name: string;
  fields: IdlType[];
};

// Fields.
export type IdlTypeFields = {
  kind: 'struct' | 'enum';
  fields: IdlField[];
};
export type IdlField = {
  name: string;
  type: IdlType;
  attrs?: string[];
};

// Leaves.
export type IdlTypeLeaf = IdlTypeNumber | 'string' | 'publicKey';
export type IdlTypeNumber =
  | 'u8'
  | 'u16'
  | 'u32'
  | 'u64'
  | 'u128'
  | 'u256'
  | 'u512'
  | 'i8'
  | 'i16'
  | 'i32'
  | 'i64'
  | 'i128'
  | 'i256'
  | 'i512'
  | 'bool';
