import { ResolvedInstructionInput } from '../../visitors';
import { InstructionDefault } from '../../shared';

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
