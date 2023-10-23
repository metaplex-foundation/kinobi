import * as nodes from '../../../nodes';
import { camelCase } from '../../../shared';
import { ResolvedInstructionInput } from '../../../visitors';
import { ContextMap } from '../ContextMap';
import {
  Fragment,
  fragment,
  fragmentWithContextMap,
  mergeFragments,
} from './common';
import { getInstructionInputDefaultFragment } from './instructionInputDefault';

export function getInstructionInputResolvedFragment(
  instructionNode: nodes.InstructionNode,
  resolvedInputs: ResolvedInstructionInput[]
): Fragment & { interfaces: ContextMap } {
  const interfaces = new ContextMap();

  const resolvedInputFragments = resolvedInputs.flatMap(
    (input: ResolvedInstructionInput): Fragment[] => {
      const inputFragment = getInstructionInputDefaultFragment(
        input,
        instructionNode.optionalAccountStrategy
      );
      if (!inputFragment.render) return [];
      interfaces.mergeWith(inputFragment.interfaces);
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
    return fragmentWithContextMap('');
  }

  const resolvedInputsFragment = mergeFragments(
    [fragment('// Resolve default values.'), ...resolvedInputFragments],
    (renders) => renders.join('\n')
  ) as Fragment & { interfaces: ContextMap };
  resolvedInputsFragment.interfaces = interfaces;
  return resolvedInputsFragment;
}
