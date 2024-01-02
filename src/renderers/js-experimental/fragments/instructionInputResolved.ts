import { InstructionNode } from '../../../nodes';
import { camelCase } from '../../../shared';
import { ResolvedInstructionInput } from '../../../visitors';
import { NameApi } from '../nameTransformers';
import { ValueNodeVisitor } from '../renderValueNodeVisitor';
import { Fragment, fragment, mergeFragments } from './common';
import { getInstructionInputDefaultFragment } from './instructionInputDefault';

export function getInstructionInputResolvedFragment(scope: {
  instructionNode: InstructionNode;
  resolvedInputs: ResolvedInstructionInput[];
  asyncResolvers: string[];
  useAsync: boolean;
  nameApi: NameApi;
  valueNodeVisitor: ValueNodeVisitor;
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
          input.kind === 'argument'
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
