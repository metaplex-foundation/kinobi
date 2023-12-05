import { ResolvedInstructionInput } from '../../visitors';
import { InstructionDefault } from '../../shared';

export function hasAsyncDefaultValues(
  resolvedInputs: ResolvedInstructionInput[]
): boolean {
  return resolvedInputs.some(
    (input) => !!input.defaultsTo && isAsyncDefaultValue(input.defaultsTo)
  );
}

export function isAsyncDefaultValue(defaultsTo: InstructionDefault): boolean {
  switch (defaultsTo.kind) {
    case 'pda':
      return true;
    case 'conditional':
    case 'conditionalResolver':
      return (
        (defaultsTo.ifFalse == null
          ? false
          : isAsyncDefaultValue(defaultsTo.ifFalse)) ||
        (defaultsTo.ifTrue == null
          ? false
          : isAsyncDefaultValue(defaultsTo.ifTrue))
      );
    default:
      return false;
  }
}
