import {
  InstructionAccountDefault,
  InstructionArgDefault,
  InstructionDefault,
  camelCase,
  pascalCase,
} from '../../../shared';
import { ResolvedInstructionInput } from '../../../visitors';
import { Fragment, fragment } from './common';
import { getValueNodeFragment } from './valueNode';

export function getInstructionDefaultFragment(
  input: ResolvedInstructionInput,
  optionalAccountStrategy: 'programId' | 'omitted',
  argObject: string
): Fragment {
  if (!input.defaultsTo) {
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
        `resolvedAccounts.${inputName} = { ...resolvedAccounts.${inputName}, ...${defaultValue} };`
      );
    }
    if (input.kind === 'account' && isWritable === undefined) {
      return fragment(`resolvedAccounts.${inputName}.value = ${defaultValue};`);
    }
    if (input.kind === 'account') {
      return fragment(
        `resolvedAccounts.${inputName}.value = ${defaultValue};\n` +
          `resolvedAccounts.${inputName}.isWritable = ${
            isWritable ? 'true' : 'false'
          }`
      );
    }
    return fragment(`${argObject}.${inputName} = ${defaultValue};`);
  };

  switch (defaultsTo.kind) {
    case 'account':
      const name = camelCase(defaultsTo.name);
      if (input.kind === 'account') {
        return defaultFragment(
          input.resolvedIsSigner && !input.isSigner
            ? `expectSome(resolvedAccounts.${name}.value).publicKey`
            : `expectSome(resolvedAccounts.${name}.value)`
        ).addImports('shared', 'expectSome');
      }
      return defaultFragment(
        `expectPublicKey(resolvedAccounts.${name}.value)`
      ).addImports('shared', 'expectPublicKey');

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
              `${seed}: expectPublicKey(resolvedAccounts.${camelCase(
                seedValue.name
              )}.value)`
            ).addImports('shared', 'expectPublicKey');
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
      if (pdaSeeds.length > 0) {
        pdaArgs.push(`{ ${pdaSeeds.join(', ')} }`);
      }
      return defaultFragment(`${pdaFunction}(${pdaArgs.join(', ')})`)
        .addImports(pdaImportFrom, pdaFunction)
        .addInterfaces('eddsa');
    case 'publicKey':
      return defaultFragment(`address('${defaultsTo.publicKey}')`).addImports(
        'solanaAddresses',
        'address'
      );
    case 'program':
      return defaultFragment(
        `context.programs.getPublicKey('${defaultsTo.program.name}', '${defaultsTo.program.publicKey}')`,
        false
      );
    case 'programId':
      if (
        optionalAccountStrategy === 'programId' &&
        input.kind === 'account' &&
        input.isOptional
      ) {
        return fragment('');
      }
      return defaultFragment('programId', false);
    case 'identity':
      return defaultFragment(
        input.kind === 'account' && input.isSigner !== false
          ? 'context.identity'
          : 'context.identity.publicKey'
      ).addInterfaces('identity');
    case 'payer':
      return defaultFragment(
        input.kind === 'account' && input.isSigner !== false
          ? 'context.payer'
          : 'context.payer.publicKey'
      ).addInterfaces('payer');
    case 'accountBump':
      return defaultFragment(
        `expectPda(resolvedAccounts.${camelCase(defaultsTo.name)}.value)[1]`
      ).addImports('shared', 'expectPda');
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
      return defaultFragment(
        `${resolverName}(context, resolvedAccounts, ${argObject}, programId, ${isWritable})`
      )
        .addImports(defaultsTo.importFrom, resolverName)
        .addInterfaces(['eddsa', 'identity', 'payer']);
    case 'conditional':
    case 'conditionalResolver':
      const ifTrueRenderer = renderNestedInstructionDefault(
        input,
        optionalAccountStrategy,
        defaultsTo.ifTrue,
        argObject
      );
      const ifFalseRenderer = renderNestedInstructionDefault(
        input,
        optionalAccountStrategy,
        defaultsTo.ifFalse,
        argObject
      );
      if (!ifTrueRenderer && !ifFalseRenderer) {
        return fragment('');
      }
      const conditionalFragment = fragment('');
      if (ifTrueRenderer) {
        conditionalFragment.mergeImportsWith(ifTrueRenderer.imports);
        conditionalFragment.mergeInterfacesWith(ifTrueRenderer.interfaces);
      }
      if (ifFalseRenderer) {
        conditionalFragment.mergeImportsWith(ifFalseRenderer.imports);
        conditionalFragment.mergeInterfacesWith(ifFalseRenderer.interfaces);
      }
      const negatedCondition = !ifTrueRenderer;
      let condition = 'true';

      if (defaultsTo.kind === 'conditional') {
        const comparedInputName =
          defaultsTo.input.kind === 'account'
            ? `resolvedAccounts.${camelCase(defaultsTo.input.name)}.value`
            : `${argObject}.${camelCase(defaultsTo.input.name)}`;
        if (defaultsTo.value) {
          const comparedValue = getValueNodeFragment(defaultsTo.value);
          conditionalFragment.mergeImportsWith(comparedValue.imports);
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
        conditionalFragment.addImports(
          defaultsTo.resolver.importFrom,
          conditionalResolverName
        );
        conditionalFragment.addInterfaces(['eddsa', 'identity', 'payer']);
        condition = `${conditionalResolverName}(context, resolvedAccounts, ${argObject}, programId, ${conditionalIsWritable})`;
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
  input: ResolvedInstructionInput,
  optionalAccountStrategy: 'programId' | 'omitted',
  defaultsTo: InstructionDefault | undefined,
  argObject: string
): Fragment | undefined {
  if (!defaultsTo) return undefined;

  if (input.kind === 'account') {
    return getInstructionDefaultFragment(
      { ...input, defaultsTo: defaultsTo as InstructionAccountDefault },
      optionalAccountStrategy,
      argObject
    );
  }

  return getInstructionDefaultFragment(
    { ...input, defaultsTo: defaultsTo as InstructionArgDefault },
    optionalAccountStrategy,
    argObject
  );
}
