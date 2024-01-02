import { InstructionInputValueNode, isNode } from '../../../nodes';
import { MainCaseString, camelCase } from '../../../shared';
import { ResolvedInstructionInput, visit } from '../../../visitors';
import { isAsyncDefaultValue } from '../asyncHelpers';
import { GlobalFragmentScope } from '../getRenderMapVisitor';
import { Fragment, fragment, mergeFragments } from './common';

export function getInstructionInputDefaultFragment(
  scope: Pick<
    GlobalFragmentScope,
    'nameApi' | 'asyncResolvers' | 'valueNodeVisitor'
  > & {
    input: ResolvedInstructionInput;
    optionalAccountStrategy: 'programId' | 'omitted';
    useAsync: boolean;
  }
): Fragment {
  const {
    input,
    optionalAccountStrategy,
    asyncResolvers,
    useAsync,
    nameApi,
    valueNodeVisitor,
  } = scope;
  if (!input.defaultsTo) {
    return fragment('');
  }

  if (!useAsync && isAsyncDefaultValue(input.defaultsTo, asyncResolvers)) {
    return fragment('');
  }

  const { defaultsTo } = input;
  const defaultFragment = (
    defaultValue: string,
    isWritable?: boolean
  ): Fragment => {
    const inputName = camelCase(input.name);
    if (
      input.kind === 'instructionAccountNode' &&
      isNode(defaultsTo, 'resolverValueNode')
    ) {
      return fragment(
        `accounts.${inputName} = { ...accounts.${inputName}, ...${defaultValue} };`
      );
    }
    if (input.kind === 'instructionAccountNode' && isWritable === undefined) {
      return fragment(`accounts.${inputName}.value = ${defaultValue};`);
    }
    if (input.kind === 'instructionAccountNode') {
      return fragment(
        `accounts.${inputName}.value = ${defaultValue};\n` +
          `accounts.${inputName}.isWritable = ${isWritable ? 'true' : 'false'}`
      );
    }
    return fragment(`args.${inputName} = ${defaultValue};`);
  };

  switch (defaultsTo.kind) {
    case 'accountValueNode':
      const name = camelCase(defaultsTo.name);
      if (
        input.kind === 'instructionAccountNode' &&
        input.resolvedIsSigner &&
        !input.isSigner
      ) {
        return defaultFragment(
          `expectTransactionSigner(accounts.${name}.value).address`
        ).addImports('shared', 'expectTransactionSigner');
      }
      if (input.kind === 'instructionAccountNode') {
        return defaultFragment(`expectSome(accounts.${name}.value)`).addImports(
          'shared',
          'expectSome'
        );
      }
      return defaultFragment(
        `expectAddress(accounts.${name}.value)`
      ).addImports('shared', 'expectAddress');

    case 'pdaValueNode':
      const pdaFunction = nameApi.pdaFindFunction(defaultsTo.pda.name);
      const pdaImportFrom = defaultsTo.pda.importFrom ?? 'generatedPdas';
      const pdaArgs = [];
      const pdaSeeds = Object.keys(defaultsTo.seeds).map(
        (seed: string): Fragment => {
          const seedValue = defaultsTo.seeds[seed as MainCaseString];
          if (isNode(seedValue, 'accountValueNode')) {
            return fragment(
              `${seed}: expectAddress(accounts.${camelCase(
                seedValue.name
              )}.value)`
            ).addImports('shared', 'expectAddress');
          }
          if (isNode(seedValue, 'argumentValueNode')) {
            return fragment(
              `${seed}: expectSome(args.${camelCase(seedValue.name)})`
            ).addImports('shared', 'expectSome');
          }
          return visit(seedValue, valueNodeVisitor).mapRender(
            (r) => `${seed}: ${r}`
          );
        }
      );
      const pdaSeedsFragment = mergeFragments(pdaSeeds, (renders) =>
        renders.join(', ')
      ).mapRender((r) => `{ ${r} }`);
      if (pdaSeeds.length > 0) {
        pdaArgs.push(pdaSeedsFragment.render);
      }
      return defaultFragment(`await ${pdaFunction}(${pdaArgs.join(', ')})`)
        .mergeImportsWith(pdaSeedsFragment)
        .addImports(pdaImportFrom, pdaFunction);

    case 'publicKeyValueNode':
      return defaultFragment(
        `'${defaultsTo.publicKey}' as Address<'${defaultsTo.publicKey}'>`
      ).addImports('solanaAddresses', 'Address');

    case 'programLinkNode':
      const programAddress = nameApi.programAddressConstant(defaultsTo.name);
      const importFrom = defaultsTo.importFrom ?? 'generatedPrograms';
      return defaultFragment(programAddress, false).addImports(
        importFrom,
        programAddress
      );

    case 'programIdValueNode':
      if (
        optionalAccountStrategy === 'programId' &&
        input.kind === 'instructionAccountNode' &&
        input.isOptional
      ) {
        return fragment('');
      }
      return defaultFragment('programAddress', false);

    case 'identityValueNode':
    case 'payerValueNode':
      return fragment('');

    case 'accountBumpValueNode':
      return defaultFragment(
        `expectProgramDerivedAddress(accounts.${camelCase(
          defaultsTo.name
        )}.value)[1]`
      ).addImports('shared', 'expectProgramDerivedAddress');

    case 'argumentValueNode':
      return defaultFragment(
        `expectSome(args.${camelCase(defaultsTo.name)})`
      ).addImports('shared', 'expectSome');

    case 'resolverValueNode':
      const resolverFunction = nameApi.resolverFunction(defaultsTo.name);
      const resolverAwait =
        useAsync && asyncResolvers.includes(defaultsTo.name) ? 'await ' : '';
      return defaultFragment(
        `${resolverAwait}${resolverFunction}(resolverScope)`
      )
        .addImports(defaultsTo.importFrom ?? 'hooked', resolverFunction)
        .addFeatures(['instruction:resolverScopeVariable']);

    case 'conditionalValueNode':
      const ifTrueRenderer = renderNestedInstructionDefault({
        ...scope,
        defaultsTo: defaultsTo.ifTrue,
      });
      const ifFalseRenderer = renderNestedInstructionDefault({
        ...scope,
        defaultsTo: defaultsTo.ifFalse,
      });
      if (!ifTrueRenderer && !ifFalseRenderer) {
        return fragment('');
      }
      const conditionalFragment = fragment('');
      if (ifTrueRenderer) {
        conditionalFragment
          .mergeImportsWith(ifTrueRenderer)
          .mergeFeaturesWith(ifTrueRenderer);
      }
      if (ifFalseRenderer) {
        conditionalFragment
          .mergeImportsWith(ifFalseRenderer)
          .mergeFeaturesWith(ifFalseRenderer);
      }
      const negatedCondition = !ifTrueRenderer;
      let condition = 'true';

      if (isNode(defaultsTo.condition, 'resolverValueNode')) {
        const conditionalResolverFunction = nameApi.resolverFunction(
          defaultsTo.condition.name
        );
        conditionalFragment
          .addImports(
            defaultsTo.condition.importFrom ?? 'hooked',
            conditionalResolverFunction
          )
          .addFeatures(['instruction:resolverScopeVariable']);
        const conditionalResolverAwait =
          useAsync && asyncResolvers.includes(defaultsTo.condition.name)
            ? 'await '
            : '';
        condition = `${conditionalResolverAwait}${conditionalResolverFunction}(resolverScope)`;
        condition = negatedCondition ? `!${condition}` : condition;
      } else {
        const comparedInputName = isNode(
          defaultsTo.condition,
          'accountValueNode'
        )
          ? `accounts.${camelCase(defaultsTo.condition.name)}.value`
          : `args.${camelCase(defaultsTo.condition.name)}`;
        if (defaultsTo.value) {
          const comparedValue = visit(defaultsTo.value, valueNodeVisitor);
          conditionalFragment
            .mergeImportsWith(comparedValue)
            .mergeFeaturesWith(comparedValue);
          const operator = negatedCondition ? '!==' : '===';
          condition = `${comparedInputName} ${operator} ${comparedValue.render}`;
        } else {
          condition = negatedCondition
            ? `!${comparedInputName}`
            : comparedInputName;
        }
      }

      if (ifTrueRenderer && ifFalseRenderer) {
        return conditionalFragment.setRender(
          `if (${condition}) {\n${ifTrueRenderer.render}\n} else {\n${ifFalseRenderer.render}\n}`
        );
      }

      return conditionalFragment.setRender(
        `if (${condition}) {\n${
          ifTrueRenderer ? ifTrueRenderer.render : ifFalseRenderer?.render
        }\n}`
      );

    default:
      const valueManifest = visit(defaultsTo, valueNodeVisitor);
      return defaultFragment(valueManifest.render).mergeImportsWith(
        valueManifest
      );
  }
}

function renderNestedInstructionDefault(
  scope: Parameters<typeof getInstructionInputDefaultFragment>[0] & {
    defaultsTo: InstructionInputValueNode | undefined;
  }
): Fragment | undefined {
  const { input, defaultsTo } = scope;
  if (!defaultsTo) return undefined;
  return getInstructionInputDefaultFragment({
    ...scope,
    input: { ...input, defaultsTo },
  });
}
