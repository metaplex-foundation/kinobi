import { IdlInstructionAccount } from '../idl';
import { MainCaseString, PartialExcept, mainCase } from '../shared';
import { InstructionInputValueNode } from './contextualValueNodes';

export type InstructionAccountNode = {
  readonly kind: 'instructionAccountNode';

  // Children.
  readonly defaultsTo?: InstructionInputValueNode;

  // Data.
  readonly name: MainCaseString;
  readonly isWritable: boolean;
  readonly isSigner: boolean | 'either';
  readonly isOptional: boolean;
  readonly docs: string[];
};

export type InstructionAccountNodeInput = Omit<
  PartialExcept<InstructionAccountNode, 'isWritable' | 'isSigner'>,
  'kind' | 'name'
> & {
  readonly name: string;
};

export function instructionAccountNode(
  input: InstructionAccountNodeInput
): InstructionAccountNode {
  return {
    kind: 'instructionAccountNode',
    name: mainCase(input.name),
    isWritable: input.isWritable,
    isSigner: input.isSigner,
    isOptional: input.isOptional ?? false,
    docs: input.docs ?? [],
    defaultsTo: input.defaultsTo,
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
