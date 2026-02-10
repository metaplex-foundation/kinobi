import { IdlInstructionArg, IdlType } from '../idl';
import { InvalidKinobiTreeError, MainCaseString, mainCase } from '../shared';
import { isNode } from './Node';
import { InstructionInputValueNode } from './contextualValueNodes';
import {
  TypeNode,
  createTypeNodeFromIdl,
  structFieldTypeNode,
  structTypeNode,
} from './typeNodes';
import { VALUE_NODES, ValueNode, arrayValueNode, numberValueNode } from './valueNodes';

export type InstructionArgumentNode = {
  readonly kind: 'instructionArgumentNode';

  // Children.
  readonly type: TypeNode;
  readonly defaultValue?: InstructionInputValueNode;

  // Data.
  readonly name: MainCaseString;
  readonly docs: string[];
  readonly defaultValueStrategy?: 'optional' | 'omitted';
};

export type InstructionArgumentNodeInput = {
  readonly name: string;
  readonly type: TypeNode;
  readonly docs?: string[];
  readonly defaultValue?: InstructionInputValueNode;
  readonly defaultValueStrategy?: 'optional' | 'omitted';
};

export function instructionArgumentNode(
  input: InstructionArgumentNodeInput
): InstructionArgumentNode {
  if (!input.name) {
    throw new InvalidKinobiTreeError(
      'InstructionArgumentNode must have a name.'
    );
  }
  return {
    kind: 'instructionArgumentNode',
    name: mainCase(input.name),
    type: input.type,
    docs: input.docs ?? [],
    defaultValue: input.defaultValue,
    defaultValueStrategy: input.defaultValueStrategy,
  };
}

export function instructionArgumentNodeFromIdl(
  idl: IdlInstructionArg
): InstructionArgumentNode {
  const isPadding = (idl.attrs ?? []).includes('padding');
  return instructionArgumentNode({
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
  if (typeof size !== 'number' || !Number.isFinite(size) || !Number.isInteger(size) || size <= 0) {
    throw new Error(
      `Invalid padding array size: ${JSON.stringify(size)}. ` +
        `Expected a finite positive integer.`
    );
  }
  return arrayValueNode(
    Array.from({ length: size }, () => numberValueNode(0))
  );
}

export function structTypeNodeFromInstructionArgumentNodes(
  nodes: InstructionArgumentNode[]
) {
  return structTypeNode(
    nodes.map(structFieldTypeNodeFromInstructionArgumentNode)
  );
}

export function structFieldTypeNodeFromInstructionArgumentNode(
  node: InstructionArgumentNode
) {
  if (isNode(node.defaultValue, VALUE_NODES)) {
    return structFieldTypeNode({ ...node, defaultValue: node.defaultValue });
  }
  return structFieldTypeNode({
    ...node,
    defaultValue: undefined,
    defaultValueStrategy: undefined,
  });
}
