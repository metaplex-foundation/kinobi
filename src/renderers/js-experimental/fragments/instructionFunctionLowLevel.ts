import * as nodes from '../../../nodes';
import { pascalCase } from '../../../shared';
import { ImportMap } from '../ImportMap';
import { TypeManifest } from '../TypeManifest';
import { Fragment, fragmentFromTemplate, mergeFragments } from './common';
import { getInstructionAccountTypeParamFragment } from './instructionAccountTypeParam';

export function getInstructionFunctionLowLevelFragment(
  instructionNode: nodes.InstructionNode,
  programNode: nodes.ProgramNode,
  dataArgsManifest: TypeManifest
): Fragment {
  const imports = new ImportMap();
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
  const argsType = instructionNode.dataArgs.link
    ? dataArgsManifest.looseType.render
    : `${pascalCase(instructionNode.dataArgs.name)}Args`;
  const encoderFunction = instructionNode.dataArgs.link
    ? dataArgsManifest.encoder.render
    : `get${pascalCase(instructionNode.dataArgs.name)}Encoder()`;
  if (instructionNode.dataArgs.link) {
    imports.mergeWith(dataArgsManifest.looseType, dataArgsManifest.encoder);
  }

  const accountTypeParamsFragment = mergeFragments(
    instructionNode.accounts.map((account) =>
      getInstructionAccountTypeParamFragment(
        instructionNode,
        account,
        programNode,
        true
      )
    ),
    (renders) => renders.join(', ')
  );

  const accounts = instructionNode.accounts.map((account) => {
    const typeParam = `TAccount${pascalCase(account.name)}`;
    const defaultValue = getDefaultValue(
      account,
      programNode,
      instructionNode.optionalAccountStrategy === 'omitted'
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

  const fragment = fragmentFromTemplate('instructionFunctionLowLevel.njk', {
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
    .mergeImportsWith(imports, accountTypeParamsFragment)
    .addImports('solanaAddresses', ['Base58EncodedAddress'])
    .addImports('solanaInstructions', ['IAccountMeta']);

  if (hasAccounts) {
    fragment
      .addImports('shared', ['accountMetaWithDefault'])
      .addImports('solanaInstructions', ['AccountRole']);
  }

  return fragment;
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
