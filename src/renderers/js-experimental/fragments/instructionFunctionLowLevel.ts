import {
  InstructionAccountNode,
  InstructionNode,
  ProgramNode,
  isNode,
} from '../../../nodes';
import { pascalCase } from '../../../shared';
import { ImportMap } from '../ImportMap';
import { TypeManifest } from '../TypeManifest';
import { NameApi } from '../nameTransformers';
import { Fragment, fragmentFromTemplate, mergeFragments } from './common';
import { getInstructionAccountTypeParamFragment } from './instructionAccountTypeParam';

export function getInstructionFunctionLowLevelFragment(scope: {
  instructionNode: InstructionNode;
  programNode: ProgramNode;
  dataArgsManifest: TypeManifest;
  nameApi: NameApi;
}): Fragment {
  const { instructionNode, programNode, dataArgsManifest, nameApi } = scope;
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
    : nameApi.dataArgsType(instructionNode.dataArgs.name);
  const encoderFunction = instructionNode.dataArgs.link
    ? dataArgsManifest.encoder.render
    : `${nameApi.encoderFunction(instructionNode.dataArgs.name)}()`;
  if (instructionNode.dataArgs.link) {
    imports.mergeWith(dataArgsManifest.looseType, dataArgsManifest.encoder);
  }

  const accountTypeParamsFragment = mergeFragments(
    instructionNode.accounts.map((account) =>
      getInstructionAccountTypeParamFragment({
        ...scope,
        instructionAccountNode: account,
        allowAccountMeta: true,
      })
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
    functionName: nameApi.instructionRawFunction(instructionNode.name),
    instructionType: nameApi.instructionType(instructionNode.name),
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
    .addImports('solanaAddresses', ['Address'])
    .addImports('solanaInstructions', ['IAccountMeta']);

  if (hasAccounts) {
    fragment
      .addImports('shared', ['accountMetaWithDefault'])
      .addImports('solanaInstructions', ['AccountRole']);
  }

  return fragment;
}

function getDefaultRole(account: InstructionAccountNode): string {
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
  account: InstructionAccountNode,
  program: ProgramNode,
  usesLegacyOptionalAccounts: boolean
): string | null {
  if (account.isOptional && usesLegacyOptionalAccounts) {
    return null;
  }
  const defaultsTo = account.defaultsTo ?? null;
  if (account.isOptional || isNode(defaultsTo, 'programIdValueNode')) {
    return `{ address: "${program.publicKey}" as Address<"${program.publicKey}">, role: AccountRole.READONLY }`;
  }
  if (isNode(defaultsTo, 'publicKeyValueNode')) {
    return `"${defaultsTo.publicKey}"`;
  }
  if (isNode(defaultsTo, 'program')) {
    return `{ address: "${defaultsTo.program.publicKey}" as Address<"${defaultsTo.program.publicKey}">, role: AccountRole.READONLY }`;
  }
  return null;
}
