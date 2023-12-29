import { ImportFrom, MainCaseString, mainCase } from '../../shared';
import { Node } from '../Node';
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

export function isEnumValueNode(node: Node | null): node is EnumValueNode {
  return !!node && node.kind === 'enumValueNode';
}

export function assertEnumValueNode(
  node: Node | null
): asserts node is EnumValueNode {
  if (!isEnumValueNode(node)) {
    throw new Error(`Expected enumValueNode, got ${node?.kind ?? 'null'}.`);
  }
}
