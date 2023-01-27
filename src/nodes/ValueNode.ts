export type ValueNode =
  | ScalarValueNode
  | ListValueNode
  | TupleValueNode
  | SetValueNode
  | MapValueNode
  | OptionValueNode
  | StructValueNode
  | EnumValueNode;

export type ScalarValueNode =
  | { __kind: 'number'; value: number }
  | { __kind: 'boolean'; value: boolean }
  | { __kind: 'string'; value: string };
export const vScalar = (scalar: number | boolean | string): ScalarValueNode => {
  if (typeof scalar === 'number') return { __kind: 'number', value: scalar };
  if (typeof scalar === 'boolean') return { __kind: 'boolean', value: scalar };
  return { __kind: 'string', value: scalar };
};

export type ListValueNode = { __kind: 'list'; values: ValueNode[] };
export const vList = (values: ValueNode[]): ListValueNode => ({
  __kind: 'list',
  values,
});

export type TupleValueNode = { __kind: 'tuple'; values: ValueNode[] };
export const vTuple = (values: ValueNode[]): TupleValueNode => ({
  __kind: 'tuple',
  values,
});

export type SetValueNode = { __kind: 'set'; values: ValueNode[] };
export const vSet = (values: ValueNode[]): SetValueNode => ({
  __kind: 'set',
  values,
});

export type MapValueNode = { __kind: 'map'; values: [ValueNode, ValueNode][] };
export const vMap = (values: [ValueNode, ValueNode][]): MapValueNode => ({
  __kind: 'map',
  values,
});

export type OptionValueNode =
  | { __kind: 'optionNone' }
  | { __kind: 'optionSome'; value: ValueNode };
export const vNone = (): OptionValueNode => ({ __kind: 'optionNone' });
export const vSome = (value: ValueNode): OptionValueNode => ({
  __kind: 'optionSome',
  value,
});

export type StructValueNode = {
  __kind: 'struct';
  values: Record<string, ValueNode>;
};
export const vStruct = (
  values: Record<string, ValueNode>
): StructValueNode => ({
  __kind: 'struct',
  values,
});

export type EnumValueNode = {
  __kind: 'enum';
  enumType: string;
  variant: string;
  value: StructValueNode | TupleValueNode | null;
};
export const vEnum = (
  enumType: string,
  variant: string,
  value?: StructValueNode | TupleValueNode | null
): EnumValueNode => ({
  __kind: 'enum',
  enumType,
  variant,
  value: value ?? null,
});
