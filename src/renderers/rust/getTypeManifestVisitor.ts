import {
  REGISTERED_TYPE_NODE_KEYS,
  arrayTypeNode,
  isEnumTypeNode,
  isFixedSizeNode,
  isPrefixedSizeNode,
  isRemainderSizeNode,
  isScalarEnum,
  numberTypeNode,
} from '../../nodes';
import { pascalCase, pipe, snakeCase } from '../../shared';
import { extendVisitor, mergeVisitor, visit } from '../../visitors';
import { RustImportMap } from './RustImportMap';

export type RustTypeManifest = {
  type: string;
  imports: RustImportMap;
  nestedStructs: string[];
};

export function getTypeManifestVisitor() {
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
        ...REGISTERED_TYPE_NODE_KEYS,
        'definedTypeNode',
        'accountNode',
        'accountDataNode',
        'instructionNode',
        'instructionDataArgsNode',
        'instructionExtraArgsNode',
      ]
    ),
    (v) =>
      extendVisitor(v, {
        visitAccount(account, { self }) {
          parentName = pascalCase(account.name);
          const manifest = visit(account.data, self);
          manifest.imports.add([
            'borsh::BorshSerialize',
            'borsh::BorshDeserialize',
          ]);
          parentName = null;
          return {
            ...manifest,
            type:
              '#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, Eq, PartialEq)]\n' +
              '#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]\n' +
              `${manifest.type}`,
          };
        },

        visitAccountData(accountData, { self }) {
          return visit(accountData.struct, self);
        },

        visitInstruction(instruction, { self }) {
          return visit(instruction.dataArgs, self);
        },

        visitInstructionDataArgs(instructionDataArgs, { self }) {
          parentName = pascalCase(instructionDataArgs.name);
          const manifest = visit(instructionDataArgs.struct, self);
          parentName = null;
          return manifest;
        },

        visitInstructionExtraArgs(instructionExtraArgs, { self }) {
          parentName = pascalCase(instructionExtraArgs.name);
          const manifest = visit(instructionExtraArgs.struct, self);
          parentName = null;
          return manifest;
        },

        visitDefinedType(definedType, { self }) {
          parentName = pascalCase(definedType.name);
          const manifest = visit(definedType.data, self);
          parentName = null;
          manifest.imports.add([
            'borsh::BorshSerialize',
            'borsh::BorshDeserialize',
          ]);
          const traits = [
            'BorshSerialize',
            'BorshDeserialize',
            'Clone',
            'Debug',
            'Eq',
            'PartialEq',
          ];
          if (
            isEnumTypeNode(definedType.data) &&
            isScalarEnum(definedType.data)
          ) {
            traits.push('PartialOrd', 'Hash');
          }
          return {
            ...manifest,
            type:
              `#[derive(${traits.join(', ')})]\n` +
              '#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]\n' +
              `${manifest.type}`,
            nestedStructs: manifest.nestedStructs.map(
              (struct) =>
                `#[derive(${traits.join(', ')})]\n` +
                '#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]\n' +
                `${struct}`
            ),
          };
        },

        visitArrayType(arrayType, { self }) {
          const childManifest = visit(arrayType.child, self);

          if (isFixedSizeNode(arrayType.size)) {
            return {
              ...childManifest,
              type: `[${childManifest.type}; ${arrayType.size.size}]`,
            };
          }

          if (
            isPrefixedSizeNode(arrayType.size) &&
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

          if (isRemainderSizeNode(arrayType.size)) {
            childManifest.imports.add('kaigan::types::RemainderVec');
            return {
              ...childManifest,
              type: `RemainderVec<${childManifest.type}>`,
            };
          }

          // TODO: Add to the Rust validator.
          throw new Error('Array size not supported by Borsh');
        },

        visitLinkType(linkType) {
          const pascalCaseDefinedType = pascalCase(linkType.name);
          const importFrom =
            linkType.importFrom === 'generated'
              ? 'generatedTypes'
              : linkType.importFrom;
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

          return {
            ...childManifest,
            type: `${name}${childManifest.type},`,
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
          const childManifest = visit(optionType.child, self);

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

        visitSetType(setType, { self }) {
          const childManifest = visit(setType.child, self);
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

          if (nestedStruct) {
            return {
              ...mergedManifest,
              type: pascalCase(originalParentName),
              nestedStructs: [
                ...mergedManifest.nestedStructs,
                `pub struct ${pascalCase(
                  originalParentName
                )} {\n${fieldTypes}\n}`,
              ],
            };
          }

          if (inlineStruct) {
            return { ...mergedManifest, type: `{\n${fieldTypes}\n}` };
          }

          return {
            ...mergedManifest,
            type: `pub struct ${pascalCase(
              originalParentName
            )} {\n${fieldTypes}\n}`,
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

          const fieldManifest = visit(structFieldType.child, self);

          parentName = originalParentName;
          inlineStruct = originalInlineStruct;
          nestedStruct = originalNestedStruct;

          const fieldName = snakeCase(structFieldType.name);
          const docblock = createDocblock(structFieldType.docs);

          let derive = '';
          if (fieldManifest.type === 'Pubkey') {
            derive =
              '#[cfg_attr(feature = "serde", serde(with = "serde_with::As::<serde_with::DisplayFromStr>"))]\n';
          } else if (
            (structFieldType.child.kind === 'arrayTypeNode' ||
              structFieldType.child.kind === 'bytesTypeNode' ||
              structFieldType.child.kind === 'stringTypeNode') &&
            isFixedSizeNode(structFieldType.child.size) &&
            structFieldType.child.size.size > 32
          ) {
            derive =
              '#[cfg_attr(feature = "serde", serde(with = "serde_with::As::<serde_with::Bytes>"))]\n';
          }

          return {
            ...fieldManifest,
            type: inlineStruct
              ? `${docblock}${derive}${fieldName}: ${fieldManifest.type},`
              : `${docblock}${derive}pub ${fieldName}: ${fieldManifest.type},`,
          };
        },

        visitTupleType(tupleType, { self }) {
          const children = tupleType.children.map((item) => visit(item, self));
          const mergedManifest = mergeManifests(children);

          return {
            ...mergedManifest,
            type: `(${children.map((item) => item.type).join(', ')})`,
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
          const arrayType = arrayTypeNode(numberTypeNode('u8'), {
            size: bytesType.size,
          });

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
            isPrefixedSizeNode(stringType.size) &&
            stringType.size.prefix.format === 'u32' &&
            stringType.size.prefix.endian === 'le'
          ) {
            return {
              type: 'String',
              imports: new RustImportMap(),
              nestedStructs: [],
            };
          }

          if (isFixedSizeNode(stringType.size)) {
            return {
              type: `[u8; ${stringType.size.size}]`,
              imports: new RustImportMap(),
              nestedStructs: [],
            };
          }

          if (isRemainderSizeNode(stringType.size)) {
            return {
              type: `&str`,
              imports: new RustImportMap(),
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
): Pick<RustTypeManifest, 'imports' | 'nestedStructs'> {
  return {
    imports: new RustImportMap().mergeWith(
      ...manifests.map((td) => td.imports)
    ),
    nestedStructs: manifests.flatMap((m) => m.nestedStructs),
  };
}

function createDocblock(docs: string[]): string {
  if (docs.length <= 0) return '';
  const lines = docs.map((doc) => `/// ${doc}`);
  return `${lines.join('\n')}\n`;
}
