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
  readonly nodeClass: 'InstructionAccountNode';
  readonly name: string;
  readonly isWritable: boolean;
  readonly isSigner: boolean | 'either';
  readonly isOptional: boolean;
  readonly docs: string[];
  readonly defaultsTo?: InstructionAccountDefault;
};

export type InstructionAccountNodeInput = Omit<
  PartialExcept<InstructionAccountNode, 'name' | 'isWritable' | 'isSigner'>,
  '__instructionAccountNode' | 'nodeClass'
>;

export function instructionAccountNode(
  input: InstructionAccountNodeInput
): InstructionAccountNode {
  return {
    nodeClass: 'InstructionAccountNode',
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
  useProgramIdForOptionalAccounts = false
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
  return !!node && node.nodeClass === 'InstructionAccountNode';
}

export function assertInstructionAccountNode(
  node: Node | null
): asserts node is InstructionAccountNode {
  if (!isInstructionAccountNode(node)) {
    throw new Error(
      `Expected InstructionAccountNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
