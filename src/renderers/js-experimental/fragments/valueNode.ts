import * as nodes from '../../../nodes';
import { camelCase, pascalCase } from '../../../shared';
import { Fragment, fragment, mergeFragments } from './common';

export function getValueNodeFragment(value: nodes.ValueNode): Fragment {
  switch (value.kind) {
    case 'list':
    case 'tuple':
      return mergeFragments(
        value.values.map((v) => getValueNodeFragment(v)),
        (renders) => `[${renders.join(', ')}]`
      );
    case 'set':
      return mergeFragments(
        value.values.map((v) => getValueNodeFragment(v)),
        (renders) => `new Set([${renders.join(', ')}])`
      );
    case 'map':
      const entryFragments = value.values.map(([k, v]) =>
        mergeFragments(
          [getValueNodeFragment(k), getValueNodeFragment(v)],
          (renders) => `[${renders.join(', ')}]`
        )
      );
      return mergeFragments(
        entryFragments,
        (renders) => `new Map([${renders.join(', ')}])`
      );
    case 'struct':
      const fieldFragments = Object.entries(value.values).map(([k, v]) =>
        getValueNodeFragment(v).mapRender((r) => `${k}: ${r}`)
      );
      return mergeFragments(
        fieldFragments,
        (renders) => `{ ${renders.join(', ')} }`
      );
    case 'enum':
      const enumName = pascalCase(value.enumType);
      const enumFn = camelCase(value.enumType);
      const variantName = pascalCase(value.variant);
      const rawImportFrom = value.importFrom ?? 'generated';
      const importFrom =
        rawImportFrom === 'generated' ? 'generatedTypes' : rawImportFrom;

      if (value.value === 'scalar') {
        return fragment(`${enumName}.${variantName}`).addImports(
          importFrom,
          enumName
        );
      }

      if (value.value === 'empty') {
        return fragment(`${enumFn}('${variantName}')`).addImports(
          importFrom,
          enumFn
        );
      }

      return getValueNodeFragment(value.value)
        .mapRender((r) => `${enumFn}('${variantName}', ${r})`)
        .addImports(importFrom, enumFn);
    case 'optionSome':
      return getValueNodeFragment(value.value)
        .mapRender((r) => `some(${r})`)
        .addImports('solanaOptions', 'some');
    case 'optionNone':
      return fragment('none()').addImports('solanaOptions', 'none');
    case 'publicKey':
      return fragment(`address("${value.value}")`).addImports(
        'solanaAddresses',
        'address'
      );
    case 'string':
    case 'number':
    case 'boolean':
      return fragment(JSON.stringify(value.value));
    default:
      const neverDefault: never = value;
      throw new Error(`Unexpected value type ${(neverDefault as any).kind}`);
  }
}
