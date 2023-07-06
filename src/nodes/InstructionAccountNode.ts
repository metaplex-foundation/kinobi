import { IdlInstructionAccount } from '../idl';
import {
  InstructionAccountDefault,
  PartialExcept,
  mainCase,
  programIdDefault,
} from '../shared';
import type { Node } from './Node';

export type InstructionAccountNode = {
  readonly __instructionAccountNode: unique symbol;
  readonly kind: 'instructionAccountNode';
  readonly name: string;
  readonly isWritable: boolean;
  readonly isSigner: boolean | 'either';
  readonly isOptional: boolean;
  readonly docs: string[];
  readonly defaultsTo?: InstructionAccountDefault;
};

export type InstructionAccountNodeInput = Omit<
  PartialExcept<InstructionAccountNode, 'name' | 'isWritable' | 'isSigner'>,
  '__instructionAccountNode' | 'kind'
>;

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
  } as InstructionAccountNode;
}

export function instructionAccountNodeFromIdl(
  idl: IdlInstructionAccount,
  useProgramIdForOptionalAccounts = true
): InstructionAccountNode {
  const isOptional = idl.optional ?? idl.isOptional ?? false;
  return instructionAccountNode({
    name: idl.name ?? '',
    isWritable: idl.isMut ?? false,
    isSigner: idl.isOptionalSigner ? 'either' : idl.isSigner ?? false,
    isOptional,
    docs: idl.desc ? [idl.desc] : [],
    defaultsTo:
      isOptional && useProgramIdForOptionalAccounts
        ? programIdDefault()
        : undefined,
  });
}

export function isInstructionAccountNode(
  node: Node | null
): node is InstructionAccountNode {
  return !!node && node.kind === 'instructionAccountNode';
}

export function assertInstructionAccountNode(
  node: Node | null
): asserts node is InstructionAccountNode {
  if (!isInstructionAccountNode(node)) {
    throw new Error(
      `Expected instructionAccountNode, got ${node?.kind ?? 'null'}.`
    );
  }
}
