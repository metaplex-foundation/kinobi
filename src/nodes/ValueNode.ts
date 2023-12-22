import { ImportFrom, MainCaseString, mainCase } from '../shared';

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
  | { kind: 'number'; value: number }
  | { kind: 'boolean'; value: boolean }
  | { kind: 'string'; value: string };
export const vScalar = (scalar: number | boolean | string): ScalarValueNode => {
  if (typeof scalar === 'number') return { kind: 'number', value: scalar };
  if (typeof scalar === 'boolean') return { kind: 'boolean', value: scalar };
  return { kind: 'string', value: scalar };
};

export type PublicKeyValueNode = { kind: 'publicKey'; value: string };
export const vPublicKey = (value: string): PublicKeyValueNode => ({
  kind: 'publicKey',
  value,
});

export type ListValueNode = { kind: 'list'; values: ValueNode[] };
export const vList = (values: ValueNode[]): ListValueNode => ({
  kind: 'list',
  values,
});

export type TupleValueNode = { kind: 'tuple'; values: ValueNode[] };
export const vTuple = (values: ValueNode[]): TupleValueNode => ({
  kind: 'tuple',
  values,
});

export type SetValueNode = { kind: 'set'; values: ValueNode[] };
export const vSet = (values: ValueNode[]): SetValueNode => ({
  kind: 'set',
  values,
});

export type MapValueNode = { kind: 'map'; values: [ValueNode, ValueNode][] };
export const vMap = (values: [ValueNode, ValueNode][]): MapValueNode => ({
  kind: 'map',
  values,
});

export type OptionValueNode =
  | { kind: 'optionNone' }
  | { kind: 'optionSome'; value: ValueNode };
export const vNone = (): OptionValueNode => ({ kind: 'optionNone' });
export const vSome = (value: ValueNode): OptionValueNode => ({
  kind: 'optionSome',
  value,
});

export type StructValueNode = {
  kind: 'struct';
  values: Record<MainCaseString, ValueNode>;
};
export const vStruct = (
  values: Record<string, ValueNode>
): StructValueNode => ({
  kind: 'struct',
  values: Object.fromEntries(
    Object.entries(values).map(([key, value]) => [mainCase(key), value])
  ),
});

export type EnumValueNode = {
  kind: 'enum';
  enumType: MainCaseString;
  variant: MainCaseString;
  value: StructValueNode | TupleValueNode | 'empty' | 'scalar';
  importFrom: ImportFrom | null;
};
export const vEnum = (
  enumType: string,
  variant: string,
  value?: StructValueNode | TupleValueNode | 'empty' | 'scalar',
  importFrom?: ImportFrom | null
): EnumValueNode => ({
  kind: 'enum',
  enumType: mainCase(enumType),
  variant: mainCase(variant),
  value: value ?? 'scalar',
  importFrom: importFrom ?? null,
});
