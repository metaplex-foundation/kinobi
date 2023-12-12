import * as nodes from '../../../nodes';
import { camelCase } from '../../../shared';
import { ResolvedInstructionInput } from '../../../visitors';
import { Fragment, fragment, mergeFragments } from './common';
import { getInstructionInputDefaultFragment } from './instructionInputDefault';

export function getInstructionInputResolvedFragment(scope: {
  instructionNode: nodes.InstructionNode;
  resolvedInputs: ResolvedInstructionInput[];
  asyncResolvers: string[];
  useAsync: boolean;
}): Fragment {
  const resolvedInputFragments = scope.resolvedInputs.flatMap(
    (input: ResolvedInstructionInput): Fragment[] => {
      const inputFragment = getInstructionInputDefaultFragment({
        ...scope,
        input,
        optionalAccountStrategy: scope.instructionNode.optionalAccountStrategy,
      });
      if (!inputFragment.render) return [];
      const camelName = camelCase(input.name);
      return [
        inputFragment.mapRender((r) =>
          input.kind === 'arg'
            ? `if (!args.${camelName}) {\n${r}\n}`
            : `if (!accounts.${camelName}.value) {\n${r}\n}`
        ),
      ];
    }
  );

  if (resolvedInputFragments.length === 0) {
    return fragment('');
  }

  return mergeFragments(
    [fragment('// Resolve default values.'), ...resolvedInputFragments],
    (renders) => renders.join('\n')
  );
}
