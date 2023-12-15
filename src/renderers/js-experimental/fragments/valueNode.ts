import * as nodes from '../../../nodes';
import { pascalCase } from '../../../shared';
import { NameApi } from '../nameTransformers';
import { Fragment, fragment, mergeFragments } from './common';

export function getValueNodeFragment(
  value: nodes.ValueNode,
  nameApi: NameApi
): Fragment {
  switch (value.kind) {
    case 'list':
    case 'tuple':
      return mergeFragments(
        value.values.map((v) => getValueNodeFragment(v, nameApi)),
        (renders) => `[${renders.join(', ')}]`
      );
    case 'set':
      return mergeFragments(
        value.values.map((v) => getValueNodeFragment(v, nameApi)),
        (renders) => `new Set([${renders.join(', ')}])`
      );
    case 'map':
      const entryFragments = value.values.map(([k, v]) =>
        mergeFragments(
          [getValueNodeFragment(k, nameApi), getValueNodeFragment(v, nameApi)],
          (renders) => `[${renders.join(', ')}]`
        )
      );
      return mergeFragments(
        entryFragments,
        (renders) => `new Map([${renders.join(', ')}])`
      );
    case 'struct':
      const fieldFragments = Object.entries(value.values).map(([k, v]) =>
        getValueNodeFragment(v, nameApi).mapRender((r) => `${k}: ${r}`)
      );
      return mergeFragments(
        fieldFragments,
        (renders) => `{ ${renders.join(', ')} }`
      );
    case 'enum':
      const enumName = nameApi.dataType(value.enumType);
      const enumFunction = nameApi.dataEnumFunction(value.enumType);
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
        return fragment(`${enumFunction}('${variantName}')`).addImports(
          importFrom,
          enumFunction
        );
      }

      return getValueNodeFragment(value.value, nameApi)
        .mapRender((r) => `${enumFunction}('${variantName}', ${r})`)
        .addImports(importFrom, enumFunction);
    case 'optionSome':
      return getValueNodeFragment(value.value, nameApi)
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
