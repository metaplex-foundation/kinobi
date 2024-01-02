import { RegisteredValueNodeKind, isNode, isScalarEnum } from '../../nodes';
import {
  LinkableDictionary,
  MainCaseString,
  camelCase,
  pascalCase,
} from '../../shared';
import { Visitor, visit } from '../../visitors';
import { JavaScriptImportMap } from './JavaScriptImportMap';

export function renderValueNodeVisitor(input: {
  linkables: LinkableDictionary;
  nonScalarEnums: MainCaseString[];
}): Visitor<
  {
    imports: JavaScriptImportMap;
    render: string;
  },
  RegisteredValueNodeKind
> {
  const { linkables, nonScalarEnums } = input;
  return {
    visitArrayValue(node) {
      const list = node.items.map((v) => visit(v, this));
      return {
        imports: new JavaScriptImportMap().mergeWith(
          ...list.map((c) => c.imports)
        ),
        render: `[${list.map((c) => c.render).join(', ')}]`,
      };
    },
    visitBooleanValue(node) {
      return {
        imports: new JavaScriptImportMap(),
        render: JSON.stringify(node.boolean),
      };
    },
    visitEnumValue(node) {
      const imports = new JavaScriptImportMap();
      const enumName = pascalCase(node.enum.name);
      const variantName = pascalCase(node.variant);
      const importFrom = node.enum.importFrom ?? 'generatedTypes';

      const enumNode = linkables.get(node.enum);
      const isScalar =
        enumNode && isNode(enumNode, 'enumTypeNode')
          ? isScalarEnum(enumNode)
          : !nonScalarEnums.includes(node.enum.name);

      if (!node.value && isScalar) {
        return {
          imports: imports.add(importFrom, enumName),
          render: `${enumName}.${variantName}`,
        };
      }

      const enumFn = camelCase(node.enum.name);
      imports.add(importFrom, enumFn);

      if (!node.value) {
        return { imports, render: `${enumFn}('${variantName}')` };
      }

      const enumValue = visit(node.value, this);
      const fields = enumValue.render;
      imports.mergeWith(enumValue.imports);

      return {
        imports,
        render: `${enumFn}('${variantName}', ${fields})`,
      };
    },
    visitMapValue(node) {
      const map = node.entries.map((entry) => visit(entry, this));
      return {
        imports: new JavaScriptImportMap().mergeWith(
          ...map.map((c) => c.imports)
        ),
        render: `new Map([${map.map((c) => c.render).join(', ')}])`,
      };
    },
    visitMapEntryValue(node) {
      const mapKey = visit(node.key, this);
      const mapValue = visit(node.value, this);
      return {
        imports: mapKey.imports.mergeWith(mapValue.imports),
        render: `[${mapKey.render}, ${mapValue.render}]`,
      };
    },
    visitNoneValue() {
      return {
        imports: new JavaScriptImportMap().add('umi', 'none'),
        render: 'none()',
      };
    },
    visitNumberValue(node) {
      return {
        imports: new JavaScriptImportMap(),
        render: JSON.stringify(node.number),
      };
    },
    visitPublicKeyValue(node) {
      return {
        imports: new JavaScriptImportMap().add('umi', 'publicKey'),
        render: `publicKey("${node.publicKey}")`,
      };
    },
    visitSetValue(node) {
      const set = node.items.map((v) => visit(v, this));
      return {
        imports: new JavaScriptImportMap().mergeWith(
          ...set.map((c) => c.imports)
        ),
        render: `new Set([${set.map((c) => c.render).join(', ')}])`,
      };
    },
    visitSomeValue(node) {
      const child = visit(node.value, this);
      return {
        imports: child.imports.add('umi', 'some'),
        render: `some(${child.render})`,
      };
    },
    visitStringValue(node) {
      return {
        imports: new JavaScriptImportMap(),
        render: JSON.stringify(node.string),
      };
    },
    visitStructValue(node) {
      const struct = node.fields.map((field) => visit(field, this));
      return {
        imports: new JavaScriptImportMap().mergeWith(
          ...struct.map((c) => c.imports)
        ),
        render: `{ ${struct.map((c) => c.render).join(', ')} }`,
      };
    },
    visitStructFieldValue(node) {
      const structValue = visit(node.value, this);
      return {
        imports: structValue.imports,
        render: `${node.name}: ${structValue.render}`,
      };
    },
    visitTupleValue(node) {
      const list = node.items.map((v) => visit(v, this));
      return {
        imports: new JavaScriptImportMap().mergeWith(
          ...list.map((c) => c.imports)
        ),
        render: `[${list.map((c) => c.render).join(', ')}]`,
      };
    },
  };
}
