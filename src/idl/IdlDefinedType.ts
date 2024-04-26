import type { IdlTypeEnum, IdlTypeStruct, IdlTypeType } from './IdlType';

export type IdlRepr = IdlReprRust | IdlReprC | IdlReprTransparent;

export type IdlReprRust = {
  kind: 'rust';
} & IdlReprModifier;

export type IdlReprC = {
  kind: 'c';
} & IdlReprModifier;

export type IdlReprTransparent = {
  kind: 'transparent';
};

export type IdlReprModifier = {
  packed?: boolean;
  align?: number;
};

export type IdlSerialization =
  | 'borsh'
  | 'bytemuck'
  | 'bytemuckunsafe'
  | { custom: string };

export type IdlTypeDefGeneric = IdlTypeDefGenericType | IdlTypeDefGenericConst;

export type IdlTypeDefGenericType = {
  kind: 'type';
  name: string;
};

export type IdlTypeDefGenericConst = {
  kind: 'const';
  name: string;
  type: string;
};

export type IdlTypeDefTy = IdlTypeStruct | IdlTypeEnum | IdlTypeType;

export type IdlDefinedType = {
  name: string;
  docs?: string[];
  serialization?: IdlSerialization;
  repr?: IdlRepr;
  generics?: IdlTypeDefGeneric[];
  type: IdlTypeDefTy;
};
