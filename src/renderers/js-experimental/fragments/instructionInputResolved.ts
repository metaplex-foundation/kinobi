import * as nodes from '../../../nodes';
import { camelCase } from '../../../shared';
import { ResolvedInstructionInput, Visitor, visit } from '../../../visitors';
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
  resolvedInstructionInputVisitor: Visitor<ResolvedInstructionInput[]>
): Fragment & { interfaces: ContextMap } {
  const interfaces = new ContextMap();

  const resolvedInputs = visit(
    instructionNode,
    resolvedInstructionInputVisitor
  ).flatMap((input: ResolvedInstructionInput): Fragment[] => {
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
  });

  if (resolvedInputs.length === 0) {
    return fragmentWithContextMap('');
  }

  const resolvedInputsFragment = mergeFragments(
    [fragment('// Resolve default values.'), ...resolvedInputs],
    (renders) => renders.join('\n')
  ) as Fragment & { interfaces: ContextMap };
  resolvedInputsFragment.interfaces = interfaces;
  return resolvedInputsFragment;
}
