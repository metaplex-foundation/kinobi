import { InstructionInputValueNode, isNode } from '../../nodes';
import { camelCase, pascalCase } from '../../shared';
import { ResolvedInstructionInput, visit } from '../../visitors';
import { JavaScriptContextMap } from './JavaScriptContextMap';
import { JavaScriptImportMap } from './JavaScriptImportMap';
import { renderValueNodeVisitor } from './renderValueNodeVisitor';

export function renderInstructionDefaults(
  input: ResolvedInstructionInput,
  valueNodeVisitor: ReturnType<typeof renderValueNodeVisitor>,
  optionalAccountStrategy: 'programId' | 'omitted',
  argObject: string
): {
  imports: JavaScriptImportMap;
  interfaces: JavaScriptContextMap;
  render: string;
} {
  const imports = new JavaScriptImportMap();
  const interfaces = new JavaScriptContextMap();

  if (!input.defaultValue) {
    return { imports, interfaces, render: '' };
  }

  const { defaultValue } = input;
  const render = (
    renderedValue: string,
    isWritable?: boolean
  ): {
    imports: JavaScriptImportMap;
    interfaces: JavaScriptContextMap;
    render: string;
  } => {
    const inputName = camelCase(input.name);
    if (
      input.kind === 'instructionAccountNode' &&
      isNode(defaultValue, 'resolverValueNode')
    ) {
      return {
        imports,
        interfaces,
        render: `resolvedAccounts.${inputName} = { ...resolvedAccounts.${inputName}, ...${renderedValue} };`,
      };
    }
    if (input.kind === 'instructionAccountNode' && isWritable === undefined) {
      return {
        imports,
        interfaces,
        render: `resolvedAccounts.${inputName}.value = ${renderedValue};`,
      };
    }
    if (input.kind === 'instructionAccountNode') {
      return {
        imports,
        interfaces,
        render:
          `resolvedAccounts.${inputName}.value = ${renderedValue};\n` +
          `resolvedAccounts.${inputName}.isWritable = ${
            isWritable ? 'true' : 'false'
          }`,
      };
    }
    return {
      imports,
      interfaces,
      render: `${argObject}.${inputName} = ${renderedValue};`,
    };
  };

  switch (defaultValue.kind) {
    case 'accountValueNode':
      const name = camelCase(defaultValue.name);
      if (input.kind === 'instructionAccountNode') {
        imports.add('shared', 'expectSome');
        if (input.resolvedIsSigner && !input.isSigner) {
          return render(`expectSome(resolvedAccounts.${name}.value).publicKey`);
        }
        return render(`expectSome(resolvedAccounts.${name}.value)`);
      }
      imports.add('shared', 'expectPublicKey');
      return render(`expectPublicKey(resolvedAccounts.${name}.value)`);
    case 'pdaValueNode':
      const pdaFunction = `find${pascalCase(defaultValue.pda.name)}Pda`;
      const pdaImportFrom = defaultValue.pda.importFrom ?? 'generatedAccounts';
      imports.add(pdaImportFrom, pdaFunction);
      interfaces.add('eddsa');
      const pdaArgs = ['context'];
      const pdaSeeds = defaultValue.seeds.map((seed): string => {
        if (isNode(seed.value, 'accountValueNode')) {
          imports.add('shared', 'expectPublicKey');
          return `${seed.name}: expectPublicKey(resolvedAccounts.${camelCase(
            seed.value.name
          )}.value)`;
        }
        if (isNode(seed.value, 'argumentValueNode')) {
          imports.add('shared', 'expectSome');
          return `${seed.name}: expectSome(${argObject}.${camelCase(
            seed.value.name
          )})`;
        }
        const valueManifest = visit(seed.value, valueNodeVisitor);
        imports.mergeWith(valueManifest.imports);
        return `${seed.name}: ${valueManifest.render}`;
      });
      if (pdaSeeds.length > 0) {
        pdaArgs.push(`{ ${pdaSeeds.join(', ')} }`);
      }
      return render(`${pdaFunction}(${pdaArgs.join(', ')})`);
    case 'publicKeyValueNode':
      if (!defaultValue.identifier) {
        imports.add('umi', 'publicKey');
        return render(`publicKey('${defaultValue.publicKey}')`);
      }
      interfaces.add('programs');
      return render(
        `context.programs.getPublicKey('${defaultValue.identifier}', '${defaultValue.publicKey}')`,
        false
      );
    case 'programLinkNode':
      const importFrom = defaultValue.importFrom ?? 'generatedPrograms';
      const functionName = `get${pascalCase(defaultValue.name)}ProgramId`;
      imports.add(importFrom, functionName);
      return render(`${functionName}(context)`, false);
    case 'programIdValueNode':
      if (
        optionalAccountStrategy === 'programId' &&
        input.kind === 'instructionAccountNode' &&
        input.isOptional
      ) {
        return { imports, interfaces, render: '' };
      }
      return render('programId', false);
    case 'identityValueNode':
      interfaces.add('identity');
      if (input.kind === 'instructionAccountNode' && input.isSigner !== false) {
        return render('context.identity');
      }
      return render('context.identity.publicKey');
    case 'payerValueNode':
      interfaces.add('payer');
      if (input.kind === 'instructionAccountNode' && input.isSigner !== false) {
        return render('context.payer');
      }
      return render('context.payer.publicKey');
    case 'accountBumpValueNode':
      imports.add('shared', 'expectPda');
      return render(
        `expectPda(resolvedAccounts.${camelCase(defaultValue.name)}.value)[1]`
      );
    case 'argumentValueNode':
      imports.add('shared', 'expectSome');
      return render(`expectSome(${argObject}.${camelCase(defaultValue.name)})`);
    case 'resolverValueNode':
      const resolverName = camelCase(defaultValue.name);
      const isWritable =
        input.kind === 'instructionAccountNode' && input.isWritable
          ? 'true'
          : 'false';
      imports.add(defaultValue.importFrom ?? 'hooked', resolverName);
      interfaces.add(['eddsa', 'identity', 'payer']);
      return render(
        `${resolverName}(context, resolvedAccounts, ${argObject}, programId, ${isWritable})`
      );
    case 'conditionalValueNode':
      const ifTrueRenderer = renderNestedInstructionDefault(
        input,
        valueNodeVisitor,
        optionalAccountStrategy,
        defaultValue.ifTrue,
        argObject
      );
      const ifFalseRenderer = renderNestedInstructionDefault(
        input,
        valueNodeVisitor,
        optionalAccountStrategy,
        defaultValue.ifFalse,
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

      if (isNode(defaultValue.condition, 'resolverValueNode')) {
        const conditionalResolverName = camelCase(defaultValue.condition.name);
        const conditionalIsWritable =
          input.kind === 'instructionAccountNode' && input.isWritable
            ? 'true'
            : 'false';
        imports.add(
          defaultValue.condition.importFrom ?? 'hooked',
          conditionalResolverName
        );
        interfaces.add(['eddsa', 'identity', 'payer']);
        condition = `${conditionalResolverName}(context, resolvedAccounts, ${argObject}, programId, ${conditionalIsWritable})`;
        condition = negatedCondition ? `!${condition}` : condition;
      } else {
        const comparedInputName = isNode(
          defaultValue.condition,
          'accountValueNode'
        )
          ? `resolvedAccounts.${camelCase(defaultValue.condition.name)}.value`
          : `${argObject}.${camelCase(defaultValue.condition.name)}`;
        if (defaultValue.value) {
          const comparedValue = visit(defaultValue.value, valueNodeVisitor);
          imports.mergeWith(comparedValue.imports);
          const operator = negatedCondition ? '!==' : '===';
          condition = `${comparedInputName} ${operator} ${comparedValue.render}`;
        } else {
          condition = negatedCondition
            ? `!${comparedInputName}`
            : comparedInputName;
        }
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
      const valueManifest = visit(defaultValue, valueNodeVisitor);
      imports.mergeWith(valueManifest.imports);
      return render(valueManifest.render);
  }
}

function renderNestedInstructionDefault(
  input: ResolvedInstructionInput,
  valueNodeVisitor: ReturnType<typeof renderValueNodeVisitor>,
  optionalAccountStrategy: 'programId' | 'omitted',
  defaultValue: InstructionInputValueNode | undefined,
  argObject: string
):
  | {
      imports: JavaScriptImportMap;
      interfaces: JavaScriptContextMap;
      render: string;
    }
  | undefined {
  if (!defaultValue) return undefined;
  return renderInstructionDefaults(
    { ...input, defaultValue },
    valueNodeVisitor,
    optionalAccountStrategy,
    argObject
  );
}
