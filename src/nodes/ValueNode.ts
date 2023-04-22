import { ImportFrom } from '../visitors';

export type ValueNode =
  | ScalarValueNode
  | PublicKeyValueNode
  | ListValueNode
  | TupleValueNode
  | SetValueNode
  | MapValueNode
  | OptionValueNode
  | StructValueNode
  | EnumValueNode;

export type ScalarValueNode =
  | { type: 'number'; value: number }
  | { type: 'boolean'; value: boolean }
  | { type: 'string'; value: string };
export const vScalar = (scalar: number | boolean | string): ScalarValueNode => {
  if (typeof scalar === 'number') return { type: 'number', value: scalar };
  if (typeof scalar === 'boolean') return { type: 'boolean', value: scalar };
  return { type: 'string', value: scalar };
};

export type PublicKeyValueNode = { type: 'publicKey'; value: string };
export const vPublicKey = (value: string): PublicKeyValueNode => ({
  type: 'publicKey',
  value,
});

export type ListValueNode = { type: 'list'; values: ValueNode[] };
export const vList = (values: ValueNode[]): ListValueNode => ({
  type: 'list',
  values,
});

export type TupleValueNode = { type: 'tuple'; values: ValueNode[] };
export const vTuple = (values: ValueNode[]): TupleValueNode => ({
  type: 'tuple',
  values,
});

export type SetValueNode = { type: 'set'; values: ValueNode[] };
export const vSet = (values: ValueNode[]): SetValueNode => ({
  type: 'set',
  values,
});

export type MapValueNode = { type: 'map'; values: [ValueNode, ValueNode][] };
export const vMap = (values: [ValueNode, ValueNode][]): MapValueNode => ({
  type: 'map',
  values,
});

export type OptionValueNode =
  | { type: 'optionNone' }
  | { type: 'optionSome'; value: ValueNode };
export const vNone = (): OptionValueNode => ({ type: 'optionNone' });
export const vSome = (value: ValueNode): OptionValueNode => ({
  type: 'optionSome',
  value,
});

export type StructValueNode = {
  type: 'struct';
  values: Record<string, ValueNode>;
};
export const vStruct = (
  values: Record<string, ValueNode>
): StructValueNode => ({
  type: 'struct',
  values,
});

export type EnumValueNode = {
  type: 'enum';
  enumType: string;
  variant: string;
  value: StructValueNode | TupleValueNode | 'empty' | 'scalar';
  importFrom: ImportFrom | null;
};
export const vEnum = (
  enumType: string,
  variant: string,
  value?: StructValueNode | TupleValueNode | 'empty' | 'scalar',
  importFrom?: ImportFrom | null
): EnumValueNode => ({
  type: 'enum',
  enumType,
  variant,
  value: value ?? 'scalar',
  importFrom: importFrom ?? null,
});
