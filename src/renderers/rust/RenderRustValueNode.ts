import * as nodes from '../../nodes';
import { pascalCase } from '../../shared';
import { RustImportMap } from './RustImportMap';

export function renderRustValueNode(value: nodes.ValueNode): {
  imports: RustImportMap;
  render: string;
} {
  const imports = new RustImportMap();
  switch (value.kind) {
    case 'list':
      const list = value.values.map((v) => renderRustValueNode(v));
      return {
        imports: imports.mergeWith(...list.map((c) => c.imports)),
        render: `[${list.map((c) => c.render).join(', ')}]`,
      };
    case 'tuple':
      const tuple = value.values.map((v) => renderRustValueNode(v));
      return {
        imports: imports.mergeWith(...tuple.map((c) => c.imports)),
        render: `(${tuple.map((c) => c.render).join(', ')})`,
      };
    case 'set':
      const set = value.values.map((v) => renderRustValueNode(v));
      imports.add('std::collection::HashSet');
      return {
        imports: imports.mergeWith(...set.map((c) => c.imports)),
        render: `HashSet::from([${set.map((c) => c.render).join(', ')}])`,
      };
    case 'map':
      const map = value.values.map(([k, v]) => {
        const mapKey = renderRustValueNode(k);
        const mapValue = renderRustValueNode(v);
        return {
          imports: mapKey.imports.mergeWith(mapValue.imports),
          render: `[${mapKey.render}, ${mapValue.render}]`,
        };
      });
      imports.add('std::collection::HashMap');
      return {
        imports: imports.mergeWith(...map.map((c) => c.imports)),
        render: `HashMap::from([${map.map((c) => c.render).join(', ')}])`,
      };
    case 'struct':
      const struct = Object.entries(value.values).map(([k, v]) => {
        const structValue = renderRustValueNode(v);
        return {
          imports: structValue.imports,
          render: `${k}: ${structValue.render}`,
        };
      });
      return {
        imports: imports.mergeWith(...struct.map((c) => c.imports)),
        render: `{ ${struct.map((c) => c.render).join(', ')} }`,
      };
    case 'enum':
      const enumName = pascalCase(value.enumType);
      const variantName = pascalCase(value.variant);
      const rawImportFrom = value.importFrom ?? 'generated';
      const importFrom =
        rawImportFrom === 'generated' ? 'generatedTypes' : rawImportFrom;
      if (value.value === 'scalar' || value.value === 'empty') {
        return {
          imports: imports.add(`${importFrom}::${enumName}`),
          render: `${enumName}::${variantName}`,
        };
      }
      const enumValue = renderRustValueNode(value.value);
      const fields = enumValue.render;
      imports.mergeWith(enumValue.imports);
      return {
        imports,
        render: `${enumName}::${variantName} ${fields}`,
      };
    case 'optionSome':
      const child = renderRustValueNode(value.value);
      return {
        ...child,
        render: `Some(${child.render})`,
      };
    case 'optionNone':
      return {
        imports: new RustImportMap(),
        render: 'None',
      };
    case 'publicKey':
      return {
        imports: new RustImportMap().add('solana_program::pubkey'),
        render: `pubkey!("${value.value}")`,
      };
    case 'string':
    case 'number':
    case 'boolean':
      return { imports, render: JSON.stringify(value.value) };
    default:
      const neverDefault: never = value;
      throw new Error(`Unexpected value type ${(neverDefault as any).kind}`);
  }
}
