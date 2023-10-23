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
  const lowLevelFunctionName = `${functionName}Instruction`;
  const typeParamsFragment = getTypeParams(instructionNode, programNode);
  const instructionTypeFragment = getInstructionType(instructionNode);
  const inputTypeFragment = getInputType(instructionNode);
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
      lowLevelFunctionName,
      typeParams: typeParamsFragment,
      instructionType: instructionTypeFragment,
      inputType: inputTypeFragment,
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
      inputTypeFragment,
      contextFragment,
      resolvedInputsFragment,
      remainingAccountsFragment,
      bytesCreatedOnChainFragment,
      argsTypeFragment
    )
    .addImports('solanaAddresses', ['Base58EncodedAddress'])
    .addImports('shared', ['CustomGeneratedInstruction', 'WrappedInstruction']);

  if (hasAccounts) {
    functionFragment
      .addImports('solanaInstructions', ['IAccountMeta'])
      .addImports('shared', ['getAccountMetasAndSigners', 'ResolvedAccount']);
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

function getInstructionType(instructionNode: nodes.InstructionNode): Fragment {
  const instructionTypeName = pascalCase(`${instructionNode.name}Instruction`);
  const accountTypeParamsFragments = instructionNode.accounts.map((account) => {
    const typeParam = `TAccount${pascalCase(account.name)}`;
    const camelName = camelCase(account.name);
    if (account.isSigner === 'either') {
      const role = account.isWritable
        ? 'WritableSignerAccount'
        : 'ReadonlySignerAccount';
      return fragment(
        `typeof input["${camelName}"] extends Signer<${typeParam}> ? ${role}<${typeParam}> : ${typeParam}`
      ).addImports('solanaInstructions', [role]);
    }

    return fragment(typeParam);
  });

  return mergeFragments(
    [fragment('TProgram'), ...accountTypeParamsFragments],
    (renders) => renders.join(', ')
  ).mapRender((r) => `${instructionTypeName}<${r}>`);
}

function getInputType(instructionNode: nodes.InstructionNode): Fragment {
  const inputTypeName = pascalCase(`${instructionNode.name}Input`);
  if (instructionNode.accounts.length === 0) return fragment(inputTypeName);
  const accountTypeParams = instructionNode.accounts
    .map((account) => `TAccount${pascalCase(account.name)}`)
    .join(', ');

  return fragment(`${inputTypeName}<${accountTypeParams}>`);
}
