import * as nodes from '../../../nodes';
import { camelCase, pascalCase } from '../../../shared';
import { ResolvedInstructionInput } from '../../../visitors';
import { ContextMap } from '../ContextMap';
import { TypeManifest } from '../TypeManifest';
import { hasAsyncDefaultValues } from '../asyncHelpers';
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
  resolvedInputs: ResolvedInstructionInput[],
  useAsync: boolean
): Fragment {
  if (useAsync && !hasAsyncDefaultValues(resolvedInputs)) {
    return fragment('');
  }

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

  const functionName = `get${pascalCase(instructionNode.name)}Instruction${
    useAsync ? 'Async' : ''
  }`;
  const lowLevelFunctionName = `get${pascalCase(
    instructionNode.name
  )}InstructionRaw`;
  const typeParamsFragment = getTypeParams(instructionNode, programNode);
  const instructionTypeFragment = getInstructionType(instructionNode, false);
  const instructionTypeWithSignersFragment = getInstructionType(
    instructionNode,
    true
  );
  const wrapInPromiseIfAsync = (value: string) =>
    useAsync ? `Promise<${value}>` : value;
  const inputTypeFragment = getInputType(instructionNode, false, useAsync);
  const inputTypeWithSignersFragment = getInputType(
    instructionNode,
    true,
    useAsync
  );
  const renamedArgsText = [...renamedArgs.entries()]
    .map(([k, v]) => `${k}: input.${v}`)
    .join(', ');

  const resolvedInputsFragment = getInstructionInputResolvedFragment(
    instructionNode,
    resolvedInputs,
    useAsync
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
      instructionTypeWithSigners: instructionTypeWithSignersFragment,
      inputType: inputTypeFragment,
      inputTypeWithSigners: inputTypeWithSignersFragment,
      context: contextFragment,
      renamedArgs: renamedArgsText,
      resolvedInputs: resolvedInputsFragment,
      remainingAccounts: remainingAccountsFragment,
      bytesCreatedOnChain: bytesCreatedOnChainFragment,
      useAsync,
      wrapInPromiseIfAsync,
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
    .addImports('solanaAddresses', ['Address']);

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
  withSigners: boolean,
  useAsync: boolean
): Fragment {
  const inputTypeName = pascalCase(
    `${instructionNode.name}${useAsync ? 'Async' : ''}Input${
      withSigners ? 'WithSigners' : ''
    }`
  );
  if (instructionNode.accounts.length === 0) return fragment(inputTypeName);
  const accountTypeParams = instructionNode.accounts
    .map((account) => `TAccount${pascalCase(account.name)}`)
    .join(', ');

  return fragment(`${inputTypeName}<${accountTypeParams}>`);
}
