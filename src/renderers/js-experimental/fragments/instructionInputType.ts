import * as nodes from '../../../nodes';
import { pascalCase } from '../../../shared';
import {
  ResolvedInstructionAccount,
  ResolvedInstructionArg,
  ResolvedInstructionInput,
} from '../../../visitors';
import { ImportMap } from '../ImportMap';
import { TypeManifest } from '../TypeManifest';
import { Fragment, fragment, fragmentFromTemplate } from './common';

export function getInstructionInputTypeFragment(
  instructionNode: nodes.InstructionNode,
  resolvedInputs: ResolvedInstructionInput[],
  renamedArgs: Map<string, string>,
  dataArgsManifest: TypeManifest,
  extraArgsManifest: TypeManifest,
  programNode: nodes.ProgramNode
): Fragment {
  // Accounts.
  const accountImports = new ImportMap();
  const accounts = instructionNode.accounts.map((account) => {
    const typeParam = `TAccount${pascalCase(account.name)}`;
    const resolvedAccount = resolvedInputs.find(
      (input) => input.kind === 'account' && input.name === account.name
    ) as ResolvedInstructionAccount;
    const optionalSign =
      !!resolvedAccount.defaultsTo || resolvedAccount.isOptional ? '?' : '';
    const type = getAccountType(resolvedAccount);
    accountImports.mergeWith(type);
    return {
      ...resolvedAccount,
      typeParam,
      optionalSign,
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
  })
    .mergeImportsWith(accountImports, argLinkImports)
    .addImports('solanaAddresses', ['Base58EncodedAddress']);
}

function getAccountType(account: ResolvedInstructionAccount): Fragment {
  const typeParam = `TAccount${pascalCase(account.name)}`;
  if (account.isPda && account.isSigner === false) {
    return fragment(`ProgramDerivedAddress<${typeParam}>`).addImports(
      'solanaAddresses',
      ['ProgramDerivedAddress']
    );
  }

  if (account.isPda && account.isSigner === 'either') {
    return fragment(
      `ProgramDerivedAddress<${typeParam}> | Signer<${typeParam}>`
    )
      .addImports('solanaAddresses', ['ProgramDerivedAddress'])
      .addImports('shared', ['Signer']);
  }

  if (account.isSigner === 'either') {
    return fragment(`Base58EncodedAddress<${typeParam}> | Signer<${typeParam}>`)
      .addImports('solanaAddresses', ['Base58EncodedAddress'])
      .addImports('shared', ['Signer']);
  }

  if (account.isSigner) {
    return fragment(`Signer<${typeParam}>`).addImports('shared', ['Signer']);
  }

  return fragment(`Base58EncodedAddress<${typeParam}>`).addImports(
    'solanaAddresses',
    ['Base58EncodedAddress']
  );
}
