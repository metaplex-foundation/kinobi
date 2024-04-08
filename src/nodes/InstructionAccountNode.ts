import { IdlInstructionAccount } from '../idl';
import { MainCaseString, PartialExcept, mainCase } from '../shared';
import { InstructionInputValueNode } from './contextualValueNodes';

export interface InstructionAccountNode<
  TDefaultValue extends InstructionInputValueNode | undefined =
    | InstructionInputValueNode
    | undefined,
> {
  readonly kind: 'instructionAccountNode';

  // Children.
  readonly defaultValue?: TDefaultValue;

  // Data.
  readonly name: MainCaseString;
  readonly isWritable: boolean;
  readonly isSigner: boolean | 'either';
  readonly isOptional: boolean;
  readonly docs: string[];
}

export type InstructionAccountNodeInput<
  TDefaultValue extends InstructionInputValueNode | undefined =
    | InstructionInputValueNode
    | undefined,
> = Omit<
  PartialExcept<
    InstructionAccountNode<TDefaultValue>,
    'isWritable' | 'isSigner'
  >,
  'kind' | 'name'
> & {
  readonly name: string;
};

export function instructionAccountNode<
  TDefaultValue extends InstructionInputValueNode | undefined = undefined,
>(
  input: InstructionAccountNodeInput<TDefaultValue>
): InstructionAccountNode<TDefaultValue> {
  return {
    kind: 'instructionAccountNode',
    name: mainCase(input.name),
    isWritable: input.isWritable,
    isSigner: input.isSigner,
    isOptional: input.isOptional ?? false,
    docs: input.docs ?? [],
    defaultValue: input.defaultValue,
  };
}

export function instructionAccountNodeFromIdl(
  idl: IdlInstructionAccount
): InstructionAccountNode {
  const isOptional = idl.optional ?? idl.isOptional ?? false;
  const desc = idl.desc ? [idl.desc] : undefined;
  return instructionAccountNode({
    name: idl.name ?? '',
    isWritable: idl.isMut ?? false,
    isSigner: idl.isOptionalSigner ? 'either' : idl.isSigner ?? false,
    isOptional,
    docs: idl.docs ?? desc ?? [],
  });
}
