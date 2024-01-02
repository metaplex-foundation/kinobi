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
      !!input.defaultValue &&
      isAsyncDefaultValue(input.defaultValue, asyncResolvers)
  );
}

export function isAsyncDefaultValue(
  defaultValue: InstructionInputValueNode,
  asyncResolvers: string[]
): boolean {
  switch (defaultValue.kind) {
    case 'pdaValueNode':
      return true;
    case 'resolverValueNode':
      return asyncResolvers.includes(defaultValue.name);
    case 'conditionalValueNode':
      return (
        isAsyncDefaultValue(defaultValue.condition, asyncResolvers) ||
        (defaultValue.ifFalse == null
          ? false
          : isAsyncDefaultValue(defaultValue.ifFalse, asyncResolvers)) ||
        (defaultValue.ifTrue == null
          ? false
          : isAsyncDefaultValue(defaultValue.ifTrue, asyncResolvers))
      );
    default:
      return false;
  }
}
