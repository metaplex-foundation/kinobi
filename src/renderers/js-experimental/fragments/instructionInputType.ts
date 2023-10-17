import * as nodes from '../../../nodes';
import { pascalCase } from '../../../shared';
import {
  ResolvedInstructionAccount,
  ResolvedInstructionInput,
} from '../../../visitors';
import { ImportMap } from '../ImportMap';
import { Fragment, fragment, fragmentFromTemplate } from './common';

export function getInstructionInputTypeFragment(
  instructionNode: nodes.InstructionNode,
  resolvedInputs: ResolvedInstructionInput[],
  programNode: nodes.ProgramNode
): Fragment {
  const hasAccounts = instructionNode.accounts.length > 0;
  const hasData =
    !!instructionNode.dataArgs.link ||
    instructionNode.dataArgs.struct.fields.length > 0;

  const accountImports = new ImportMap();
  const accounts = instructionNode.accounts.map((account) => {
    const typeParam = `TAccount${pascalCase(account.name)}`;
    const optionalSign = !!account.defaultsTo || account.isOptional ? '?' : '';
    const resolvedAccount = resolvedInputs.find(
      (input) => input.kind === 'account' && input.name === account.name
    ) as ResolvedInstructionAccount;
    const type = getAccountType(resolvedAccount);
    accountImports.mergeWith(type);

    return {
      ...resolvedAccount,
      typeParam,
      optionalSign,
      type: type.render,
    };
  });

  return fragmentFromTemplate('instructionInputType.njk', {
    instruction: instructionNode,
    program: programNode,
    hasAccounts,
    accounts,
    hasData,
  })
    .mergeImportsWith(accountImports)
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
