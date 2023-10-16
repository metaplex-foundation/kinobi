import { pascalCase } from '../../../shared';
import * as nodes from '../../../nodes';
import { Fragment, fragmentFromTemplate, mergeFragments } from './common';
import { getInstructionAccountMetaFragment } from './instructionAccountMeta';

export function getInstructionTypeFragment(
  instructionNode: nodes.InstructionNodeInput,
  programNode: nodes.ProgramNode
): Fragment {
  const hasAccounts = instructionNode.accounts.length > 0;
  const hasData =
    !!instructionNode.dataArgs.link ||
    instructionNode.dataArgs.struct.fields.length > 0;
  const dataType = instructionNode.dataArgs.link
    ? pascalCase(instructionNode.dataArgs.link.name)
    : pascalCase(instructionNode.dataArgs.name);
  const accountMetasFragment = mergeFragments(
    instructionNode.accounts.map(getInstructionAccountMetaFragment),
    (renders) => renders.join(', ')
  );

  return fragmentFromTemplate('instructionType.njk', {
    instruction: instructionNode,
    program: programNode,
    hasData,
    hasAccounts,
    dataType,
    accountMetas: accountMetasFragment.render,
  })
    .mergeImportsWith(accountMetasFragment)
    .addImports('solanaInstructions', [
      'IInstruction',
      ...(hasData ? ['IInstructionWithData'] : []),
      ...(hasAccounts ? ['IInstructionWithAccounts'] : []),
    ]);
}
