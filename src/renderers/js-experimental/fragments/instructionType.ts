import * as nodes from '../../../nodes';
import { pascalCase } from '../../../shared';
import { Fragment, fragmentFromTemplate, mergeFragments } from './common';
import { getInstructionAccountMetaFragment } from './instructionAccountMeta';
import { getInstructionAccountTypeParamFragment } from './instructionAccountTypeParam';

export function getInstructionTypeFragment(
  instructionNode: nodes.InstructionNode,
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
      getInstructionAccountTypeParamFragment(
        instructionNode,
        account,
        programNode
      )
    ),
    (renders) => renders.join(', ')
  );
  const usesOmmitableAccounts =
    instructionNode.optionalAccountStrategy === 'omitted';
  const accountMetasFragment = mergeFragments(
    instructionNode.accounts.map((account) =>
      getInstructionAccountMetaFragment(account).mapRender((r) => {
        const typeParam = `TAccount${pascalCase(account.name)}`;
        const isOmmitable = account.isOptional && usesOmmitableAccounts;
        const type = `${typeParam} extends string ? ${r} : ${typeParam}`;
        if (!isOmmitable) return type;
        return `...(${typeParam} extends undefined ? [] : [${type}])`;
      })
    ),
    (renders) => renders.join(', ')
  );

  const fragment = fragmentFromTemplate('instructionType.njk', {
    instruction: instructionNode,
    program: programNode,
    hasData,
    hasAccounts,
    dataType,
    accountTypeParams: accountTypeParamsFragment.render,
    accountMetas: accountMetasFragment.render,
  })
    .mergeImportsWith(accountTypeParamsFragment, accountMetasFragment)
    .addImports('solanaInstructions', [
      'IAccountMeta',
      'IInstruction',
      ...(hasData ? ['IInstructionWithData'] : []),
      ...(hasAccounts ? ['IInstructionWithAccounts'] : []),
    ]);

  // TODO: if link, add import for data type. Unless we don't need to inject the data type in IInstructionWithData.

  return fragment;
}
