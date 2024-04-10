import {
  RegisteredValueNode,
  ValueNode,
  arrayValueNode,
  bytesValueNode,
  getBytesFromBytesValueNode,
  isNode,
  numberValueNode,
} from '../../nodes';
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
  RegisteredValueNode['kind']
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
    visitBytesValue(node) {
      const bytes = getBytesFromBytesValueNode(node);
      const numbers = Array.from(bytes).map(numberValueNode);
      return visit(arrayValueNode(numbers), this);
    },
    visitConstantValue(node) {
      if (isNode(node.value, 'bytesValueNode')) {
        return visit(node.value, this);
      }
      if (
        isNode(node.type, 'stringTypeNode') &&
        isNode(node.value, 'stringValueNode')
      ) {
        return visit(
          bytesValueNode(node.type.encoding, node.value.string),
          this
        );
      }
      if (
        isNode(node.type, 'numberTypeNode') &&
        isNode(node.value, 'numberValueNode')
      ) {
        const numberManifest = visit(node.value, this);
        const { format, endian } = node.type;
        const byteFunction = endian === 'le' ? 'to_le_bytes' : 'to_be_bytes';
        numberManifest.render = `${numberManifest.render}${format}.${byteFunction}()`;
        return numberManifest;
      }
      throw new Error('Unsupported constant value type.');
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
      const map = node.entries.map((entry) => visit(entry, this));
      const imports = new RustImportMap().add('std::collection::HashMap');
      return {
        imports: imports.mergeWith(...map.map((c) => c.imports)),
        render: `HashMap::from([${map.map((c) => c.render).join(', ')}])`,
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
        imports: new RustImportMap(),
        render: 'None',
      };
    },
    visitNumberValue(node) {
      return {
        imports: new RustImportMap(),
        render: node.number.toString(),
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
      const struct = node.fields.map((field) => visit(field, this));
      return {
        imports: new RustImportMap().mergeWith(...struct.map((c) => c.imports)),
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
      const tuple = node.items.map((v) => visit(v, this));
      return {
        imports: new RustImportMap().mergeWith(...tuple.map((c) => c.imports)),
        render: `(${tuple.map((c) => c.render).join(', ')})`,
      };
    },
  };
}
