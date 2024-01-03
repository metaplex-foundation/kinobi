import { InstructionNode, ProgramNode } from '../../../nodes';
import { camelCase, pascalCase } from '../../../shared';
import { ResolvedInstructionInput } from '../../../visitors';
import { TypeManifest } from '../TypeManifest';
import { hasAsyncFunction } from '../asyncHelpers';
import type { GlobalFragmentScope } from '../getRenderMapVisitor';
import { NameApi } from '../nameTransformers';
import {
  Fragment,
  fragment,
  fragmentFromTemplate,
  mergeFragments,
} from './common';
import { getInstructionByteDeltaFragment } from './instructionByteDelta';
import { getInstructionInputResolvedFragment } from './instructionInputResolved';
import { getInstructionInputTypeFragment } from './instructionInputType';
import { getInstructionRemainingAccountsFragment } from './instructionRemainingAccounts';

export function getInstructionFunctionHighLevelFragment(
  scope: Pick<
    GlobalFragmentScope,
    'nameApi' | 'asyncResolvers' | 'valueNodeVisitor' | 'customInstructionData'
  > & {
    instructionNode: InstructionNode;
    programNode: ProgramNode;
    renamedArgs: Map<string, string>;
    dataArgsManifest: TypeManifest;
    extraArgsManifest: TypeManifest;
    resolvedInputs: ResolvedInstructionInput[];
    useAsync: boolean;
  }
): Fragment {
  const {
    useAsync,
    instructionNode,
    programNode,
    resolvedInputs,
    renamedArgs,
    dataArgsManifest,
    asyncResolvers,
    nameApi,
    customInstructionData,
  } = scope;
  if (
    useAsync &&
    !hasAsyncFunction(instructionNode, resolvedInputs, asyncResolvers)
  ) {
    return fragment('');
  }

  const customData = customInstructionData.get(instructionNode.name);
  const hasAccounts = instructionNode.accounts.length > 0;
  const hasDataArgs =
    !!customData ||
    instructionNode.arguments.filter(
      (field) => !field.defaultValue || field.defaultValueStrategy !== 'omitted'
    ).length > 0;
  const hasExtraArgs =
    (instructionNode.extraArguments ?? []).filter(
      (field) => !field.defaultValue || field.defaultValueStrategy !== 'omitted'
    ).length > 0;
  const hasAnyArgs = hasDataArgs || hasExtraArgs;
  const instructionDataName = nameApi.instructionDataType(instructionNode.name);
  const argsTypeFragment = fragment(
    customData
      ? dataArgsManifest.looseType.render
      : nameApi.dataArgsType(instructionDataName)
  );
  if (customData) {
    argsTypeFragment.mergeImportsWith(dataArgsManifest.looseType);
  }

  const functionName = useAsync
    ? nameApi.instructionAsyncFunction(instructionNode.name)
    : nameApi.instructionSyncFunction(instructionNode.name);
  const lowLevelFunctionName = nameApi.instructionRawFunction(
    instructionNode.name
  );

  const typeParamsFragment = getTypeParams(instructionNode, programNode);
  const instructionTypeFragment = getInstructionType({
    ...scope,
    withSigners: false,
  });
  const instructionTypeWithSignersFragment = getInstructionType({
    ...scope,
    withSigners: true,
  });

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

  const resolvedInputsFragment = getInstructionInputResolvedFragment(scope);
  const remainingAccountsFragment =
    getInstructionRemainingAccountsFragment(scope);
  const byteDeltaFragment = getInstructionByteDeltaFragment(scope);
  const resolvedFragment = mergeFragments(
    [resolvedInputsFragment, remainingAccountsFragment, byteDeltaFragment],
    (renders) => renders.join('\n\n')
  );
  const hasRemainingAccounts = remainingAccountsFragment.render !== '';
  const hasByteDeltas = byteDeltaFragment.render !== '';
  const hasResolver = resolvedFragment.hasFeatures(
    'instruction:resolverScopeVariable'
  );
  const getReturnType = (instructionType: string) => {
    let returnType = instructionType;
    if (hasByteDeltas) {
      returnType = `${returnType} & IInstructionWithByteDelta`;
    }
    return useAsync ? `Promise<${returnType}>` : returnType;
  };

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
      renamedArgs: renamedArgsText,
      resolvedFragment,
      hasRemainingAccounts,
      hasByteDeltas,
      hasResolver,
      useAsync,
      getReturnType,
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
      resolvedFragment,
      argsTypeFragment
    )
    .addImports('solanaAddresses', ['Address']);

  if (hasAccounts) {
    functionFragment
      .addImports('solanaInstructions', ['IAccountMeta'])
      .addImports('shared', ['getAccountMetasWithSigners', 'ResolvedAccount']);
  }

  if (hasByteDeltas) {
    functionFragment.addImports('shared', ['IInstructionWithByteDelta']);
  }

  return functionFragment;
}

function getTypeParams(
  instructionNode: InstructionNode,
  programNode: ProgramNode
): Fragment {
  const typeParams = [
    ...instructionNode.accounts.map(
      (account) => `TAccount${pascalCase(account.name)} extends string`
    ),
    `TProgram extends string = "${programNode.publicKey}"`,
  ];
  return fragment(typeParams.filter((x) => !!x).join(', '));
}

function getInstructionType(scope: {
  instructionNode: InstructionNode;
  withSigners: boolean;
  nameApi: NameApi;
}): Fragment {
  const { instructionNode, withSigners, nameApi } = scope;
  const instructionTypeName = withSigners
    ? nameApi.instructionWithSignersType(instructionNode.name)
    : nameApi.instructionType(instructionNode.name);
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
  instructionNode: InstructionNode;
  withSigners: boolean;
  useAsync: boolean;
  nameApi: NameApi;
}): Fragment {
  const { instructionNode, withSigners, useAsync, nameApi } = scope;
  const syncInputTypeName = withSigners
    ? nameApi.instructionSyncInputWithSignersType(instructionNode.name)
    : nameApi.instructionSyncInputType(instructionNode.name);
  const asyncInputTypeName = withSigners
    ? nameApi.instructionAsyncInputWithSignersType(instructionNode.name)
    : nameApi.instructionAsyncInputType(instructionNode.name);
  const inputTypeName = useAsync ? asyncInputTypeName : syncInputTypeName;
  if (instructionNode.accounts.length === 0) return fragment(inputTypeName);
  const accountTypeParams = instructionNode.accounts
    .map((account) => `TAccount${pascalCase(account.name)}`)
    .join(', ');

  return fragment(`${inputTypeName}<${accountTypeParams}>`);
}
