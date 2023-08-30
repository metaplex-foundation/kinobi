import {
  InstructionAccountDefault,
  InstructionArgDefault,
  InstructionDefault,
  camelCase,
  pascalCase,
} from '../../shared';
import { ResolvedInstructionInput } from '../../visitors';
import { JavaScriptImportMap } from './JavaScriptImportMap';
import { renderJavaScriptValueNode } from './RenderJavaScriptValueNode';

export function renderJavaScriptInstructionDefaults(
  input: ResolvedInstructionInput,
  optionalAccountStrategy: 'programId' | 'omitted'
): {
  imports: JavaScriptImportMap;
  render: string;
} {
  const imports = new JavaScriptImportMap();
  if (!input.defaultsTo) {
    return { imports, render: '' };
  }

  const { defaultsTo } = input;
  const render = (
    defaultValue: string,
    isWritable?: boolean
  ): {
    imports: JavaScriptImportMap;
    render: string;
  } => {
    const inputName = camelCase(input.name);
    if (input.kind === 'account' && defaultsTo.kind === 'resolver') {
      return {
        imports,
        render: `resolvedAccounts.${inputName} = { ...resolvedAccounts.${inputName}, ...${defaultValue} };`,
      };
    }
    if (input.kind === 'account' && isWritable === undefined) {
      return {
        imports,
        render: `resolvedAccounts.${inputName}.value = ${defaultValue};`,
      };
    }
    if (input.kind === 'account') {
      return {
        imports,
        render:
          `resolvedAccounts.${inputName}.value = ${defaultValue};\n` +
          `resolvedAccounts.${inputName}.isWritable = ${
            isWritable ? 'true' : 'false'
          }`,
      };
    }
    return {
      imports,
      render: `resolvedArgs.${inputName} = ${defaultValue};`,
    };
  };

  switch (defaultsTo.kind) {
    case 'account':
      const name = camelCase(defaultsTo.name);
      if (input.kind === 'account') {
        imports.add('shared', 'expectSome');
        return render(`expectSome(resolvedAccounts.${name}.value)`);
      }
      imports.add('shared', 'expectPublicKey');
      return render(`expectPublicKey(resolvedAccounts.${name}.value)`);
    case 'pda':
      const pdaFunction = `find${pascalCase(defaultsTo.pdaAccount)}Pda`;
      const pdaImportFrom =
        defaultsTo.importFrom === 'generated'
          ? 'generatedAccounts'
          : defaultsTo.importFrom;
      imports.add(pdaImportFrom, pdaFunction);
      const pdaArgs = ['context'];
      const pdaSeeds = Object.keys(defaultsTo.seeds).map(
        (seed: string): string => {
          const seedValue = defaultsTo.seeds[seed];
          if (seedValue.kind === 'account') {
            imports.add('shared', 'expectPublicKey');
            return `${seed}: expectPublicKey(resolvedAccounts.${camelCase(
              seedValue.name
            )}.value)`;
          }
          if (seedValue.kind === 'arg') {
            imports.add('shared', 'expectSome');
            return `${seed}: expectSome(resolvedArgs.${camelCase(
              seedValue.name
            )})`;
          }
          const valueManifest = renderJavaScriptValueNode(seedValue.value);
          imports.mergeWith(valueManifest.imports);
          return `${seed}: ${valueManifest.render}`;
        }
      );
      if (pdaSeeds.length > 0) {
        pdaArgs.push(`{ ${pdaSeeds.join(', ')} }`);
      }
      return render(`${pdaFunction}(${pdaArgs.join(', ')})`);
    case 'publicKey':
      imports.add('umi', 'publicKey');
      return render(`publicKey('${defaultsTo.publicKey}')`);
    case 'program':
      return render(
        `context.programs.getPublicKey('${defaultsTo.program.name}', '${defaultsTo.program.publicKey}')`,
        false
      );
    case 'programId':
      if (
        optionalAccountStrategy === 'programId' &&
        input.kind === 'account' &&
        input.isOptional
      ) {
        return { imports, render: '' };
      }
      return render('programId', false);
    case 'identity':
      if (input.kind === 'account' && input.isSigner !== false) {
        return render('context.identity');
      }
      return render('context.identity.publicKey');
    case 'payer':
      if (input.kind === 'account' && input.isSigner !== false) {
        return render('context.payer');
      }
      return render('context.payer.publicKey');
    case 'accountBump':
      imports.add('shared', 'expectPda');
      return render(
        `expectPda(resolvedAccounts.${camelCase(defaultsTo.name)}.value)[1]`
      );
    case 'arg':
      imports.add('shared', 'expectSome');
      return render(`expectSome(resolvedArgs.${camelCase(defaultsTo.name)})`);
    case 'value':
      const valueManifest = renderJavaScriptValueNode(defaultsTo.value);
      imports.mergeWith(valueManifest.imports);
      return render(valueManifest.render);
    case 'resolver':
      const resolverName = camelCase(defaultsTo.name);
      const isWritable =
        input.kind === 'account' && input.isWritable ? 'true' : 'false';
      imports.add(defaultsTo.importFrom, resolverName);
      return render(
        `${resolverName}(context, resolvedAccounts, resolvedArgs, programId, ${isWritable})`
      );
    case 'conditional':
    case 'conditionalResolver':
      const ifTrueRenderer = renderNestedInstructionDefault(
        input,
        optionalAccountStrategy,
        defaultsTo.ifTrue
      );
      const ifFalseRenderer = renderNestedInstructionDefault(
        input,
        optionalAccountStrategy,
        defaultsTo.ifTrue
      );
      if (!ifTrueRenderer && !ifFalseRenderer) {
        return { imports, render: '' };
      }
      if (ifTrueRenderer) {
        imports.mergeWith(ifTrueRenderer.imports);
      }
      if (ifFalseRenderer) {
        imports.mergeWith(ifFalseRenderer.imports);
      }
      const negatedCondition = !ifTrueRenderer;
      let condition = 'true';

      if (defaultsTo.kind === 'conditional') {
        const comparedInputName =
          defaultsTo.input.kind === 'account'
            ? `resolvedAccounts.${camelCase(defaultsTo.input.name)}.value`
            : `resolvedArgs.${camelCase(defaultsTo.input.name)}`;
        if (defaultsTo.value) {
          const comparedValue = renderJavaScriptValueNode(defaultsTo.value);
          imports.mergeWith(comparedValue.imports);
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
        imports.add(defaultsTo.resolver.importFrom, conditionalResolverName);
        condition = `${conditionalResolverName}(context, resolvedAccounts, resolvedArgs, programId, ${conditionalIsWritable})`;
        condition = negatedCondition ? `!${condition}` : condition;
      }

      if (ifTrueRenderer && ifFalseRenderer) {
        return {
          imports,
          render: `if (${condition}) {\n${ifTrueRenderer.render}\n} else {\n${ifFalseRenderer.render}\n}`,
        };
      }

      return {
        imports,
        render: `if (${condition}) {\n${
          ifTrueRenderer ? ifTrueRenderer.render : ifFalseRenderer?.render
        }\n}`,
      };
    default:
      const neverDefault: never = defaultsTo;
      throw new Error(`Unexpected value type ${(neverDefault as any).kind}`);
  }
}

function renderNestedInstructionDefault(
  input: ResolvedInstructionInput,
  optionalAccountStrategy: 'programId' | 'omitted',
  defaultsTo: InstructionDefault | undefined
): { imports: JavaScriptImportMap; render: string } | undefined {
  if (!defaultsTo) return undefined;

  if (input.kind === 'account') {
    return renderJavaScriptInstructionDefaults(
      { ...input, defaultsTo: defaultsTo as InstructionAccountDefault },
      optionalAccountStrategy
    );
  }

  return renderJavaScriptInstructionDefaults(
    { ...input, defaultsTo: defaultsTo as InstructionArgDefault },
    optionalAccountStrategy
  );
}
