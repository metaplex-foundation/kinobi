import {
  InstructionAccountDefault,
  InstructionArgDefault,
  InstructionDefault,
  camelCase,
  pascalCase,
} from '../../../shared';
import { ResolvedInstructionInput } from '../../../visitors';
import { isAsyncDefaultValue } from '../asyncHelpers';
import { Fragment, fragment, mergeFragments } from './common';
import { getValueNodeFragment } from './valueNode';

export function getInstructionInputDefaultFragment(scope: {
  input: ResolvedInstructionInput;
  optionalAccountStrategy: 'programId' | 'omitted';
  asyncResolvers: string[];
  useAsync: boolean;
  accountObject?: string;
  argObject?: string;
}): Fragment {
  const {
    input,
    optionalAccountStrategy,
    asyncResolvers,
    useAsync,
    accountObject = 'accounts',
    argObject = 'args',
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
    if (input.kind === 'account' && defaultsTo.kind === 'resolver') {
      return fragment(
        `${accountObject}.${inputName} = { ...${accountObject}.${inputName}, ...${defaultValue} };`
      );
    }
    if (input.kind === 'account' && isWritable === undefined) {
      return fragment(`${accountObject}.${inputName}.value = ${defaultValue};`);
    }
    if (input.kind === 'account') {
      return fragment(
        `${accountObject}.${inputName}.value = ${defaultValue};\n` +
          `${accountObject}.${inputName}.isWritable = ${
            isWritable ? 'true' : 'false'
          }`
      );
    }
    return fragment(`${argObject}.${inputName} = ${defaultValue};`);
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
          `expectTransactionSigner(${accountObject}.${name}.value).address`
        ).addImports('shared', 'expectTransactionSigner');
      }
      if (input.kind === 'account') {
        return defaultFragment(
          `expectSome(${accountObject}.${name}.value)`
        ).addImports('shared', 'expectSome');
      }
      return defaultFragment(
        `expectAddress(${accountObject}.${name}.value)`
      ).addImports('shared', 'expectAddress');

    case 'pda':
      const pdaFunction = `find${pascalCase(defaultsTo.pdaAccount)}Pda`;
      const pdaImportFrom =
        defaultsTo.importFrom === 'generated'
          ? 'generatedAccounts'
          : defaultsTo.importFrom;
      const pdaArgs = ['context'];
      const pdaSeeds = Object.keys(defaultsTo.seeds).map(
        (seed: string): Fragment => {
          const seedValue = defaultsTo.seeds[seed];
          if (seedValue.kind === 'account') {
            return fragment(
              `${seed}: expectAddress(${accountObject}.${camelCase(
                seedValue.name
              )}.value)`
            ).addImports('shared', 'expectAddress');
          }
          if (seedValue.kind === 'arg') {
            return fragment(
              `${seed}: expectSome(${argObject}.${camelCase(seedValue.name)})`
            ).addImports('shared', 'expectSome');
          }
          return getValueNodeFragment(seedValue.value).mapRender(
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
        .addImports(pdaImportFrom, pdaFunction)
        .addFeatures('context:getProgramDerivedAddress');

    case 'publicKey':
      return defaultFragment(
        `'${defaultsTo.publicKey}' as Address<'${defaultsTo.publicKey}'>`
      ).addImports('solanaAddresses', 'Address');

    case 'program':
      return defaultFragment(
        `getProgramAddress(context, '${defaultsTo.program.name}', '${defaultsTo.program.publicKey}')`,
        false
      )
        .addImports('shared', ['getProgramAddress'])
        .addFeatures('context:getProgramAddress');

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
        `expectProgramDerivedAddress(${accountObject}.${camelCase(
          defaultsTo.name
        )}.value)[1]`
      ).addImports('shared', 'expectProgramDerivedAddress');

    case 'arg':
      return defaultFragment(
        `expectSome(${argObject}.${camelCase(defaultsTo.name)})`
      ).addImports('shared', 'expectSome');

    case 'value':
      const valueManifest = getValueNodeFragment(defaultsTo.value);
      return defaultFragment(valueManifest.render).mergeImportsWith(
        valueManifest
      );

    case 'resolver':
      const resolverName = camelCase(defaultsTo.name);
      const isWritable =
        input.kind === 'account' && input.isWritable ? 'true' : 'false';
      const resolverAwait =
        useAsync && asyncResolvers.includes(defaultsTo.name) ? 'await ' : '';
      return defaultFragment(
        `${resolverAwait}${resolverName}(context, ${accountObject}, ${argObject}, programAddress, ${isWritable})`
      )
        .addImports(defaultsTo.importFrom, resolverName)
        .addFeatures([
          'context:getProgramAddress',
          'context:getProgramDerivedAddress',
        ]);

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
            ? `${accountObject}.${camelCase(defaultsTo.input.name)}.value`
            : `${argObject}.${camelCase(defaultsTo.input.name)}`;
        if (defaultsTo.value) {
          const comparedValue = getValueNodeFragment(defaultsTo.value);
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
        const conditionalIsWritable =
          input.kind === 'account' && input.isWritable ? 'true' : 'false';
        conditionalFragment
          .addImports(defaultsTo.resolver.importFrom, conditionalResolverName)
          .addFeatures([
            'context:getProgramAddress',
            'context:getProgramDerivedAddress',
          ]);
        const conditionalResolverAwait =
          useAsync && asyncResolvers.includes(defaultsTo.resolver.name)
            ? 'await '
            : '';
        condition = `${conditionalResolverAwait}${conditionalResolverName}(context, ${accountObject}, ${argObject}, programAddress, ${conditionalIsWritable})`;
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
