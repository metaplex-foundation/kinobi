import * as nodes from '../../../nodes';
import { pascalCase } from '../../../shared';
import { Fragment, fragmentFromTemplate, mergeFragments } from './common';
import { getInstructionAccountMetaFragment } from './instructionAccountMeta';
import { getInstructionAccountTypeParamFragment } from './instructionAccountTypeParam';

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
  const accountTypeParamsFragment = mergeFragments(
    instructionNode.accounts.map((account) =>
      getInstructionAccountTypeParamFragment(account, programNode)
    ),
    (renders) => renders.join(', ')
  );
  const accountMetasFragment = mergeFragments(
    instructionNode.accounts.map(getInstructionAccountMetaFragment),
    (renders) => renders.join(', ')
  );

  const fragment = fragmentFromTemplate('instructionType.njk', {
    instruction: instructionNode,
    program: programNode,
    hasData,
    hasAccounts,
    dataType,
    accountMetas: accountMetasFragment.render,
    accountTypeParams: accountTypeParamsFragment.render,
  })
    .mergeImportsWith(accountMetasFragment, accountTypeParamsFragment)
    .addImports('solanaInstructions', [
      'IInstruction',
      ...(hasData ? ['IInstructionWithData'] : []),
      ...(hasAccounts ? ['IInstructionWithAccounts'] : []),
    ]);

  // TODO: if link, add import for data type.

  return fragment;
}
