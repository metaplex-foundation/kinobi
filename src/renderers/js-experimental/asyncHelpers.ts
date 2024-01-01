import { InstructionInputValueNode, InstructionNode } from '../../nodes';
import { ResolvedInstructionInput } from '../../visitors';

export function hasAsyncFunction(
  instructionNode: InstructionNode,
  resolvedInputs: ResolvedInstructionInput[],
  asyncResolvers: string[]
): boolean {
  const isBytesCreatedOnChainAsync =
    instructionNode.bytesCreatedOnChain?.kind === 'resolver' &&
    asyncResolvers.includes(instructionNode.bytesCreatedOnChain.name);
  const isRemainingAccountAsync =
    instructionNode.remainingAccounts?.kind === 'resolver' &&
    asyncResolvers.includes(instructionNode.remainingAccounts.name);

  return (
    hasAsyncDefaultValues(resolvedInputs, asyncResolvers) ||
    isBytesCreatedOnChainAsync ||
    isRemainingAccountAsync
  );
}

export function hasAsyncDefaultValues(
  resolvedInputs: ResolvedInstructionInput[],
  asyncResolvers: string[]
): boolean {
  return resolvedInputs.some(
    (input) =>
      !!input.defaultsTo &&
      isAsyncDefaultValue(input.defaultsTo, asyncResolvers)
  );
}

export function isAsyncDefaultValue(
  defaultsTo: InstructionInputValueNode,
  asyncResolvers: string[]
): boolean {
  switch (defaultsTo.kind) {
    case 'pdaValueNode':
      return true;
    case 'resolverValueNode':
      return asyncResolvers.includes(defaultsTo.name);
    case 'conditionalValueNode':
      return (
        isAsyncDefaultValue(defaultsTo.condition, asyncResolvers) ||
        (defaultsTo.ifFalse == null
          ? false
          : isAsyncDefaultValue(defaultsTo.ifFalse, asyncResolvers)) ||
        (defaultsTo.ifTrue == null
          ? false
          : isAsyncDefaultValue(defaultsTo.ifTrue, asyncResolvers))
      );
    default:
      return false;
  }
}
