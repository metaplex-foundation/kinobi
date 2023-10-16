import * as nodes from '../../../nodes';
import { pascalCase } from '../../../shared';
import { Fragment, fragmentFromTemplate, mergeFragments } from './common';
import { getInstructionAccountTypeParamFragment } from './instructionAccountTypeParam';

export function getInstructionFunctionLowLevelFragment(
  instructionNode: nodes.InstructionNode,
  programNode: nodes.ProgramNode
): Fragment {
  const hasAccounts = instructionNode.accounts.length > 0;
  const hasOmmitableAccounts =
    instructionNode.optionalAccountStrategy === 'omitted' &&
    instructionNode.accounts.some((account) => account.isOptional);
  const hasData =
    !!instructionNode.dataArgs.link ||
    instructionNode.dataArgs.struct.fields.length > 0;
  const hasArgs =
    !!instructionNode.dataArgs.link ||
    instructionNode.dataArgs.struct.fields.filter(
      (field) => field.defaultsTo?.strategy !== 'omitted'
    ).length > 0;
  const dataType = instructionNode.dataArgs.link
    ? pascalCase(instructionNode.dataArgs.link.name)
    : pascalCase(instructionNode.dataArgs.name);
  const argsType = `${dataType}Args`;
  const encoderFunction = `get${dataType}Encoder`;
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

  const accounts = instructionNode.accounts.map((account) => {
    const typeParam = `TAccount${pascalCase(account.name)}`;

    return {
      ...account,
      typeParam,
      defaultRole: getDefaultRole(account),
    };
  });

  return fragmentFromTemplate('instructionFunctionLowLevel.njk', {
    instruction: instructionNode,
    program: programNode,
    hasAccounts,
    hasOmmitableAccounts,
    accounts,
    hasData,
    hasArgs,
    argsType,
    encoderFunction,
    accountTypeParams: accountTypeParamsFragment.render,
  })
    .mergeImportsWith(accountTypeParamsFragment)
    .addImports('shared', ['accountMetaWithDefault'])
    .addImports('solanaAddresses', ['Base58EncodedAddress'])
    .addImports('solanaInstructions', [
      ...(hasAccounts ? ['AccountRole'] : []),
    ]);
}

function getDefaultRole(account: nodes.InstructionAccountNode): string {
  if (account.isSigner === true && account.isWritable)
    return 'AccountRole.WRITABLE_SIGNER';
  if (account.isSigner === true) return 'AccountRole.READONLY_SIGNER';
  if (account.isWritable) return 'AccountRole.WRITABLE';
  return 'AccountRole.READONLY';
}
