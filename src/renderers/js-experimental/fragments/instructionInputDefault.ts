import {
  InstructionAccountDefault,
  InstructionArgDefault,
  InstructionDefault,
  camelCase,
  pascalCase,
} from '../../../shared';
import { ResolvedInstructionInput } from '../../../visitors';
import { ContextMap } from '../ContextMap';
import {
  Fragment,
  fragment,
  fragmentWithContextMap,
  mergeFragments,
} from './common';
import { getValueNodeFragment } from './valueNode';

export function getInstructionInputDefaultFragment(
  input: ResolvedInstructionInput,
  optionalAccountStrategy: 'programId' | 'omitted',
  useAsync: boolean,
  accountObject: string = 'accounts',
  argObject: string = 'args'
): Fragment & { interfaces: ContextMap } {
  if (!input.defaultsTo) {
    return fragmentWithContextMap('');
  }

  const { defaultsTo } = input;
  const defaultFragment = (
    defaultValue: string,
    isWritable?: boolean
  ): Fragment & { interfaces: ContextMap } => {
    const inputName = camelCase(input.name);
    if (input.kind === 'account' && defaultsTo.kind === 'resolver') {
      return fragmentWithContextMap(
        `${accountObject}.${inputName} = { ...${accountObject}.${inputName}, ...${defaultValue} };`
      );
    }
    if (input.kind === 'account' && isWritable === undefined) {
      return fragmentWithContextMap(
        `${accountObject}.${inputName}.value = ${defaultValue};`
      );
    }
    if (input.kind === 'account') {
      return fragmentWithContextMap(
        `${accountObject}.${inputName}.value = ${defaultValue};\n` +
          `${accountObject}.${inputName}.isWritable = ${
            isWritable ? 'true' : 'false'
          }`
      );
    }
    return fragmentWithContextMap(
      `${argObject}.${inputName} = ${defaultValue};`
    );
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
      if (!useAsync) {
        return fragmentWithContextMap('');
      }
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
      const pdaFragment = defaultFragment(
        `await ${pdaFunction}(${pdaArgs.join(', ')})`
      )
        .mergeImportsWith(pdaSeedsFragment)
        .addImports(pdaImportFrom, pdaFunction);
      pdaFragment.interfaces.add('getProgramDerivedAddress');
      return pdaFragment;

    case 'publicKey':
      return defaultFragment(
        `'${defaultsTo.publicKey}' as Address<'${defaultsTo.publicKey}'>`
      ).addImports('solanaAddresses', 'Address');

    case 'program':
      const programFragment = defaultFragment(
        `getProgramAddress(context, '${defaultsTo.program.name}', '${defaultsTo.program.publicKey}')`,
        false
      ).addImports('shared', ['getProgramAddress']);
      programFragment.interfaces.add('getProgramAddress');
      return programFragment;

    case 'programId':
      if (
        optionalAccountStrategy === 'programId' &&
        input.kind === 'account' &&
        input.isOptional
      ) {
        return fragmentWithContextMap('');
      }
      return defaultFragment('programAddress', false);

    case 'identity':
    case 'payer':
      return fragmentWithContextMap('');

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
      const resolverFragment = defaultFragment(
        `${resolverName}(context, ${accountObject}, ${argObject}, programAddress, ${isWritable})`
      ).addImports(defaultsTo.importFrom, resolverName);
      resolverFragment.interfaces.add([
        'getProgramAddress',
        'getProgramDerivedAddress',
      ]);
      return resolverFragment;

    case 'conditional':
    case 'conditionalResolver':
      const ifTrueRenderer = renderNestedInstructionDefault(
        input,
        optionalAccountStrategy,
        defaultsTo.ifTrue,
        useAsync,
        accountObject,
        argObject
      );
      const ifFalseRenderer = renderNestedInstructionDefault(
        input,
        optionalAccountStrategy,
        defaultsTo.ifFalse,
        useAsync,
        accountObject,
        argObject
      );
      if (!ifTrueRenderer && !ifFalseRenderer) {
        return fragmentWithContextMap('');
      }
      const conditionalFragment = fragmentWithContextMap('');
      if (ifTrueRenderer) {
        conditionalFragment.mergeImportsWith(ifTrueRenderer.imports);
        conditionalFragment.interfaces.mergeWith(ifTrueRenderer.interfaces);
      }
      if (ifFalseRenderer) {
        conditionalFragment.mergeImportsWith(ifFalseRenderer.imports);
        conditionalFragment.interfaces.mergeWith(ifFalseRenderer.interfaces);
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
        conditionalFragment.interfaces.add([
          'getProgramAddress',
          'getProgramDerivedAddress',
        ]);
        condition = `${conditionalResolverName}(context, ${accountObject}, ${argObject}, programAddress, ${conditionalIsWritable})`;
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
  useAsync: boolean,
  accountObject: string,
  argObject: string
): (Fragment & { interfaces: ContextMap }) | undefined {
  if (!defaultsTo) return undefined;

  if (input.kind === 'account') {
    return getInstructionInputDefaultFragment(
      { ...input, defaultsTo: defaultsTo as InstructionAccountDefault },
      optionalAccountStrategy,
      useAsync,
      accountObject,
      argObject
    );
  }

  return getInstructionInputDefaultFragment(
    { ...input, defaultsTo: defaultsTo as InstructionArgDefault },
    optionalAccountStrategy,
    useAsync,
    accountObject,
    argObject
  );
}
