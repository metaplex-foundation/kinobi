import type { IdlTypeStructField } from '../../idl';
import { InvalidKinobiTreeError, MainCaseString, mainCase } from '../../shared';
import { ValueNode } from '../valueNodes';
import { TypeNode, createTypeNodeFromIdl } from './TypeNode';

export type StructFieldTypeNode = {
  readonly kind: 'structFieldTypeNode';

  // Children.
  readonly type: TypeNode;
  readonly defaultValue?: ValueNode;

  // Data.
  readonly name: MainCaseString;
  readonly docs: string[];
  readonly defaultValueStrategy?: 'optional' | 'omitted';
};

export type StructFieldTypeNodeInput = {
  readonly name: string;
  readonly type: TypeNode;
  readonly docs?: string[];
  readonly defaultValue?: ValueNode;
  readonly defaultValueStrategy?: 'optional' | 'omitted';
};

export function structFieldTypeNode(
  input: StructFieldTypeNodeInput
): StructFieldTypeNode {
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
