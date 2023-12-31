import { RegisteredValueNodes } from '../../nodes';
import { pascalCase } from '../../shared';
import { Visitor, visit } from '../../visitors';
import { Fragment, fragment, mergeFragments } from './fragments';
import { NameApi } from './nameTransformers';

export function renderValueNodeVisitor(
  nameApi: NameApi
): Visitor<Fragment, keyof RegisteredValueNodes> {
  return {
    visitArrayValue(node) {
      return mergeFragments(
        node.items.map((v) => visit(v, this)),
        (renders) => `[${renders.join(', ')}]`
      );
    },
    visitBooleanValue(node) {
      return fragment(JSON.stringify(node.boolean));
    },
    visitEnumValue(node) {
      const enumName = nameApi.dataType(node.enumType);
      const enumFunction = nameApi.dataEnumFunction(node.enumType);
      const variantName = pascalCase(node.variant);
      const importFrom = node.importFrom ?? 'generatedTypes';

      if (node.value === 'scalar') {
        return fragment(`${enumName}.${variantName}`).addImports(
          importFrom,
          enumName
        );
      }

      if (node.value === 'empty') {
        return fragment(`${enumFunction}('${variantName}')`).addImports(
          importFrom,
          enumFunction
        );
      }

      return visit(node.value, this)
        .mapRender((r) => `${enumFunction}('${variantName}', ${r})`)
        .addImports(importFrom, enumFunction);
    },
    visitMapValue(node) {
      const entryFragments = node.entries.map(([k, v]) =>
        mergeFragments(
          [visit(k, this), visit(v, this)],
          (renders) => `[${renders.join(', ')}]`
        )
      );
      return mergeFragments(
        entryFragments,
        (renders) => `new Map([${renders.join(', ')}])`
      );
    },
    visitNoneValue() {
      return fragment('none()').addImports('solanaOptions', 'none');
    },
    visitNumberValue(node) {
      return fragment(JSON.stringify(node.number));
    },
    visitPublicKeyValue(node) {
      return fragment(`address("${node.publicKey}")`).addImports(
        'solanaAddresses',
        'address'
      );
    },
    visitSetValue(node) {
      return mergeFragments(
        node.items.map((v) => visit(v, this)),
        (renders) => `new Set([${renders.join(', ')}])`
      );
    },
    visitSomeValue(node) {
      return visit(node.value, this)
        .mapRender((r) => `some(${r})`)
        .addImports('solanaOptions', 'some');
    },
    visitStringValue(node) {
      return fragment(JSON.stringify(node.string));
    },
    visitStructValue(node) {
      const fieldFragments = Object.entries(node.fields).map(([k, v]) =>
        visit(v, this).mapRender((r) => `${k}: ${r}`)
      );
      return mergeFragments(
        fieldFragments,
        (renders) => `{ ${renders.join(', ')} }`
      );
    },
    visitTupleValue(node) {
      return mergeFragments(
        node.items.map((v) => visit(v, this)),
        (renders) => `[${renders.join(', ')}]`
      );
    },
  };
}
