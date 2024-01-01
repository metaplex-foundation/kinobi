import {
  InstructionAccountNode,
  InstructionNode,
  ProgramNode,
  isNode,
} from '../../../nodes';
import { LinkableDictionary, pascalCase } from '../../../shared';
import { ImportMap } from '../ImportMap';
import { TypeManifest } from '../TypeManifest';
import { NameApi } from '../nameTransformers';
import {
  Fragment,
  fragment,
  fragmentFromTemplate,
  mergeFragments,
} from './common';
import { getInstructionAccountTypeParamFragment } from './instructionAccountTypeParam';

export function getInstructionFunctionLowLevelFragment(scope: {
  instructionNode: InstructionNode;
  programNode: ProgramNode;
  dataArgsManifest: TypeManifest;
  nameApi: NameApi;
  linkables: LinkableDictionary;
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
  const defaultsTo = account.defaultsTo ?? null;
  if (account.isOptional || isNode(defaultsTo, 'programIdValueNode')) {
    return fragment(
      `{ address: "${program.publicKey}" as Address<"${program.publicKey}">, role: AccountRole.READONLY }`
    );
  }
  if (isNode(defaultsTo, 'publicKeyValueNode')) {
    return fragment(
      `"${defaultsTo.publicKey}" as Address<"${defaultsTo.publicKey}">`
    );
  }
  if (isNode(defaultsTo, 'programLinkNode')) {
    const programAddress = nameApi.programAddressConstant(defaultsTo.name);
    const importFrom = defaultsTo.importFrom ?? 'generatedPrograms';
    return fragment(
      `{ address: ${programAddress}, role: AccountRole.READONLY }`
    ).addImports(importFrom, programAddress);
  }
  return fragment('');
}
