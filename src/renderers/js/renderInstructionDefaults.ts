import { InstructionInputValueNode, isNode } from '../../nodes';
import { MainCaseString, camelCase, pascalCase } from '../../shared';
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

  if (!input.defaultsTo) {
    return { imports, interfaces, render: '' };
  }

  const { defaultsTo } = input;
  const render = (
    defaultValue: string,
    isWritable?: boolean
  ): {
    imports: JavaScriptImportMap;
    interfaces: JavaScriptContextMap;
    render: string;
  } => {
    const inputName = camelCase(input.name);
    if (
      input.kind === 'instructionAccountNode' &&
      isNode(defaultsTo, 'resolverValueNode')
    ) {
      return {
        imports,
        interfaces,
        render: `resolvedAccounts.${inputName} = { ...resolvedAccounts.${inputName}, ...${defaultValue} };`,
      };
    }
    if (input.kind === 'instructionAccountNode' && isWritable === undefined) {
      return {
        imports,
        interfaces,
        render: `resolvedAccounts.${inputName}.value = ${defaultValue};`,
      };
    }
    if (input.kind === 'instructionAccountNode') {
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
    case 'accountValueNode':
      const name = camelCase(defaultsTo.name);
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
      const pdaFunction = `find${pascalCase(defaultsTo.pda.name)}Pda`;
      const pdaImportFrom = defaultsTo.pda.importFrom ?? 'generatedAccounts';
      imports.add(pdaImportFrom, pdaFunction);
      interfaces.add('eddsa');
      const pdaArgs = ['context'];
      const pdaSeeds = Object.keys(defaultsTo.seeds).map(
        (seed: string): string => {
          const seedValue = defaultsTo.seeds[seed as MainCaseString];
          if (isNode(seedValue, 'accountValueNode')) {
            imports.add('shared', 'expectPublicKey');
            return `${seed}: expectPublicKey(resolvedAccounts.${camelCase(
              seedValue.name
            )}.value)`;
          }
          if (isNode(seedValue, 'argumentValueNode')) {
            imports.add('shared', 'expectSome');
            return `${seed}: expectSome(${argObject}.${camelCase(
              seedValue.name
            )})`;
          }
          const valueManifest = visit(seedValue, valueNodeVisitor);
          imports.mergeWith(valueManifest.imports);
          return `${seed}: ${valueManifest.render}`;
        }
      );
      if (pdaSeeds.length > 0) {
        pdaArgs.push(`{ ${pdaSeeds.join(', ')} }`);
      }
      return render(`${pdaFunction}(${pdaArgs.join(', ')})`);
    case 'publicKeyValueNode':
      imports.add('umi', 'publicKey');
      return render(`publicKey('${defaultsTo.publicKey}')`);
    case 'programLinkNode':
      const importFrom = defaultsTo.importFrom ?? 'generatedPrograms';
      const functionName = `get${pascalCase(defaultsTo.name)}ProgramId`;
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
        `expectPda(resolvedAccounts.${camelCase(defaultsTo.name)}.value)[1]`
      );
    case 'argumentValueNode':
      imports.add('shared', 'expectSome');
      return render(`expectSome(${argObject}.${camelCase(defaultsTo.name)})`);
    case 'resolverValueNode':
      const resolverName = camelCase(defaultsTo.name);
      const isWritable =
        input.kind === 'instructionAccountNode' && input.isWritable
          ? 'true'
          : 'false';
      imports.add(defaultsTo.importFrom ?? 'hooked', resolverName);
      interfaces.add(['eddsa', 'identity', 'payer']);
      return render(
        `${resolverName}(context, resolvedAccounts, ${argObject}, programId, ${isWritable})`
      );
    case 'conditionalValueNode':
      const ifTrueRenderer = renderNestedInstructionDefault(
        input,
        valueNodeVisitor,
        optionalAccountStrategy,
        defaultsTo.ifTrue,
        argObject
      );
      const ifFalseRenderer = renderNestedInstructionDefault(
        input,
        valueNodeVisitor,
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

      if (isNode(defaultsTo.condition, 'resolverValueNode')) {
        const conditionalResolverName = camelCase(defaultsTo.condition.name);
        const conditionalIsWritable =
          input.kind === 'instructionAccountNode' && input.isWritable
            ? 'true'
            : 'false';
        imports.add(
          defaultsTo.condition.importFrom ?? 'hooked',
          conditionalResolverName
        );
        interfaces.add(['eddsa', 'identity', 'payer']);
        condition = `${conditionalResolverName}(context, resolvedAccounts, ${argObject}, programId, ${conditionalIsWritable})`;
        condition = negatedCondition ? `!${condition}` : condition;
      } else {
        const comparedInputName = isNode(
          defaultsTo.condition,
          'accountValueNode'
        )
          ? `resolvedAccounts.${camelCase(defaultsTo.condition.name)}.value`
          : `${argObject}.${camelCase(defaultsTo.condition.name)}`;
        if (defaultsTo.value) {
          const comparedValue = visit(defaultsTo.value, valueNodeVisitor);
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
      const valueManifest = visit(defaultsTo, valueNodeVisitor);
      imports.mergeWith(valueManifest.imports);
      return render(valueManifest.render);
  }
}

function renderNestedInstructionDefault(
  input: ResolvedInstructionInput,
  valueNodeVisitor: ReturnType<typeof renderValueNodeVisitor>,
  optionalAccountStrategy: 'programId' | 'omitted',
  defaultsTo: InstructionInputValueNode | undefined,
  argObject: string
):
  | {
      imports: JavaScriptImportMap;
      interfaces: JavaScriptContextMap;
      render: string;
    }
  | undefined {
  if (!defaultsTo) return undefined;
  return renderInstructionDefaults(
    { ...input, defaultsTo },
    valueNodeVisitor,
    optionalAccountStrategy,
    argObject
  );
}
