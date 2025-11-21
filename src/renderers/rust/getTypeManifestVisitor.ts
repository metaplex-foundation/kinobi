import {
  REGISTERED_TYPE_NODE_KINDS,
  arrayTypeNode,
  isNode,
  isScalarEnum,
  numberTypeNode,
} from '../../nodes';
import { pascalCase, pipe, rustDocblock, snakeCase } from '../../shared';
import { extendVisitor, mergeVisitor, visit } from '../../visitors';
import type { Visitor } from '../../visitors';
import type { ByteSizeVisitorKeys } from '../../visitors/getByteSizeVisitor';
import { RustImportMap } from './RustImportMap';

type FixedSizeOptionMetadata = {
  innerType: string;
  byteSize: number;
  sentinel: number[];
};

type FixedSizeOptionFieldMap = Record<string, FixedSizeOptionMetadata>;

export type RustTypeManifest = {
  type: string;
  imports: RustImportMap;
  nestedStructs: string[];
  fixedSizeOption?: FixedSizeOptionMetadata;
  fixedSizeOptionFields?: FixedSizeOptionFieldMap;
  hasFixedSizeOption?: boolean;
};

type ByteSizeVisitor = Visitor<number | null, ByteSizeVisitorKeys>;

export function getTypeManifestVisitor(input: {
  byteSizeVisitor: ByteSizeVisitor;
}) {
  const { byteSizeVisitor } = input;
  let parentName: string | null = null;
  let nestedStruct: boolean = false;
  let inlineStruct: boolean = false;

  const visitor = pipe(
    mergeVisitor<RustTypeManifest>(
      () => ({ type: '', imports: new RustImportMap(), nestedStructs: [] }),
      (_, values) => ({
        ...mergeManifests(values),
        type: values.map((v) => v.type).join('\n'),
      }),
      [
        ...REGISTERED_TYPE_NODE_KINDS,
        'definedTypeLinkNode',
        'definedTypeNode',
        'accountNode',
      ]
    ),
    (v) =>
      extendVisitor(v, {
        visitAccount(account, { self }) {
          parentName = pascalCase(account.name);
          const manifest = visit(account.data, self);
          parentName = null;
          const hasFixed = manifest.hasFixedSizeOption;
          const accountAttributes = hasFixed
            ? `#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
#[derive(Clone, Debug, Eq, PartialEq)]
`
            : `#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
#[cfg_attr(not(feature = "anchor"), derive(BorshSerialize, BorshDeserialize))]
#[cfg_attr(feature = "anchor", derive(AnchorSerialize, AnchorDeserialize))]
#[derive(Clone, Debug, Eq, PartialEq)]
`;
          return {
            ...manifest,
            type: `${accountAttributes}${manifest.type}`,
          };
        },

        visitDefinedType(definedType, { self }) {
          parentName = pascalCase(definedType.name);
          const manifest = visit(definedType.type, self);
          parentName = null;
          const traits = ['Clone', 'Debug', 'Eq', 'PartialEq'];
          if (
            isNode(definedType.type, 'enumTypeNode') &&
            isScalarEnum(definedType.type)
          ) {
            traits.push('PartialOrd', 'Hash', 'FromPrimitive');
            manifest.imports.add(['num_derive::FromPrimitive']);
          }
          const hasFixed = manifest.hasFixedSizeOption;
          const derivedTraits = traits.join(', ');
          const definedTypeAttributes = hasFixed
            ? `#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
#[derive(${derivedTraits})]
`
            : `#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
#[cfg_attr(not(feature = "anchor"), derive(BorshSerialize, BorshDeserialize))]
#[cfg_attr(feature = "anchor", derive(AnchorSerialize, AnchorDeserialize))]
#[derive(${derivedTraits})]
`;
          const nestedAttributes = hasFixed
            ? `#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
#[derive(${derivedTraits})]
`
            : `#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
#[cfg_attr(not(feature = "anchor"), derive(BorshSerialize, BorshDeserialize))]
#[cfg_attr(feature = "anchor", derive(AnchorSerialize, AnchorDeserialize))]
#[derive(${derivedTraits})]
`;
          return {
            ...manifest,
            type: `${definedTypeAttributes}${manifest.type}`,
            nestedStructs: manifest.nestedStructs.map(
              (struct) => `${nestedAttributes}${struct}`
            ),
          };
        },

        visitArrayType(arrayType, { self }) {
          const childManifest = visit(arrayType.item, self);

          if (isNode(arrayType.size, 'fixedSizeNode')) {
            return {
              ...childManifest,
              type: `[${childManifest.type}; ${arrayType.size.size}]`,
            };
          }

          if (
            isNode(arrayType.size, 'prefixedSizeNode') &&
            arrayType.size.prefix.endian === 'le'
          ) {
            switch (arrayType.size.prefix.format) {
              case 'u32':
                return {
                  ...childManifest,
                  type: `Vec<${childManifest.type}>`,
                };
              case 'u8':
              case 'u16':
              case 'u64': {
                const prefix = arrayType.size.prefix.format.toUpperCase();
                childManifest.imports.add(`kaigan::types::${prefix}PrefixVec`);
                return {
                  ...childManifest,
                  type: `${prefix}PrefixVec<${childManifest.type}>`,
                };
              }
              default:
                throw new Error(
                  `Array prefix not supported: ${arrayType.size.prefix.format}`
                );
            }
          }

          if (isNode(arrayType.size, 'remainderSizeNode')) {
            childManifest.imports.add('kaigan::types::RemainderVec');
            return {
              ...childManifest,
              type: `RemainderVec<${childManifest.type}>`,
            };
          }

          // TODO: Add to the Rust validator.
          throw new Error('Array size not supported by Borsh');
        },

        visitDefinedTypeLink(node) {
          const pascalCaseDefinedType = pascalCase(node.name);
          const importFrom = node.importFrom ?? 'generatedTypes';
          return {
            imports: new RustImportMap().add(
              `${importFrom}::${pascalCaseDefinedType}`
            ),
            type: pascalCaseDefinedType,
            nestedStructs: [],
          };
        },

        visitEnumType(enumType, { self }) {
          const originalParentName = parentName;
          if (!originalParentName) {
            // TODO: Add to the Rust validator.
            throw new Error('Enum type must have a parent name.');
          }

          const variants = enumType.variants.map((variant) =>
            visit(variant, self)
          );
          const variantNames = variants
            .map((variant) => variant.type)
            .join('\n');
          const mergedManifest = mergeManifests(variants);

          return {
            ...mergedManifest,
            type: `pub enum ${pascalCase(
              originalParentName
            )} {\n${variantNames}\n}`,
          };
        },

        visitEnumEmptyVariantType(enumEmptyVariantType) {
          const name = pascalCase(enumEmptyVariantType.name);
          return {
            type: `${name},`,
            imports: new RustImportMap(),
            nestedStructs: [],
          };
        },

        visitEnumStructVariantType(enumStructVariantType, { self }) {
          const name = pascalCase(enumStructVariantType.name);
          const originalParentName = parentName;

          if (!originalParentName) {
            throw new Error(
              'Enum struct variant type must have a parent name.'
            );
          }

          inlineStruct = true;
          parentName = pascalCase(originalParentName) + name;
          const typeManifest = visit(enumStructVariantType.struct, self);
          inlineStruct = false;
          parentName = originalParentName;

          return {
            ...typeManifest,
            type: `${name} ${typeManifest.type},`,
          };
        },

        visitEnumTupleVariantType(enumTupleVariantType, { self }) {
          const name = pascalCase(enumTupleVariantType.name);
          const originalParentName = parentName;

          if (!originalParentName) {
            throw new Error(
              'Enum struct variant type must have a parent name.'
            );
          }

          parentName = pascalCase(originalParentName) + name;
          const childManifest = visit(enumTupleVariantType.tuple, self);
          parentName = originalParentName;

          let derive = '';
          if (childManifest.type === '(Pubkey)') {
            derive =
              '#[cfg_attr(feature = "serde", serde(with = "serde_with::As::<serde_with::DisplayFromStr>"))]\n';
          } else if (childManifest.type === '(Vec<Pubkey>)') {
            derive =
              '#[cfg_attr(feature = "serde", serde(with = "serde_with::As::<Vec<serde_with::DisplayFromStr>>"))]\n';
          }

          return {
            ...childManifest,
            type: `${derive}${name}${childManifest.type},`,
          };
        },

        visitMapType(mapType, { self }) {
          const key = visit(mapType.key, self);
          const value = visit(mapType.value, self);
          const mergedManifest = mergeManifests([key, value]);
          mergedManifest.imports.add('std::collections::HashMap');
          return {
            ...mergedManifest,
            type: `HashMap<${key.type}, ${value.type}>`,
          };
        },

        visitOptionType(optionType, { self }) {
          const childManifest = visit(optionType.item, self);

          if (
            optionType.prefix.format === 'u8' &&
            optionType.prefix.endian === 'le'
          ) {
            return {
              ...childManifest,
              type: `Option<${childManifest.type}>`,
            };
          }

          // TODO: Add to the Rust validator.
          throw new Error('Option size not supported by Borsh');
        },

        visitFixedSizeOptionType(fixedSizeOptionType, { self }) {
          const childManifest = visit(fixedSizeOptionType.item, self);
          const byteSize = visit(fixedSizeOptionType.item, byteSizeVisitor);
          if (byteSize === null) {
            throw new Error(
              'Fixed-size option inner type must have a fixed byte size.'
            );
          }
          if (fixedSizeOptionType.sentinel.length !== byteSize) {
            throw new Error(
              'Fixed-size option sentinel length must match the inner type byte size.'
            );
          }

          return {
            ...childManifest,
            type: `Option<${childManifest.type}>`,
            fixedSizeOption: {
              innerType: childManifest.type,
              byteSize,
              sentinel: fixedSizeOptionType.sentinel,
            },
          };
        },

        visitSetType(setType, { self }) {
          const childManifest = visit(setType.item, self);
          childManifest.imports.add('std::collections::HashSet');
          return {
            ...childManifest,
            type: `HashSet<${childManifest.type}>`,
          };
        },

        visitStructType(structType, { self }) {
          const originalParentName = parentName;

          if (!originalParentName) {
            // TODO: Add to the Rust validator.
            throw new Error('Struct type must have a parent name.');
          }

          const fields = structType.fields.map((field) => visit(field, self));
          const fieldTypes = fields.map((field) => field.type).join('\n');
          const mergedManifest = mergeManifests(fields);

          const structName = pascalCase(originalParentName);
          const structFields = structType.fields.map((field) => ({
            originalName: field.name,
            snakeName: snakeCase(field.name),
          }));
          const structDefinition = renderStructDefinition({
            structName,
            fieldTypes,
            structFields,
            fixedSizeOptionFields: mergedManifest.fixedSizeOptionFields ?? {},
          });

          if (nestedStruct) {
            return {
              ...mergedManifest,
              type: structName,
              nestedStructs: [
                ...mergedManifest.nestedStructs,
                structDefinition,
              ],
            };
          }

          if (inlineStruct) {
            return { ...mergedManifest, type: `{\n${fieldTypes}\n}` };
          }

          return {
            ...mergedManifest,
            type: structDefinition,
          };
        },

        visitStructFieldType(structFieldType, { self }) {
          const originalParentName = parentName;
          const originalInlineStruct = inlineStruct;
          const originalNestedStruct = nestedStruct;

          if (!originalParentName) {
            throw new Error('Struct field type must have a parent name.');
          }

          parentName =
            pascalCase(originalParentName) + pascalCase(structFieldType.name);
          nestedStruct = true;
          inlineStruct = false;

          const fieldManifest = visit(structFieldType.type, self);

          parentName = originalParentName;
          inlineStruct = originalInlineStruct;
          nestedStruct = originalNestedStruct;

          const fieldName = snakeCase(structFieldType.name);
          const docblock = rustDocblock(structFieldType.docs);

          let derive = '';
          if (fieldManifest.type === 'Pubkey') {
            derive =
              '#[cfg_attr(feature = "serde", serde(with = "serde_with::As::<serde_with::DisplayFromStr>"))]\n';
          } else if (fieldManifest.type === 'Vec<Pubkey>') {
            derive =
              '#[cfg_attr(feature = "serde", serde(with = "serde_with::As::<Vec<serde_with::DisplayFromStr>>"))]\n';
          } else if (
            (structFieldType.type.kind === 'arrayTypeNode' ||
              structFieldType.type.kind === 'bytesTypeNode' ||
              structFieldType.type.kind === 'stringTypeNode') &&
            isNode(structFieldType.type.size, 'fixedSizeNode') &&
            structFieldType.type.size.size > 32
          ) {
            derive =
              '#[cfg_attr(feature = "serde", serde(with = "serde_with::As::<serde_with::Bytes>"))]\n';
          }

          const fixedSizeOptionFields = {
            ...(fieldManifest.fixedSizeOptionFields ?? {}),
            ...(fieldManifest.fixedSizeOption
              ? {
                  [fieldName]: {
                    innerType: fieldManifest.fixedSizeOption.innerType,
                    byteSize: fieldManifest.fixedSizeOption.byteSize,
                    sentinel: fieldManifest.fixedSizeOption.sentinel,
                  },
                }
              : {}),
          };
          const hasFixedSizeOption =
            Object.keys(fixedSizeOptionFields).length > 0;

          return {
            ...fieldManifest,
            fixedSizeOption: undefined,
            fixedSizeOptionFields: hasFixedSizeOption
              ? fixedSizeOptionFields
              : undefined,
            hasFixedSizeOption:
              fieldManifest.hasFixedSizeOption || hasFixedSizeOption,
            type: inlineStruct
              ? `${docblock}${derive}${fieldName}: ${fieldManifest.type},`
              : `${docblock}${derive}pub ${fieldName}: ${fieldManifest.type},`,
          };
        },

        visitTupleType(tupleType, { self }) {
          const items = tupleType.items.map((item) => visit(item, self));
          const mergedManifest = mergeManifests(items);

          return {
            ...mergedManifest,
            type: `(${items.map((item) => item.type).join(', ')})`,
          };
        },

        visitBooleanType(booleanType) {
          if (
            booleanType.size.format === 'u8' &&
            booleanType.size.endian === 'le'
          ) {
            return {
              type: 'bool',
              imports: new RustImportMap(),
              nestedStructs: [],
            };
          }

          // TODO: Add to the Rust validator.
          throw new Error('Bool size not supported by Borsh');
        },

        visitBytesType(bytesType, { self }) {
          const arrayType = arrayTypeNode(numberTypeNode('u8'), bytesType.size);
          return visit(arrayType, self);
        },

        visitNumberType(numberType) {
          if (numberType.endian === 'le') {
            return {
              type: numberType.format,
              imports: new RustImportMap(),
              nestedStructs: [],
            };
          }

          // TODO: Add to the Rust validator.
          throw new Error('Number endianness not supported by Borsh');
        },

        visitPublicKeyType() {
          return {
            type: 'Pubkey',
            imports: new RustImportMap().add('solana_program::pubkey::Pubkey'),
            nestedStructs: [],
          };
        },

        visitStringType(stringType) {
          if (
            isNode(stringType.size, 'prefixedSizeNode') &&
            stringType.size.prefix.endian === 'le'
          ) {
            switch (stringType.size.prefix.format) {
              case 'u32':
                return {
                  type: 'String',
                  imports: new RustImportMap(),
                  nestedStructs: [],
                };
              case 'u8':
              case 'u16':
              case 'u64': {
                const prefix = stringType.size.prefix.format.toUpperCase();
                return {
                  type: `${prefix}PrefixString`,
                  imports: new RustImportMap().add(
                    `kaigan::types::${prefix}PrefixString`
                  ),
                  nestedStructs: [],
                };
              }
              default:
                throw new Error(
                  `'String size not supported: ${stringType.size.prefix.format}`
                );
            }
          }

          if (isNode(stringType.size, 'fixedSizeNode')) {
            return {
              type: `[u8; ${stringType.size.size}]`,
              imports: new RustImportMap(),
              nestedStructs: [],
            };
          }

          if (isNode(stringType.size, 'remainderSizeNode')) {
            return {
              type: `RemainderStr`,
              imports: new RustImportMap().add(`kaigan::types::RemainderStr`),
              nestedStructs: [],
            };
          }

          // TODO: Add to the Rust validator.
          throw new Error('String size not supported by Borsh');
        },
      })
  );

  return {
    ...visitor,
    setParentName: (name: string | null) => {
      parentName = name;
    },
    setNestedStruct: (value: boolean) => {
      nestedStruct = value;
    },
  };
}

function mergeManifests(
  manifests: RustTypeManifest[]
): Pick<
  RustTypeManifest,
  'imports' | 'nestedStructs' | 'fixedSizeOptionFields' | 'hasFixedSizeOption'
> {
  const fixedSizeOptionFields = manifests.reduce<FixedSizeOptionFieldMap>(
    (acc, manifest) => {
      if (manifest.fixedSizeOptionFields) {
        Object.assign(acc, manifest.fixedSizeOptionFields);
      }
      return acc;
    },
    {}
  );
  const hasFixedSizeOption = Object.keys(fixedSizeOptionFields).length > 0;

  return {
    imports: new RustImportMap().mergeWith(
      ...manifests.map((td) => td.imports)
    ),
    nestedStructs: manifests.flatMap((m) => m.nestedStructs),
    fixedSizeOptionFields: hasFixedSizeOption
      ? fixedSizeOptionFields
      : undefined,
    hasFixedSizeOption,
  };
}

function renderStructDefinition(input: {
  structName: string;
  fieldTypes: string;
  structFields: { originalName: string; snakeName: string }[];
  fixedSizeOptionFields: FixedSizeOptionFieldMap;
}): string {
  const { structName, fieldTypes, structFields, fixedSizeOptionFields } = input;
  const baseDefinition = `pub struct ${structName} {\n${fieldTypes}\n}`;
  const hasFixed = Object.keys(fixedSizeOptionFields).length > 0;
  if (!hasFixed) {
    return baseDefinition;
  }

  const helpers = renderFixedSizeOptionImplementations({
    structName,
    structFields,
    fixedSizeOptionFields,
  });
  return `${baseDefinition}\n\n${helpers}`;
}

function renderFixedSizeOptionImplementations(input: {
  structName: string;
  structFields: { originalName: string; snakeName: string }[];
  fixedSizeOptionFields: FixedSizeOptionFieldMap;
}): string {
  const { structName, structFields, fixedSizeOptionFields } = input;
  const sentinelLines = Object.entries(fixedSizeOptionFields)
    .map(([snakeName, info]) => {
      const constName = getFixedSizeOptionConstName(structName, snakeName);
      const sentinelArray = info.sentinel.join(', ');
      return `const ${constName}: [u8; ${info.byteSize}] = [${sentinelArray}];`;
    })
    .join('\n');

  const serializeLines = structFields
    .map(({ snakeName }) => {
      const fixedInfo = fixedSizeOptionFields[snakeName];
      if (!fixedInfo) {
        return `    BorshSerialize::serialize(&self.${snakeName}, writer)?;`;
      }
      const constName = getFixedSizeOptionConstName(structName, snakeName);
      return `    match &self.${snakeName} {
      Some(value) => BorshSerialize::serialize(value, writer)?,
      None => borsh::maybestd::io::Write::write_all(writer, &${constName})?,
    };`;
    })
    .join('\n');

  const deserializeLines = structFields
    .map(({ snakeName }) => {
      const fixedInfo = fixedSizeOptionFields[snakeName];
      if (!fixedInfo) {
        return `    let ${snakeName} = BorshDeserialize::deserialize_reader(reader)?;`;
      }
      const constName = getFixedSizeOptionConstName(structName, snakeName);
      return `    let ${snakeName} = {
      let mut buffer = [0u8; ${fixedInfo.byteSize}];
      borsh::maybestd::io::Read::read_exact(reader, &mut buffer)?;
      if buffer == ${constName} {
        None
      } else {
        let mut slice: &[u8] = &buffer;
        Some(BorshDeserialize::deserialize(&mut slice)?)
      }
    };`;
    })
    .join('\n');

  const constructorLines = structFields
    .map(({ snakeName }) => `      ${snakeName},`)
    .join('\n');

  return `${sentinelLines}

impl BorshSerialize for ${structName} {
  fn serialize<W: borsh::maybestd::io::Write>(
    &self,
    writer: &mut W
  ) -> borsh::maybestd::io::Result<()> {
${serializeLines}
    Ok(())
  }
}

impl BorshDeserialize for ${structName} {
  fn deserialize_reader<R: borsh::maybestd::io::Read>(
    reader: &mut R
  ) -> borsh::maybestd::io::Result<Self> {
${deserializeLines}
    Ok(Self {
${constructorLines}
    })
  }
}

#[cfg(feature = "anchor")]
impl anchor_lang::prelude::AnchorSerialize for ${structName} {
  fn serialize<W: std::io::Write>(&self, writer: &mut W) -> std::io::Result<()> {
    BorshSerialize::serialize(self, writer)
  }
}

#[cfg(feature = "anchor")]
impl anchor_lang::prelude::AnchorDeserialize for ${structName} {
  fn deserialize_reader<R: std::io::Read>(
    reader: &mut R
  ) -> std::io::Result<Self> {
    BorshDeserialize::deserialize_reader(reader)
  }
}`;
}

function getFixedSizeOptionConstName(structName: string, fieldName: string) {
  return `${snakeCase(structName).toUpperCase()}_${fieldName
    .toUpperCase()
    .replace(/[^A-Z0-9_]/g, '_')}_FIXED_SIZE_OPTION_SENTINEL`;
}
