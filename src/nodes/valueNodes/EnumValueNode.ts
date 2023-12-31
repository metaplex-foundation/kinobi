import { ImportFrom, MainCaseString, mainCase } from '../../shared';
import { StructValueNode } from './StructValueNode';
import { TupleValueNode } from './TupleValueNode';

export type EnumValueNode = {
  readonly kind: 'enumValueNode';
  readonly enumType: MainCaseString;
  readonly variant: MainCaseString;
  readonly value: StructValueNode | TupleValueNode | 'empty' | 'scalar';
  readonly importFrom: ImportFrom | null;
};

export function enumValueNode(
  enumType: string,
  variant: string,
  value?: StructValueNode | TupleValueNode | 'empty' | 'scalar',
  importFrom?: ImportFrom | null
): EnumValueNode {
  return {
    kind: 'enumValueNode',
    enumType: mainCase(enumType),
    variant: mainCase(variant),
    value: value ?? 'scalar',
    importFrom: importFrom ?? null,
  };
}
