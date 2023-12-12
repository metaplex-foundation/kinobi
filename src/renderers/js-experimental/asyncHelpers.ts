import { InstructionNode } from '../../nodes';
import { InstructionDefault } from '../../shared';
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
  defaultsTo: InstructionDefault,
  asyncResolvers: string[]
): boolean {
  switch (defaultsTo.kind) {
    case 'pda':
      return true;
    case 'resolver':
      return asyncResolvers.includes(defaultsTo.name);
    case 'conditional':
    case 'conditionalResolver':
      if (
        defaultsTo.kind === 'conditionalResolver' &&
        asyncResolvers.includes(defaultsTo.resolver.name)
      ) {
        return true;
      }
      return (
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
