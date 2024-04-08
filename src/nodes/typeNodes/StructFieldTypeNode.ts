import type { IdlTypeStructField } from '../../idl';
import { InvalidKinobiTreeError, MainCaseString, mainCase } from '../../shared';
import { ValueNode } from '../valueNodes';
import { TypeNode, createTypeNodeFromIdl } from './TypeNode';

export interface StructFieldTypeNode<
  TType extends TypeNode = TypeNode,
  TDefaultValue extends ValueNode | undefined = ValueNode | undefined,
> {
  readonly kind: 'structFieldTypeNode';

  // Children.
  readonly type: TType;
  readonly defaultValue?: TDefaultValue;

  // Data.
  readonly name: MainCaseString;
  readonly docs: string[];
  readonly defaultValueStrategy?: 'optional' | 'omitted';
}

export type StructFieldTypeNodeInput<
  TType extends TypeNode = TypeNode,
  TDefaultValue extends ValueNode | undefined = ValueNode | undefined,
> = {
  readonly name: string;
  readonly type: TType;
  readonly docs?: string[];
  readonly defaultValue?: TDefaultValue;
  readonly defaultValueStrategy?: 'optional' | 'omitted';
};

export function structFieldTypeNode<
  TType extends TypeNode,
  TDefaultValue extends ValueNode | undefined = undefined,
>(
  input: StructFieldTypeNodeInput<TType, TDefaultValue>
): StructFieldTypeNode<TType, TDefaultValue> {
  if (!input.name) {
    throw new InvalidKinobiTreeError('StructFieldTypeNode must have a name.');
  }
  return {
    kind: 'structFieldTypeNode',
    name: mainCase(input.name),
    type: input.type,
    docs: input.docs ?? [],
    defaultValue: input.defaultValue,
    defaultValueStrategy: input.defaultValueStrategy,
  };
}

export function structFieldTypeNodeFromIdl(
  idl: IdlTypeStructField
): StructFieldTypeNode {
  return structFieldTypeNode({
    name: idl.name ?? '',
    type: createTypeNodeFromIdl(idl.type),
    docs: idl.docs ?? [],
  });
}
