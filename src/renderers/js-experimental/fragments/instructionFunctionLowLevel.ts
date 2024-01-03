import {
  InstructionAccountNode,
  InstructionNode,
  ProgramNode,
  isNode,
} from '../../../nodes';
import { pascalCase } from '../../../shared';
import { ImportMap } from '../ImportMap';
import { TypeManifest } from '../TypeManifest';
import type { GlobalFragmentScope } from '../getRenderMapVisitor';
import { NameApi } from '../nameTransformers';
import {
  Fragment,
  fragment,
  fragmentFromTemplate,
  mergeFragments,
} from './common';
import { getInstructionAccountTypeParamFragment } from './instructionAccountTypeParam';

export function getInstructionFunctionLowLevelFragment(
  scope: Pick<
    GlobalFragmentScope,
    'nameApi' | 'linkables' | 'customInstructionData'
  > & {
    instructionNode: InstructionNode;
    programNode: ProgramNode;
    dataArgsManifest: TypeManifest;
  }
): Fragment {
  const {
    instructionNode,
    programNode,
    dataArgsManifest,
    nameApi,
    customInstructionData,
  } = scope;
  const imports = new ImportMap();
  const hasAccounts = instructionNode.accounts.length > 0;
  const hasLegacyOptionalAccounts =
    instructionNode.optionalAccountStrategy === 'omitted' &&
    instructionNode.accounts.some((account) => account.isOptional);
  const customData = customInstructionData.get(instructionNode.name);
  const hasData =
    !!customData || instructionNode.dataArgs.dataArguments.length > 0;
  const hasArgs =
    !!customData ||
    instructionNode.dataArgs.dataArguments.filter(
      (field) => !field.defaultValue || field.defaultValueStrategy !== 'omitted'
    ).length > 0;
  const instructionDataName = nameApi.instructionDataType(instructionNode.name);
  const argsType = customData
    ? dataArgsManifest.looseType.render
    : nameApi.dataArgsType(instructionDataName);
  const encoderFunction = customData
    ? dataArgsManifest.encoder.render
    : `${nameApi.encoderFunction(instructionDataName)}()`;
  if (customData) {
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
    const defaultValueFragment = getDefaultValue(
      account,
      programNode,
      nameApi,
      instructionNode.optionalAccountStrategy === 'omitted'
    );
    imports.mergeWith(defaultValueFragment);
    const defaultValue = defaultValueFragment.render || null;
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
    .addImports('solanaInstructions', ['IAccountMeta'])
    .addImports('shared', hasAccounts ? ['accountMetaWithDefault'] : [])
    .addImports('solanaInstructions', hasAccounts ? ['AccountRole'] : []);
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
  nameApi: NameApi,
  usesLegacyOptionalAccounts: boolean
): Fragment {
  if (account.isOptional && usesLegacyOptionalAccounts) {
    return fragment('');
  }
  const defaultValue = account.defaultValue ?? null;
  if (account.isOptional || isNode(defaultValue, 'programIdValueNode')) {
    return fragment(
      `{ address: "${program.publicKey}" as Address<"${program.publicKey}">, role: AccountRole.READONLY }`
    );
  }
  if (isNode(defaultValue, 'publicKeyValueNode')) {
    return fragment(
      `"${defaultValue.publicKey}" as Address<"${defaultValue.publicKey}">`
    );
  }
  if (isNode(defaultValue, 'programLinkNode')) {
    const programAddress = nameApi.programAddressConstant(defaultValue.name);
    const importFrom = defaultValue.importFrom ?? 'generatedPrograms';
    return fragment(
      `{ address: ${programAddress}, role: AccountRole.READONLY }`
    ).addImports(importFrom, programAddress);
  }
  return fragment('');
}
