import {
  InstructionInputValueNode,
  InstructionNode,
  isNode,
} from '../../nodes';
import { ResolvedInstructionInput } from '../../visitors';

export function hasAsyncFunction(
  instructionNode: InstructionNode,
  resolvedInputs: ResolvedInstructionInput[],
  asyncResolvers: string[]
): boolean {
  const hasBytesCreatedOnChainAsync =
    instructionNode.bytesCreatedOnChain?.kind === 'resolver' &&
    asyncResolvers.includes(instructionNode.bytesCreatedOnChain.name);
  const hasRemainingAccountsAsync = (
    instructionNode.remainingAccounts ?? []
  ).some(
    ({ value }) =>
      isNode(value, 'resolverValueNode') && asyncResolvers.includes(value.name)
  );

  return (
    hasAsyncDefaultValues(resolvedInputs, asyncResolvers) ||
    hasBytesCreatedOnChainAsync ||
    hasRemainingAccountsAsync
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
