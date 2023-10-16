import * as nodes from '../../../nodes';
import { pascalCase } from '../../../shared';
import { Fragment, fragmentFromTemplate, mergeFragments } from './common';
import { getInstructionAccountTypeParamFragment } from './instructionAccountTypeParam';

export function getInstructionFunctionLowLevelFragment(
  instructionNode: nodes.InstructionNode,
  programNode: nodes.ProgramNode
): Fragment {
  const hasAccounts = instructionNode.accounts.length > 0;
  const hasLegacyOptionalAccounts =
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
    const defaultValue = getDefaultValue(
      account,
      programNode,
      hasLegacyOptionalAccounts
    );
    const isOptionalOrHasLowLevelDefaultValues =
      account.isOptional || defaultValue !== null;

    return {
      ...account,
      typeParam,
      defaultRole: getDefaultRole(account),
      defaultValue,
      isOptionalOrHasLowLevelDefaultValues,
    };
  });

  return fragmentFromTemplate('instructionFunctionLowLevel.njk', {
    instruction: instructionNode,
    program: programNode,
    hasAccounts,
    hasLegacyOptionalAccounts,
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
  if (account.isSigner === true && account.isWritable) {
    return 'AccountRole.WRITABLE_SIGNER';
  }
  if (account.isSigner === true) {
    return 'AccountRole.READONLY_SIGNER';
  }
  if (account.isWritable) {
    return 'AccountRole.WRITABLE';
  }
  return 'AccountRole.READONLY';
}

function getDefaultValue(
  account: nodes.InstructionAccountNode,
  program: nodes.ProgramNode,
  usesLegacyOptionalAccounts: boolean
): string | null {
  if (account.isOptional && usesLegacyOptionalAccounts) {
    return null;
  }
  if (account.isOptional || account.defaultsTo?.kind === 'programId') {
    return `{ address: "${program.publicKey}" as Base58EncodedAddress<"${program.publicKey}">, role: AccountRole.READONLY }`;
  }
  if (account.defaultsTo?.kind === 'program') {
    return `{ address: "${account.defaultsTo.program.publicKey}" as Base58EncodedAddress<"${account.defaultsTo.program.publicKey}">, role: AccountRole.READONLY }`;
  }
  if (account.defaultsTo?.kind === 'publicKey') {
    return `"${account.defaultsTo.publicKey}"`;
  }
  return null;
}
