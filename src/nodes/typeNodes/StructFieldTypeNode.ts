import type { IdlType, IdlTypeStructField } from '../../idl';
import { InvalidKinobiTreeError, MainCaseString, mainCase } from '../../shared';
import { ValueNode, arrayValueNode, numberValueNode } from '../valueNodes';
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
  const isPadding = (idl.attrs ?? []).includes('padding');
  return structFieldTypeNode({
    name: idl.name ?? '',
    type: createTypeNodeFromIdl(idl.type),
    docs: idl.docs ?? [],
    ...(isPadding
      ? {
          defaultValue: createPaddingDefaultValue(idl.type),
          defaultValueStrategy: 'omitted' as const,
        }
      : {}),
  });
}

const SUPPORTED_PADDING_ELEMENTS = ['u8', 'bytes'];

function createPaddingDefaultValue(idlType: IdlType): ValueNode {
  if (
    typeof idlType !== 'object' ||
    !('array' in idlType) ||
    !Array.isArray(idlType.array) ||
    idlType.array.length !== 2
  ) {
    throw new Error(
      `Unsupported padding type: ${JSON.stringify(idlType)}. ` +
        `Padding fields must be fixed-size arrays (e.g. { "array": ["u8", 3] }).`
    );
  }
  const elementType = idlType.array[0];
  if (
    typeof elementType !== 'string' ||
    !SUPPORTED_PADDING_ELEMENTS.includes(elementType)
  ) {
    throw new Error(
      `Unsupported padding array element type: ${JSON.stringify(elementType)}. ` +
        `Expected one of: ${SUPPORTED_PADDING_ELEMENTS.join(', ')}.`
    );
  }
  const size = idlType.array[1] as number;
  if (
    typeof size !== 'number' ||
    !Number.isFinite(size) ||
    !Number.isInteger(size) ||
    size <= 0
  ) {
    throw new Error(
      `Invalid padding array size: ${JSON.stringify(size)}. ` +
        `Expected a finite positive integer.`
    );
  }
  return arrayValueNode(Array.from({ length: size }, () => numberValueNode(0)));
}
