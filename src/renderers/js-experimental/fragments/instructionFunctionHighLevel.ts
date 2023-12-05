import * as nodes from '../../../nodes';
import { camelCase, pascalCase } from '../../../shared';
import { ResolvedInstructionInput } from '../../../visitors';
import { ContextMap } from '../ContextMap';
import { TypeManifest } from '../TypeManifest';
import {
  Fragment,
  fragment,
  fragmentFromTemplate,
  mergeFragments,
} from './common';
import { getInstructionBytesCreatedOnChainFragment } from './instructionBytesCreatedOnChain';
import { getInstructionInputResolvedFragment } from './instructionInputResolved';
import { getInstructionRemainingAccountsFragment } from './instructionRemainingAccounts';

export function getInstructionFunctionHighLevelFragment(
  instructionNode: nodes.InstructionNode,
  programNode: nodes.ProgramNode,
  renamedArgs: Map<string, string>,
  dataArgsManifest: TypeManifest,
  resolvedInputs: ResolvedInstructionInput[]
): Fragment {
  const hasAccounts = instructionNode.accounts.length > 0;
  const hasDataArgs =
    !!instructionNode.dataArgs.link ||
    instructionNode.dataArgs.struct.fields.filter(
      (field) => field.defaultsTo?.strategy !== 'omitted'
    ).length > 0;
  const hasExtraArgs =
    !!instructionNode.extraArgs.link ||
    instructionNode.extraArgs.struct.fields.filter(
      (field) => field.defaultsTo?.strategy !== 'omitted'
    ).length > 0;
  const hasAnyArgs = hasDataArgs || hasExtraArgs;
  const argsTypeFragment = fragment(
    instructionNode.dataArgs.link
      ? dataArgsManifest.looseType.render
      : `${pascalCase(instructionNode.dataArgs.name)}Args`
  );
  if (instructionNode.dataArgs.link) {
    argsTypeFragment.mergeImportsWith(dataArgsManifest.looseType);
  }

  const functionName = camelCase(instructionNode.name);
  const typeParamsFragment = getTypeParams(instructionNode, programNode);
  const instructionTypeFragment = getInstructionType(instructionNode, false);
  const instructionTypeWithSignersFragment = getInstructionType(
    instructionNode,
    true
  );
  const inputTypeFragment = getInputType(instructionNode, false);
  const inputTypeWithSignersFragment = getInputType(instructionNode, true);
  const customGeneratedInstruction = `CustomGeneratedInstruction<${instructionTypeFragment.render}, TReturn>`;
  const renamedArgsText = [...renamedArgs.entries()]
    .map(([k, v]) => `${k}: input.${v}`)
    .join(', ');

  const resolvedInputsFragment = getInstructionInputResolvedFragment(
    instructionNode,
    resolvedInputs
  );
  const remainingAccountsFragment =
    getInstructionRemainingAccountsFragment(instructionNode);
  const bytesCreatedOnChainFragment =
    getInstructionBytesCreatedOnChainFragment(instructionNode);

  const context = new ContextMap()
    .add('getProgramAddress')
    .mergeWith(
      resolvedInputsFragment.interfaces,
      remainingAccountsFragment.interfaces,
      bytesCreatedOnChainFragment.interfaces
    );
  const contextFragment = context.toFragment();
  const functionFragment = fragmentFromTemplate(
    'instructionFunctionHighLevel.njk',
    {
      instruction: instructionNode,
      program: programNode,
      hasAccounts,
      hasDataArgs,
      hasExtraArgs,
      hasAnyArgs,
      argsType: argsTypeFragment,
      functionName,
      typeParams: typeParamsFragment,
      instructionType: instructionTypeFragment,
      instructionTypeWithSigners: instructionTypeWithSignersFragment,
      inputType: inputTypeFragment,
      inputTypeWithSigners: inputTypeWithSignersFragment,
      context: contextFragment,
      renamedArgs: renamedArgsText,
      resolvedInputs: resolvedInputsFragment,
      remainingAccounts: remainingAccountsFragment,
      bytesCreatedOnChain: bytesCreatedOnChainFragment,
      customGeneratedInstruction,
    }
  )
    .mergeImportsWith(
      typeParamsFragment,
      instructionTypeFragment,
      instructionTypeWithSignersFragment,
      inputTypeFragment,
      inputTypeWithSignersFragment,
      contextFragment,
      resolvedInputsFragment,
      remainingAccountsFragment,
      bytesCreatedOnChainFragment,
      argsTypeFragment
    )
    .addImports('solanaAddresses', ['Address'])
    .addImports('solanaSigners', ['IInstructionWithSigners'])
    .addImports('shared', [
      'CustomGeneratedInstruction',
      'IInstructionWithBytesCreatedOnChain',
    ]);

  if (hasAccounts) {
    functionFragment
      .addImports('solanaInstructions', ['IAccountMeta'])
      .addImports('shared', ['getAccountMetasWithSigners', 'ResolvedAccount']);
  }

  return functionFragment;
}

function getTypeParams(
  instructionNode: nodes.InstructionNode,
  programNode: nodes.ProgramNode
): Fragment {
  const typeParams = [
    ...instructionNode.accounts.map(
      (account) => `TAccount${pascalCase(account.name)} extends string`
    ),
    `TProgram extends string = "${programNode.publicKey}"`,
  ];
  return fragment(typeParams.filter((x) => !!x).join(', '));
}

function getInstructionType(
  instructionNode: nodes.InstructionNode,
  withSigners: boolean
): Fragment {
  const instructionTypeName = pascalCase(
    `${instructionNode.name}Instruction${withSigners ? 'WithSigners' : ''}`
  );
  const accountTypeParamsFragments = instructionNode.accounts.map((account) => {
    const typeParam = `TAccount${pascalCase(account.name)}`;
    const camelName = camelCase(account.name);

    if (account.isSigner === false) {
      return fragment(typeParam);
    }

    const signerRole = account.isWritable
      ? 'WritableSignerAccount'
      : 'ReadonlySignerAccount';
    const signerTypeFragment = fragment(
      `${signerRole}<${typeParam}> & IAccountSignerMeta<${typeParam}>`
    )
      .addImports('solanaInstructions', [signerRole])
      .addImports('solanaSigners', ['IAccountSignerMeta']);

    if (account.isSigner === 'either') {
      return signerTypeFragment.mapRender(
        (r) =>
          `typeof input["${camelName}"] extends TransactionSigner<${typeParam}> ? ${r} : ${typeParam}`
      );
    }

    return signerTypeFragment;
  });

  return mergeFragments(
    [fragment('TProgram'), ...accountTypeParamsFragments],
    (renders) => renders.join(', ')
  ).mapRender((r) => `${instructionTypeName}<${r}>`);
}

function getInputType(
  instructionNode: nodes.InstructionNode,
  withSigners: boolean
): Fragment {
  const inputTypeName = pascalCase(
    `${instructionNode.name}AsyncInput${withSigners ? 'WithSigners' : ''}`
  );
  if (instructionNode.accounts.length === 0) return fragment(inputTypeName);
  const accountTypeParams = instructionNode.accounts
    .map((account) => `TAccount${pascalCase(account.name)}`)
    .join(', ');

  return fragment(`${inputTypeName}<${accountTypeParams}>`);
}
