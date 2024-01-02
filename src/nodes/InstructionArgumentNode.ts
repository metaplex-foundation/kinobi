import { IdlInstructionArg } from '../idl';
import { InvalidKinobiTreeError, MainCaseString, mainCase } from '../shared';
import { InstructionInputValueNode } from './contextualValueNodes';
import { TypeNode, createTypeNodeFromIdl } from './typeNodes';

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
  return instructionArgumentNode({
    name: idl.name ?? '',
    type: createTypeNodeFromIdl(idl.type),
    docs: idl.docs ?? [],
  });
}
