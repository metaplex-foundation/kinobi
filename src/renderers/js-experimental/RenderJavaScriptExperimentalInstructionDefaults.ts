import {
  InstructionAccountDefault,
  InstructionArgDefault,
  InstructionDefault,
  camelCase,
  pascalCase,
} from '../../shared';
import { ResolvedInstructionInput } from '../../visitors';
import { JavaScriptExperimentalContextMap } from './JavaScriptExperimentalContextMap';
import { JavaScriptExperimentalImportMap } from './JavaScriptExperimentalImportMap';
import { renderJavaScriptExperimentalValueNode } from './RenderJavaScriptExperimentalValueNode';

export function renderJavaScriptExperimentalInstructionDefaults(
  input: ResolvedInstructionInput,
  optionalAccountStrategy: 'programId' | 'omitted',
  argObject: string
): {
  imports: JavaScriptExperimentalImportMap;
  interfaces: JavaScriptExperimentalContextMap;
  render: string;
} {
  const imports = new JavaScriptExperimentalImportMap();
  const interfaces = new JavaScriptExperimentalContextMap();

  if (!input.defaultsTo) {
    return { imports, interfaces, render: '' };
  }

  const { defaultsTo } = input;
  const render = (
    defaultValue: string,
    isWritable?: boolean
  ): {
    imports: JavaScriptExperimentalImportMap;
    interfaces: JavaScriptExperimentalContextMap;
    render: string;
  } => {
    const inputName = camelCase(input.name);
    if (input.kind === 'account' && defaultsTo.kind === 'resolver') {
      return {
        imports,
        interfaces,
        render: `resolvedAccounts.${inputName} = { ...resolvedAccounts.${inputName}, ...${defaultValue} };`,
      };
    }
    if (input.kind === 'account' && isWritable === undefined) {
      return {
        imports,
        interfaces,
        render: `resolvedAccounts.${inputName}.value = ${defaultValue};`,
      };
    }
    if (input.kind === 'account') {
      return {
        imports,
        interfaces,
        render:
          `resolvedAccounts.${inputName}.value = ${defaultValue};\n` +
          `resolvedAccounts.${inputName}.isWritable = ${
            isWritable ? 'true' : 'false'
          }`,
      };
    }
    return {
      imports,
      interfaces,
      render: `${argObject}.${inputName} = ${defaultValue};`,
    };
  };

  switch (defaultsTo.kind) {
    case 'account':
      const name = camelCase(defaultsTo.name);
      if (input.kind === 'account') {
        imports.add('shared', 'expectSome');
        if (input.resolvedIsSigner && !input.isSigner) {
          return render(`expectSome(resolvedAccounts.${name}.value).publicKey`);
        }
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
      interfaces.add('eddsa');
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
            return `${seed}: expectSome(${argObject}.${camelCase(
              seedValue.name
            )})`;
          }
          const valueManifest = renderJavaScriptExperimentalValueNode(
            seedValue.value
          );
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
        return { imports, interfaces, render: '' };
      }
      return render('programId', false);
    case 'identity':
      interfaces.add('identity');
      if (input.kind === 'account' && input.isSigner !== false) {
        return render('context.identity');
      }
      return render('context.identity.publicKey');
    case 'payer':
      interfaces.add('payer');
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
      return render(`expectSome(${argObject}.${camelCase(defaultsTo.name)})`);
    case 'value':
      const valueManifest = renderJavaScriptExperimentalValueNode(
        defaultsTo.value
      );
      imports.mergeWith(valueManifest.imports);
      return render(valueManifest.render);
    case 'resolver':
      const resolverName = camelCase(defaultsTo.name);
      const isWritable =
        input.kind === 'account' && input.isWritable ? 'true' : 'false';
      imports.add(defaultsTo.importFrom, resolverName);
      interfaces.add(['eddsa', 'identity', 'payer']);
      return render(
        `${resolverName}(context, resolvedAccounts, ${argObject}, programId, ${isWritable})`
      );
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
        return { imports, interfaces, render: '' };
      }
      if (ifTrueRenderer) {
        imports.mergeWith(ifTrueRenderer.imports);
        interfaces.mergeWith(ifTrueRenderer.interfaces);
      }
      if (ifFalseRenderer) {
        imports.mergeWith(ifFalseRenderer.imports);
        interfaces.mergeWith(ifFalseRenderer.interfaces);
      }
      const negatedCondition = !ifTrueRenderer;
      let condition = 'true';

      if (defaultsTo.kind === 'conditional') {
        const comparedInputName =
          defaultsTo.input.kind === 'account'
            ? `resolvedAccounts.${camelCase(defaultsTo.input.name)}.value`
            : `${argObject}.${camelCase(defaultsTo.input.name)}`;
        if (defaultsTo.value) {
          const comparedValue = renderJavaScriptExperimentalValueNode(
            defaultsTo.value
          );
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
        interfaces.add(['eddsa', 'identity', 'payer']);
        condition = `${conditionalResolverName}(context, resolvedAccounts, ${argObject}, programId, ${conditionalIsWritable})`;
        condition = negatedCondition ? `!${condition}` : condition;
      }

      if (ifTrueRenderer && ifFalseRenderer) {
        return {
          imports,
          interfaces,
          render: `if (${condition}) {\n${ifTrueRenderer.render}\n} else {\n${ifFalseRenderer.render}\n}`,
        };
      }

      return {
        imports,
        interfaces,
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
  defaultsTo: InstructionDefault | undefined,
  argObject: string
):
  | {
      imports: JavaScriptExperimentalImportMap;
      interfaces: JavaScriptExperimentalContextMap;
      render: string;
    }
  | undefined {
  if (!defaultsTo) return undefined;

  if (input.kind === 'account') {
    return renderJavaScriptExperimentalInstructionDefaults(
      { ...input, defaultsTo: defaultsTo as InstructionAccountDefault },
      optionalAccountStrategy,
      argObject
    );
  }

  return renderJavaScriptExperimentalInstructionDefaults(
    { ...input, defaultsTo: defaultsTo as InstructionArgDefault },
    optionalAccountStrategy,
    argObject
  );
}
