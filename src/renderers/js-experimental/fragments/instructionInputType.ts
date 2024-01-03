import {
  InstructionArgumentNode,
  InstructionNode,
  ProgramNode,
  isNode,
} from '../../../nodes';
import { pascalCase } from '../../../shared';
import {
  ResolvedInstructionAccount,
  ResolvedInstructionArgument,
  ResolvedInstructionInput,
} from '../../../visitors';
import { ImportMap } from '../ImportMap';
import { TypeManifest } from '../TypeManifest';
import { isAsyncDefaultValue } from '../asyncHelpers';
import type { GlobalFragmentScope } from '../getRenderMapVisitor';
import { Fragment, fragment, fragmentFromTemplate } from './common';

export function getInstructionInputTypeFragment(
  scope: Pick<
    GlobalFragmentScope,
    'nameApi' | 'asyncResolvers' | 'customInstructionData'
  > & {
    instructionNode: InstructionNode;
    resolvedInputs: ResolvedInstructionInput[];
    renamedArgs: Map<string, string>;
    dataArgsManifest: TypeManifest;
    programNode: ProgramNode;
    withSigners: boolean;
    useAsync: boolean;
  }
): Fragment {
  const {
    instructionNode,
    resolvedInputs,
    renamedArgs,
    dataArgsManifest,
    programNode,
    withSigners,
    asyncResolvers,
    useAsync,
    nameApi,
    customInstructionData,
  } = scope;

  // Accounts.
  const accountImports = new ImportMap();
  const accounts = instructionNode.accounts.map((account) => {
    const typeParam = `TAccount${pascalCase(account.name)}`;
    const resolvedAccount = resolvedInputs.find(
      (input) =>
        input.kind === 'instructionAccountNode' && input.name === account.name
    ) as ResolvedInstructionAccount;
    const hasDefaultValue =
      !!resolvedAccount.defaultValue &&
      !isNode(resolvedAccount.defaultValue, [
        'identityValueNode',
        'payerValueNode',
      ]) &&
      (useAsync ||
        !isAsyncDefaultValue(resolvedAccount.defaultValue, asyncResolvers));
    const type = getAccountType(resolvedAccount, withSigners);
    accountImports.mergeWith(type);
    return {
      ...resolvedAccount,
      typeParam,
      optionalSign: hasDefaultValue || resolvedAccount.isOptional ? '?' : '',
      type: type.render,
    };
  });

  // Arg link imports.
  const customData = customInstructionData.get(instructionNode.name);
  const argLinkImports = new ImportMap();
  if (customData) {
    argLinkImports.mergeWith(dataArgsManifest.looseType);
  }

  // Arguments.
  const resolveArg = (arg: InstructionArgumentNode) => {
    const resolvedArg = resolvedInputs.find(
      (input) => input.kind === 'argument' && input.name === arg.name
    ) as ResolvedInstructionArgument | undefined;
    if (arg.defaultValue && arg.defaultValueStrategy === 'omitted') return [];
    const renamedName = renamedArgs.get(arg.name) ?? arg.name;
    const optionalSign = arg.defaultValue || resolvedArg ? '?' : '';
    return [
      {
        ...arg,
        ...resolvedArg,
        renamedName,
        optionalSign,
      },
    ];
  };
  const instructionDataName = nameApi.instructionDataType(instructionNode.name);
  const instructionExtraName = nameApi.instructionExtraType(
    instructionNode.name
  );
  const dataArgsType = customData
    ? nameApi.dataArgsType(customData.importAs)
    : nameApi.dataArgsType(instructionDataName);
  const dataArgs = customData
    ? []
    : instructionNode.arguments.flatMap(resolveArg);
  const extraArgsType = nameApi.dataArgsType(instructionExtraName);
  const extraArgs = (instructionNode.extraArguments ?? []).flatMap(resolveArg);

  const syncInputType = withSigners
    ? nameApi.instructionSyncInputWithSignersType(instructionNode.name)
    : nameApi.instructionSyncInputType(instructionNode.name);
  const asyncInputType = withSigners
    ? nameApi.instructionAsyncInputWithSignersType(instructionNode.name)
    : nameApi.instructionAsyncInputType(instructionNode.name);
  const instructionInputType = useAsync ? asyncInputType : syncInputType;

  return fragmentFromTemplate('instructionInputType.njk', {
    instruction: instructionNode,
    program: programNode,
    instructionInputType,
    accounts,
    dataArgs,
    dataArgsType,
    extraArgs,
    extraArgsType,
  })
    .mergeImportsWith(accountImports, argLinkImports)
    .addImports('solanaAddresses', ['Address']);
}

function getAccountType(
  account: ResolvedInstructionAccount,
  withSigners: boolean
): Fragment {
  const typeParam = `TAccount${pascalCase(account.name)}`;

  if (withSigners) {
    if (account.isPda && account.isSigner === false) {
      return fragment(`ProgramDerivedAddress<${typeParam}>`).addImports(
        'solanaAddresses',
        ['ProgramDerivedAddress']
      );
    }

    if (account.isPda && account.isSigner === 'either') {
      return fragment(
        `ProgramDerivedAddress<${typeParam}> | TransactionSigner<${typeParam}>`
      )
        .addImports('solanaAddresses', ['ProgramDerivedAddress'])
        .addImports('solanaSigners', ['TransactionSigner']);
    }

    if (account.isSigner === 'either') {
      return fragment(`Address<${typeParam}> | TransactionSigner<${typeParam}>`)
        .addImports('solanaAddresses', ['Address'])
        .addImports('solanaSigners', ['TransactionSigner']);
    }

    if (account.isSigner) {
      return fragment(`TransactionSigner<${typeParam}>`).addImports(
        'solanaSigners',
        ['TransactionSigner']
      );
    }
  }

  if (!withSigners && account.isPda) {
    return fragment(`ProgramDerivedAddress<${typeParam}>`).addImports(
      'solanaAddresses',
      ['ProgramDerivedAddress']
    );
  }

  return fragment(`Address<${typeParam}>`).addImports('solanaAddresses', [
    'Address',
  ]);
}
