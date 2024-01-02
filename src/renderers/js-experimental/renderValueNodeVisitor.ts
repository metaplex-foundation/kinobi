import { RegisteredValueNodeKind, isNode, isScalarEnum } from '../../nodes';
import { LinkableDictionary, MainCaseString, pascalCase } from '../../shared';
import { Visitor, visit } from '../../visitors';
import { Fragment, fragment, mergeFragments } from './fragments';
import { NameApi } from './nameTransformers';

export type ValueNodeVisitor = ReturnType<typeof renderValueNodeVisitor>;

export function renderValueNodeVisitor(input: {
  nameApi: NameApi;
  linkables: LinkableDictionary;
  nonScalarEnums: MainCaseString[];
}): Visitor<Fragment, RegisteredValueNodeKind> {
  const { nameApi, linkables, nonScalarEnums } = input;
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
      const enumName = nameApi.dataType(node.enum.name);
      const enumFunction = nameApi.dataEnumFunction(node.enum.name);
      const variantName = pascalCase(node.variant);
      const importFrom = node.enum.importFrom ?? 'generatedTypes';

      const enumNode = linkables.get(node.enum);
      const isScalar =
        enumNode && isNode(enumNode, 'enumTypeNode')
          ? isScalarEnum(enumNode)
          : !nonScalarEnums.includes(node.enum.name);

      if (!node.value && isScalar) {
        return fragment(`${enumName}.${variantName}`).addImports(
          importFrom,
          enumName
        );
      }

      if (!node.value) {
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
      const entryFragments = node.entries.map((entry) => visit(entry, this));
      return mergeFragments(
        entryFragments,
        (renders) => `new Map([${renders.join(', ')}])`
      );
    },
    visitMapEntryValue(node) {
      return mergeFragments(
        [visit(node.key, this), visit(node.value, this)],
        (renders) => `[${renders.join(', ')}]`
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
