import { RegisteredValueNodeKinds, ValueNode } from '../../nodes';
import { pascalCase } from '../../shared';
import { Visitor, visit } from '../../visitors';
import { RustImportMap } from './RustImportMap';

export function renderValueNode(
  value: ValueNode,
  useStr: boolean = false
): {
  imports: RustImportMap;
  render: string;
} {
  return visit(value, renderValueNodeVisitor(useStr));
}

export function renderValueNodeVisitor(useStr: boolean = false): Visitor<
  {
    imports: RustImportMap;
    render: string;
  },
  RegisteredValueNodeKinds
> {
  return {
    visitArrayValue(node) {
      const list = node.items.map((v) => visit(v, this));
      return {
        imports: new RustImportMap().mergeWith(...list.map((c) => c.imports)),
        render: `[${list.map((c) => c.render).join(', ')}]`,
      };
    },
    visitBooleanValue(node) {
      return {
        imports: new RustImportMap(),
        render: JSON.stringify(node.boolean),
      };
    },
    visitEnumValue(node) {
      const imports = new RustImportMap();
      const enumName = pascalCase(node.enum.name);
      const variantName = pascalCase(node.variant);
      const importFrom = node.enum.importFrom ?? 'generatedTypes';
      imports.add(`${importFrom}::${enumName}`);
      if (!node.value) {
        return { imports, render: `${enumName}::${variantName}` };
      }
      const enumValue = visit(node.value, this);
      const fields = enumValue.render;
      return {
        imports: imports.mergeWith(enumValue.imports),
        render: `${enumName}::${variantName} ${fields}`,
      };
    },
    visitMapValue(node) {
      const map = node.entries.map(([k, v]) => {
        const mapKey = visit(k, this);
        const mapValue = visit(v, this);
        return {
          imports: mapKey.imports.mergeWith(mapValue.imports),
          render: `[${mapKey.render}, ${mapValue.render}]`,
        };
      });
      const imports = new RustImportMap().add('std::collection::HashMap');
      return {
        imports: imports.mergeWith(...map.map((c) => c.imports)),
        render: `HashMap::from([${map.map((c) => c.render).join(', ')}])`,
      };
    },
    visitNoneValue() {
      return {
        imports: new RustImportMap(),
        render: 'None',
      };
    },
    visitNumberValue(node) {
      return {
        imports: new RustImportMap(),
        render: JSON.stringify(node.number),
      };
    },
    visitPublicKeyValue(node) {
      return {
        imports: new RustImportMap().add('solana_program::pubkey'),
        render: `pubkey!("${node.publicKey}")`,
      };
    },
    visitSetValue(node) {
      const set = node.items.map((v) => visit(v, this));
      const imports = new RustImportMap().add('std::collection::HashSet');
      return {
        imports: imports.mergeWith(...set.map((c) => c.imports)),
        render: `HashSet::from([${set.map((c) => c.render).join(', ')}])`,
      };
    },
    visitSomeValue(node) {
      const child = visit(node.value, this);
      return {
        ...child,
        render: `Some(${child.render})`,
      };
    },
    visitStringValue(node) {
      return {
        imports: new RustImportMap(),
        render: useStr
          ? `${JSON.stringify(node.string)}`
          : `String::from(${JSON.stringify(node.string)})`,
      };
    },
    visitStructValue(node) {
      const struct = Object.entries(node.fields).map(([k, v]) => {
        const structValue = visit(v, this);
        return {
          imports: structValue.imports,
          render: `${k}: ${structValue.render}`,
        };
      });
      return {
        imports: new RustImportMap().mergeWith(...struct.map((c) => c.imports)),
        render: `{ ${struct.map((c) => c.render).join(', ')} }`,
      };
    },
    visitTupleValue(node) {
      const tuple = node.items.map((v) => visit(v, this));
      return {
        imports: new RustImportMap().mergeWith(...tuple.map((c) => c.imports)),
        render: `(${tuple.map((c) => c.render).join(', ')})`,
      };
    },
  };
}
