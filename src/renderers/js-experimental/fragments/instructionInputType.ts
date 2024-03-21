import {
  InstructionArgumentNode,
  InstructionNode,
  ProgramNode,
  getAllInstructionArguments,
  isNode,
} from '../../../nodes';
import { camelCase, pascalCase } from '../../../shared';
import {
  ResolvedInstructionAccount,
  ResolvedInstructionArgument,
  ResolvedInstructionInput,
} from '../../../visitors';
import { ImportMap } from '../ImportMap';
import { TypeManifest } from '../TypeManifest';
import { isAsyncDefaultValue } from '../asyncHelpers';
import type { GlobalFragmentScope } from '../getRenderMapVisitor';
import {
  Fragment,
  fragment,
  fragmentFromTemplate,
  mergeFragments,
} from './common';

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
    useAsync: boolean;
  }
): Fragment {
  const {
    instructionNode,
    resolvedInputs,
    renamedArgs,
    dataArgsManifest,
    programNode,
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
    const type = getAccountType(resolvedAccount);
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
      (input) =>
        isNode(input, 'instructionArgumentNode') && input.name === arg.name
    ) as ResolvedInstructionArgument | undefined;
    if (arg.defaultValue && arg.defaultValueStrategy === 'omitted') return [];
    const renamedName = renamedArgs.get(arg.name) ?? arg.name;
    const optionalSign =
      arg.defaultValue || resolvedArg?.defaultValue ? '?' : '';
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
  const instructionInputType = useAsync
    ? nameApi.instructionAsyncInputType(instructionNode.name)
    : nameApi.instructionSyncInputType(instructionNode.name);

  // Remaining accounts.
  const remainingAccountsFragment =
    getRemainingAccountsFragment(instructionNode);

  return fragmentFromTemplate('instructionInputType.njk', {
    instruction: instructionNode,
    program: programNode,
    instructionInputType,
    accounts,
    dataArgs,
    dataArgsType,
    extraArgs,
    extraArgsType,
    remainingAccountsFragment,
  })
    .mergeImportsWith(accountImports, argLinkImports, remainingAccountsFragment)
    .addImports('solanaAddresses', ['Address']);
}

function getAccountType(
  account: Pick<ResolvedInstructionAccount, 'name' | 'isPda' | 'isSigner'>
): Fragment {
  const typeParam = `TAccount${pascalCase(account.name)}`;

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

  return fragment(`Address<${typeParam}>`).addImports('solanaAddresses', [
    'Address',
  ]);
}

function getRemainingAccountsFragment(
  instructionNode: InstructionNode
): Fragment {
  const fragments = (instructionNode.remainingAccounts ?? []).flatMap(
    (remainingAccountsNode) => {
      if (isNode(remainingAccountsNode.value, 'resolverValueNode')) return [];

      const { name } = remainingAccountsNode.value;
      const allArguments = getAllInstructionArguments(instructionNode);
      const argumentExists = allArguments.some((arg) => arg.name === name);
      if (argumentExists) return [];

      const isSigner = remainingAccountsNode.isSigner ?? false;
      const optionalSign = remainingAccountsNode.isOptional ?? false ? '?' : '';
      const signerFragment = fragment(`TransactionSigner`).addImports(
        'solanaSigners',
        ['TransactionSigner']
      );
      const addressFragment = fragment(`Address`).addImports(
        'solanaAddresses',
        ['Address']
      );
      return (() => {
        if (isSigner === 'either') {
          return mergeFragments([signerFragment, addressFragment], (r) =>
            r.join(' | ')
          );
        }
        return isSigner ? signerFragment : addressFragment;
      })().mapRender((r) => `${camelCase(name)}${optionalSign}: Array<${r}>;`);
    }
  );

  return mergeFragments(fragments, (r) => r.join('\n'));
}
