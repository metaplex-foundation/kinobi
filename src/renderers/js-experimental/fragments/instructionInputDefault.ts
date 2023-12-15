import {
  InstructionAccountDefault,
  InstructionArgDefault,
  InstructionDefault,
  camelCase,
  pascalCase,
} from '../../../shared';
import { ResolvedInstructionInput } from '../../../visitors';
import { isAsyncDefaultValue } from '../asyncHelpers';
import { NameApi } from '../nameTransformers';
import { Fragment, fragment, mergeFragments } from './common';
import { getValueNodeFragment } from './valueNode';

export function getInstructionInputDefaultFragment(scope: {
  input: ResolvedInstructionInput;
  optionalAccountStrategy: 'programId' | 'omitted';
  asyncResolvers: string[];
  useAsync: boolean;
  nameApi: NameApi;
}): Fragment {
  const { input, optionalAccountStrategy, asyncResolvers, useAsync, nameApi } =
    scope;
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
    if (input.kind === 'account' && defaultsTo.kind === 'resolver') {
      return fragment(
        `accounts.${inputName} = { ...accounts.${inputName}, ...${defaultValue} };`
      );
    }
    if (input.kind === 'account' && isWritable === undefined) {
      return fragment(`accounts.${inputName}.value = ${defaultValue};`);
    }
    if (input.kind === 'account') {
      return fragment(
        `accounts.${inputName}.value = ${defaultValue};\n` +
          `accounts.${inputName}.isWritable = ${isWritable ? 'true' : 'false'}`
      );
    }
    return fragment(`args.${inputName} = ${defaultValue};`);
  };

  switch (defaultsTo.kind) {
    case 'account':
      const name = camelCase(defaultsTo.name);
      if (
        input.kind === 'account' &&
        input.resolvedIsSigner &&
        !input.isSigner
      ) {
        return defaultFragment(
          `expectTransactionSigner(accounts.${name}.value).address`
        ).addImports('shared', 'expectTransactionSigner');
      }
      if (input.kind === 'account') {
        return defaultFragment(`expectSome(accounts.${name}.value)`).addImports(
          'shared',
          'expectSome'
        );
      }
      return defaultFragment(
        `expectAddress(accounts.${name}.value)`
      ).addImports('shared', 'expectAddress');

    case 'pda':
      const pdaFunction = `find${pascalCase(defaultsTo.pdaAccount)}Pda`;
      const pdaImportFrom =
        defaultsTo.importFrom === 'generated'
          ? 'generatedAccounts'
          : defaultsTo.importFrom;
      const pdaArgs = [];
      const pdaSeeds = Object.keys(defaultsTo.seeds).map(
        (seed: string): Fragment => {
          const seedValue = defaultsTo.seeds[seed];
          if (seedValue.kind === 'account') {
            return fragment(
              `${seed}: expectAddress(accounts.${camelCase(
                seedValue.name
              )}.value)`
            ).addImports('shared', 'expectAddress');
          }
          if (seedValue.kind === 'arg') {
            return fragment(
              `${seed}: expectSome(args.${camelCase(seedValue.name)})`
            ).addImports('shared', 'expectSome');
          }
          return getValueNodeFragment(seedValue.value, nameApi).mapRender(
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

    case 'publicKey':
      return defaultFragment(
        `'${defaultsTo.publicKey}' as Address<'${defaultsTo.publicKey}'>`
      ).addImports('solanaAddresses', 'Address');

    case 'program':
      return defaultFragment(
        `'${defaultsTo.program.publicKey}' as Address<'${defaultsTo.program.publicKey}'>`,
        false
      ).addImports('solanaAddresses', ['Address']);

    case 'programId':
      if (
        optionalAccountStrategy === 'programId' &&
        input.kind === 'account' &&
        input.isOptional
      ) {
        return fragment('');
      }
      return defaultFragment('programAddress', false);

    case 'identity':
    case 'payer':
      return fragment('');

    case 'accountBump':
      return defaultFragment(
        `expectProgramDerivedAddress(accounts.${camelCase(
          defaultsTo.name
        )}.value)[1]`
      ).addImports('shared', 'expectProgramDerivedAddress');

    case 'arg':
      return defaultFragment(
        `expectSome(args.${camelCase(defaultsTo.name)})`
      ).addImports('shared', 'expectSome');

    case 'value':
      const valueManifest = getValueNodeFragment(defaultsTo.value, nameApi);
      return defaultFragment(valueManifest.render).mergeImportsWith(
        valueManifest
      );

    case 'resolver':
      const resolverName = camelCase(defaultsTo.name);
      const resolverAwait =
        useAsync && asyncResolvers.includes(defaultsTo.name) ? 'await ' : '';
      return defaultFragment(`${resolverAwait}${resolverName}(resolverScope)`)
        .addImports(defaultsTo.importFrom, resolverName)
        .addFeatures(['instruction:resolverScopeVariable']);

    case 'conditional':
    case 'conditionalResolver':
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

      if (defaultsTo.kind === 'conditional') {
        const comparedInputName =
          defaultsTo.input.kind === 'account'
            ? `accounts.${camelCase(defaultsTo.input.name)}.value`
            : `args.${camelCase(defaultsTo.input.name)}`;
        if (defaultsTo.value) {
          const comparedValue = getValueNodeFragment(defaultsTo.value, nameApi);
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
      } else {
        const conditionalResolverName = camelCase(defaultsTo.resolver.name);
        conditionalFragment
          .addImports(defaultsTo.resolver.importFrom, conditionalResolverName)
          .addFeatures(['instruction:resolverScopeVariable']);
        const conditionalResolverAwait =
          useAsync && asyncResolvers.includes(defaultsTo.resolver.name)
            ? 'await '
            : '';
        condition = `${conditionalResolverAwait}${conditionalResolverName}(resolverScope)`;
        condition = negatedCondition ? `!${condition}` : condition;
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
      const neverDefault: never = defaultsTo;
      throw new Error(`Unexpected value type ${(neverDefault as any).kind}`);
  }
}

function renderNestedInstructionDefault(
  scope: Parameters<typeof getInstructionInputDefaultFragment>[0] & {
    defaultsTo: InstructionDefault | undefined;
  }
): Fragment | undefined {
  const { input, defaultsTo } = scope;
  if (!defaultsTo) return undefined;

  if (input.kind === 'account') {
    return getInstructionInputDefaultFragment({
      ...scope,
      input: { ...input, defaultsTo: defaultsTo as InstructionAccountDefault },
    });
  }

  return getInstructionInputDefaultFragment({
    ...scope,
    input: { ...input, defaultsTo: defaultsTo as InstructionArgDefault },
  });
}
