import * as nodes from '../../../nodes';
import { pascalCase } from '../../../shared';
import {
  ResolvedInstructionAccount,
  ResolvedInstructionArg,
  ResolvedInstructionInput,
} from '../../../visitors';
import { ImportMap } from '../ImportMap';
import { TypeManifest } from '../TypeManifest';
import { isAsyncDefaultValue } from '../asyncHelpers';
import { Fragment, fragment, fragmentFromTemplate } from './common';

export function getInstructionInputTypeFragment(scope: {
  instructionNode: nodes.InstructionNode;
  resolvedInputs: ResolvedInstructionInput[];
  renamedArgs: Map<string, string>;
  dataArgsManifest: TypeManifest;
  extraArgsManifest: TypeManifest;
  programNode: nodes.ProgramNode;
  withSigners: boolean;
  asyncResolvers: string[];
  useAsync: boolean;
}): Fragment {
  const {
    instructionNode,
    resolvedInputs,
    renamedArgs,
    dataArgsManifest,
    extraArgsManifest,
    programNode,
    withSigners,
    asyncResolvers,
    useAsync,
  } = scope;

  // Accounts.
  const accountImports = new ImportMap();
  const accounts = instructionNode.accounts.map((account) => {
    const typeParam = `TAccount${pascalCase(account.name)}`;
    const resolvedAccount = resolvedInputs.find(
      (input) => input.kind === 'account' && input.name === account.name
    ) as ResolvedInstructionAccount;
    const hasDefaultValue = useAsync
      ? !!resolvedAccount.defaultsTo
      : !!resolvedAccount.defaultsTo &&
        !isAsyncDefaultValue(resolvedAccount.defaultsTo, asyncResolvers);
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
  const argLinkImports = new ImportMap();
  if (instructionNode.dataArgs.link) {
    argLinkImports.mergeWith(dataArgsManifest.looseType);
  }
  if (instructionNode.extraArgs.link) {
    argLinkImports.mergeWith(extraArgsManifest.looseType);
  }

  // Arguments.
  const resolveArg = (arg: nodes.StructFieldTypeNode) => {
    const resolvedArg = resolvedInputs.find(
      (input) => input.kind === 'arg' && input.name === arg.name
    ) as ResolvedInstructionArg | undefined;
    if (arg.defaultsTo?.strategy === 'omitted') return [];
    const renamedName = renamedArgs.get(arg.name) ?? arg.name;
    const optionalSign = arg.defaultsTo || resolvedArg ? '?' : '';
    return [
      {
        ...arg,
        ...resolvedArg,
        renamedName,
        optionalSign,
      },
    ];
  };
  const dataArgsType = instructionNode.dataArgs.link
    ? `${pascalCase(instructionNode.dataArgs.link.name)}Args`
    : `${pascalCase(instructionNode.dataArgs.name)}Args`;
  const dataArgs = instructionNode.dataArgs.link
    ? []
    : instructionNode.dataArgs.struct.fields.flatMap(resolveArg);
  const extraArgsType = instructionNode.extraArgs.link
    ? `${pascalCase(instructionNode.extraArgs.link.name)}Args`
    : `${pascalCase(instructionNode.extraArgs.name)}Args`;
  const extraArgs = instructionNode.extraArgs.link
    ? []
    : instructionNode.extraArgs.struct.fields.flatMap(resolveArg);

  return fragmentFromTemplate('instructionInputType.njk', {
    instruction: instructionNode,
    program: programNode,
    accounts,
    dataArgs,
    dataArgsType,
    extraArgs,
    extraArgsType,
    withSigners,
    useAsync,
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
