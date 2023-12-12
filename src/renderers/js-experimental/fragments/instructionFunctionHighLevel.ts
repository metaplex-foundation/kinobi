import * as nodes from '../../../nodes';
import { camelCase, pascalCase } from '../../../shared';
import { ResolvedInstructionInput } from '../../../visitors';
import { TypeManifest } from '../TypeManifest';
import { hasAsyncFunction } from '../asyncHelpers';
import {
  Fragment,
  fragment,
  fragmentFromTemplate,
  mergeFragments,
} from './common';
import { getInstructionBytesCreatedOnChainFragment } from './instructionBytesCreatedOnChain';
import { getInstructionInputResolvedFragment } from './instructionInputResolved';
import { getInstructionInputTypeFragment } from './instructionInputType';
import { getInstructionRemainingAccountsFragment } from './instructionRemainingAccounts';

export function getInstructionFunctionHighLevelFragment(scope: {
  instructionNode: nodes.InstructionNode;
  programNode: nodes.ProgramNode;
  renamedArgs: Map<string, string>;
  dataArgsManifest: TypeManifest;
  extraArgsManifest: TypeManifest;
  resolvedInputs: ResolvedInstructionInput[];
  asyncResolvers: string[];
  useAsync: boolean;
}): Fragment {
  const {
    useAsync,
    instructionNode,
    programNode,
    resolvedInputs,
    renamedArgs,
    dataArgsManifest,
    asyncResolvers,
  } = scope;
  if (
    useAsync &&
    !hasAsyncFunction(instructionNode, resolvedInputs, asyncResolvers)
  ) {
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

  // Input.
  const inputTypeFragment = getInstructionInputTypeFragment({
    ...scope,
    withSigners: false,
  });
  const inputTypeWithSignersFragment = getInstructionInputTypeFragment({
    ...scope,
    withSigners: true,
  });
  const inputTypeCallFragment = getInputTypeCall({
    ...scope,
    withSigners: false,
  });
  const inputTypeCallWithSignersFragment = getInputTypeCall({
    ...scope,
    withSigners: true,
  });
  const renamedArgsText = [...renamedArgs.entries()]
    .map(([k, v]) => `${k}: input.${v}`)
    .join(', ');

  const resolvedFragment = mergeFragments(
    [
      getInstructionInputResolvedFragment(scope),
      getInstructionRemainingAccountsFragment(scope),
      getInstructionBytesCreatedOnChainFragment(scope),
    ],
    (renders) => renders.join('\n')
  ).addFeatures('context:getProgramAddress');
  const hasResolver = resolvedFragment.hasFeatures(
    'instruction:resolverScopeVariable'
  );
  const contextFragment = resolvedFragment.getContextFragment();

  const functionFragment = fragmentFromTemplate(
    'instructionFunctionHighLevel.njk',
    {
      instruction: instructionNode,
      program: programNode,
      hasAccounts,
      hasDataArgs,
      hasExtraArgs,
      hasAnyArgs,
      argsTypeFragment,
      functionName,
      lowLevelFunctionName,
      typeParamsFragment,
      instructionTypeFragment,
      instructionTypeWithSignersFragment,
      inputTypeFragment,
      inputTypeWithSignersFragment,
      inputTypeCallFragment,
      inputTypeCallWithSignersFragment,
      contextFragment,
      renamedArgs: renamedArgsText,
      resolvedFragment,
      hasResolver,
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
      inputTypeCallFragment,
      inputTypeCallWithSignersFragment,
      contextFragment,
      resolvedFragment,
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

    if (account.isSigner === 'either' && withSigners) {
      const signerRole = account.isWritable
        ? 'WritableSignerAccount'
        : 'ReadonlySignerAccount';
      return fragment(
        `typeof input["${camelName}"] extends TransactionSigner<${typeParam}> ` +
          `? ${signerRole}<${typeParam}> & IAccountSignerMeta<${typeParam}> ` +
          `: ${typeParam}`
      )
        .addImports('solanaInstructions', [signerRole])
        .addImports('solanaSigners', ['IAccountSignerMeta']);
    }

    return fragment(typeParam);
  });

  return mergeFragments(
    [fragment('TProgram'), ...accountTypeParamsFragments],
    (renders) => renders.join(', ')
  ).mapRender((r) => `${instructionTypeName}<${r}>`);
}

function getInputTypeCall(scope: {
  instructionNode: nodes.InstructionNode;
  withSigners: boolean;
  useAsync: boolean;
}): Fragment {
  const { instructionNode, withSigners, useAsync } = scope;
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
