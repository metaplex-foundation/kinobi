import {
  ArrayTypeNode,
  REGISTERED_TYPE_NODE_KEYS,
  isInteger,
  isNode,
  isScalarEnum,
  isUnsignedInteger,
  structFieldTypeNode,
  structTypeNode,
} from '../../nodes';
import { camelCase, pascalCase, pipe } from '../../shared';
import { Visitor, extendVisitor, staticVisitor, visit } from '../../visitors';
import { JavaScriptImportMap } from './JavaScriptImportMap';
import { renderValueNodeVisitor } from './renderValueNodeVisitor';

export type JavaScriptTypeManifest = {
  isEnum: boolean;
  strictType: string;
  strictImports: JavaScriptImportMap;
  looseType: string;
  looseImports: JavaScriptImportMap;
  serializer: string;
  serializerImports: JavaScriptImportMap;
};

export function getTypeManifestVisitor(
  valueNodeVisitor: ReturnType<typeof renderValueNodeVisitor>
) {
  let parentName: { strict: string; loose: string } | null = null;

  return pipe(
    staticVisitor(
      () =>
        ({
          isEnum: false,
          strictType: '',
          strictImports: new JavaScriptImportMap(),
          looseType: '',
          looseImports: new JavaScriptImportMap(),
          serializer: '',
          serializerImports: new JavaScriptImportMap(),
        } as JavaScriptTypeManifest),
      [
        ...REGISTERED_TYPE_NODE_KEYS,
        'definedTypeLinkNode',
        'definedTypeNode',
        'accountNode',
        'accountDataNode',
        'instructionDataArgsNode',
        'instructionExtraArgsNode',
      ]
    ),
    (v) =>
      extendVisitor(v, {
        visitAccount(account, { self }) {
          return visit(account.data, self);
        },

        visitAccountData(accountData, { self }) {
          parentName = {
            strict: pascalCase(accountData.name),
            loose: `${pascalCase(accountData.name)}Args`,
          };
          const manifest = accountData.link
            ? visit(accountData.link, self)
            : visit(accountData.struct, self);
          parentName = null;
          return manifest;
        },

        visitInstructionDataArgs(instructionDataArgs, { self }) {
          parentName = {
            strict: pascalCase(instructionDataArgs.name),
            loose: `${pascalCase(instructionDataArgs.name)}Args`,
          };
          const manifest = instructionDataArgs.link
            ? visit(instructionDataArgs.link, self)
            : visit(instructionDataArgs.struct, self);
          parentName = null;
          return manifest;
        },

        visitInstructionExtraArgs(instructionExtraArgs, { self }) {
          parentName = {
            strict: pascalCase(instructionExtraArgs.name),
            loose: `${pascalCase(instructionExtraArgs.name)}Args`,
          };
          const manifest = instructionExtraArgs.link
            ? visit(instructionExtraArgs.link, self)
            : visit(instructionExtraArgs.struct, self);
          parentName = null;
          return manifest;
        },

        visitDefinedType(definedType, { self }) {
          parentName = {
            strict: pascalCase(definedType.name),
            loose: `${pascalCase(definedType.name)}Args`,
          };
          const manifest = visit(definedType.type, self);
          parentName = null;
          return manifest;
        },

        visitArrayType(arrayType, { self }) {
          const childManifest = visit(arrayType.item, self);
          childManifest.serializerImports.add('umiSerializers', 'array');
          const sizeOption = getArrayLikeSizeOption(
            arrayType.size,
            childManifest,
            self
          );
          const options = sizeOption ? `, { ${sizeOption} }` : '';
          return {
            ...childManifest,
            strictType: `Array<${childManifest.strictType}>`,
            looseType: `Array<${childManifest.looseType}>`,
            serializer: `array(${childManifest.serializer + options})`,
          };
        },

        visitDefinedTypeLink(node) {
          const pascalCaseDefinedType = pascalCase(node.name);
          const serializerName = `get${pascalCaseDefinedType}Serializer`;
          const importFrom = node.importFrom ?? 'generatedTypes';

          return {
            isEnum: false,
            strictType: pascalCaseDefinedType,
            strictImports: new JavaScriptImportMap().add(
              importFrom,
              pascalCaseDefinedType
            ),
            looseType: `${pascalCaseDefinedType}Args`,
            looseImports: new JavaScriptImportMap().add(
              importFrom,
              `${pascalCaseDefinedType}Args`
            ),
            serializer: `${serializerName}()`,
            serializerImports: new JavaScriptImportMap().add(
              importFrom,
              serializerName
            ),
          };
        },

        visitEnumType(enumType, { self }) {
          const strictImports = new JavaScriptImportMap();
          const looseImports = new JavaScriptImportMap();
          const serializerImports = new JavaScriptImportMap().add(
            'umiSerializers',
            'scalarEnum'
          );

          const variantNames = enumType.variants.map((variant) =>
            pascalCase(variant.name)
          );
          const currentParentName = { ...parentName };
          parentName = null;
          const options: string[] = [];

          if (enumType.size.format !== 'u8' || enumType.size.endian !== 'le') {
            const sizeManifest = visit(enumType.size, self);
            strictImports.mergeWith(sizeManifest.strictImports);
            looseImports.mergeWith(sizeManifest.looseImports);
            serializerImports.mergeWith(sizeManifest.serializerImports);
            options.push(`size: ${sizeManifest.serializer}`);
          }

          if (isScalarEnum(enumType)) {
            if (currentParentName === null) {
              throw new Error(
                'Scalar enums cannot be inlined and must be introduced ' +
                  'via a defined type. Ensure you are not inlining a ' +
                  'defined type that is a scalar enum through a visitor.'
              );
            }
            options.push(`description: '${currentParentName.strict}'`);
            const optionsAsString =
              options.length > 0 ? `, { ${options.join(', ')} }` : '';
            return {
              isEnum: true,
              strictType: `{ ${variantNames.join(', ')} }`,
              strictImports,
              looseType: `{ ${variantNames.join(', ')} }`,
              looseImports,
              serializer:
                `scalarEnum<${currentParentName.strict}>` +
                `(${currentParentName.strict + optionsAsString})`,
              serializerImports,
            };
          }

          const variants = enumType.variants.map((variant) => {
            const variantName = pascalCase(variant.name);
            parentName = currentParentName
              ? {
                  strict: `GetDataEnumKindContent<${currentParentName.strict}, '${variantName}'>`,
                  loose: `GetDataEnumKindContent<${currentParentName.loose}, '${variantName}'>`,
                }
              : null;
            const variantManifest = visit(variant, self);
            parentName = null;
            return variantManifest;
          });

          const mergedManifest = mergeManifests(variants);
          const variantSerializers = variants
            .map((variant) => variant.serializer)
            .join(', ');
          const serializerTypeParams = currentParentName
            ? currentParentName.strict
            : 'any';
          if (currentParentName?.strict) {
            options.push(
              `description: '${pascalCase(currentParentName.strict)}'`
            );
          }
          const optionsAsString =
            options.length > 0 ? `, { ${options.join(', ')} }` : '';

          return {
            ...mergedManifest,
            strictType: variants
              .map((variant) => variant.strictType)
              .join(' | '),
            looseType: variants.map((variant) => variant.looseType).join(' | '),
            serializer:
              `dataEnum<${serializerTypeParams}>` +
              `([${variantSerializers}]${optionsAsString})`,
            serializerImports: mergedManifest.serializerImports.add(
              'umiSerializers',
              ['GetDataEnumKindContent', 'GetDataEnumKind', 'dataEnum']
            ),
          };
        },

        visitEnumEmptyVariantType(enumEmptyVariantType) {
          const name = pascalCase(enumEmptyVariantType.name);
          const kindAttribute = `__kind: "${name}"`;
          return {
            isEnum: false,
            strictType: `{ ${kindAttribute} }`,
            strictImports: new JavaScriptImportMap(),
            looseType: `{ ${kindAttribute} }`,
            looseImports: new JavaScriptImportMap(),
            serializer: `['${name}', unit()]`,
            serializerImports: new JavaScriptImportMap().add(
              'umiSerializers',
              'unit'
            ),
          };
        },

        visitEnumStructVariantType(enumStructVariantType, { self }) {
          const name = pascalCase(enumStructVariantType.name);
          const kindAttribute = `__kind: "${name}"`;
          const type = visit(enumStructVariantType.struct, self);
          return {
            ...type,
            strictType: `{ ${kindAttribute},${type.strictType.slice(1, -1)}}`,
            looseType: `{ ${kindAttribute},${type.looseType.slice(1, -1)}}`,
            serializer: `['${name}', ${type.serializer}]`,
          };
        },

        visitEnumTupleVariantType(enumTupleVariantType, { self }) {
          const name = pascalCase(enumTupleVariantType.name);
          const kindAttribute = `__kind: "${name}"`;
          const struct = structTypeNode([
            structFieldTypeNode({
              name: 'fields',
              type: enumTupleVariantType.tuple,
            }),
          ]);
          const type = visit(struct, self);
          return {
            ...type,
            strictType: `{ ${kindAttribute},${type.strictType.slice(1, -1)}}`,
            looseType: `{ ${kindAttribute},${type.looseType.slice(1, -1)}}`,
            serializer: `['${name}', ${type.serializer}]`,
          };
        },

        visitMapType(mapType, { self }) {
          const key = visit(mapType.key, self);
          const value = visit(mapType.value, self);
          const mergedManifest = mergeManifests([key, value]);
          mergedManifest.serializerImports.add('umiSerializers', 'map');
          const sizeOption = getArrayLikeSizeOption(
            mapType.size,
            mergedManifest,
            self
          );
          const options = sizeOption ? `, { ${sizeOption} }` : '';
          return {
            ...mergedManifest,
            strictType: `Map<${key.strictType}, ${value.strictType}>`,
            looseType: `Map<${key.looseType}, ${value.looseType}>`,
            serializer: `map(${key.serializer}, ${value.serializer}${options})`,
          };
        },

        visitOptionType(optionType, { self }) {
          const childManifest = visit(optionType.item, self);
          childManifest.strictImports.add('umi', 'Option');
          childManifest.looseImports.add('umi', 'OptionOrNullable');
          childManifest.serializerImports.add('umiSerializers', 'option');
          const options: string[] = [];

          // Prefix option.
          if (
            optionType.prefix.format !== 'u8' ||
            optionType.prefix.endian !== 'le'
          ) {
            const prefixManifest = visit(optionType.prefix, self);
            childManifest.strictImports.mergeWith(prefixManifest.strictImports);
            childManifest.looseImports.mergeWith(prefixManifest.looseImports);
            childManifest.serializerImports.mergeWith(
              prefixManifest.serializerImports
            );
            options.push(`prefix: ${prefixManifest.serializer}`);
          }

          // Fixed option.
          if (optionType.fixed) {
            options.push(`fixed: true`);
          }

          const optionsAsString =
            options.length > 0 ? `, { ${options.join(', ')} }` : '';

          return {
            ...childManifest,
            strictType: `Option<${childManifest.strictType}>`,
            looseType: `OptionOrNullable<${childManifest.looseType}>`,
            serializer: `option(${childManifest.serializer}${optionsAsString})`,
          };
        },

        visitSetType(setType, { self }) {
          const childManifest = visit(setType.item, self);
          childManifest.serializerImports.add('umiSerializers', 'set');
          const sizeOption = getArrayLikeSizeOption(
            setType.size,
            childManifest,
            self
          );
          const options = sizeOption ? `, { ${sizeOption} }` : '';
          return {
            ...childManifest,
            strictType: `Set<${childManifest.strictType}>`,
            looseType: `Set<${childManifest.looseType}>`,
            serializer: `set(${childManifest.serializer + options})`,
          };
        },

        visitStructType(structType, { self }) {
          const currentParentName = parentName;
          parentName = null;

          const fields = structType.fields.map((field) => visit(field, self));
          const mergedManifest = mergeManifests(fields);
          mergedManifest.serializerImports.add('umiSerializers', 'struct');
          const fieldSerializers = fields
            .map((field) => field.serializer)
            .join(', ');
          const structDescription =
            currentParentName?.strict &&
            !currentParentName.strict.match(/['"<>]/)
              ? `, { description: '${pascalCase(currentParentName.strict)}' }`
              : '';
          const serializerTypeParams = currentParentName
            ? currentParentName.strict
            : 'any';
          const baseManifest = {
            ...mergedManifest,
            strictType: `{ ${fields
              .map((field) => field.strictType)
              .join('')} }`,
            looseType: `{ ${fields.map((field) => field.looseType).join('')} }`,
            serializer:
              `struct<${serializerTypeParams}>` +
              `([${fieldSerializers}]${structDescription})`,
          };

          const optionalFields = structType.fields.filter(
            (f) => !!f.defaultValue
          );
          if (optionalFields.length === 0) {
            return baseManifest;
          }

          const defaultValues = optionalFields
            .map((f) => {
              const key = camelCase(f.name);
              const defaultValue = f.defaultValue as NonNullable<
                typeof f.defaultValue
              >;
              const { render: renderedValue, imports } = visit(
                defaultValue,
                valueNodeVisitor
              );
              baseManifest.serializerImports.mergeWith(imports);
              if (f.defaultValueStrategy === 'omitted') {
                return `${key}: ${renderedValue}`;
              }
              return `${key}: value.${key} ?? ${renderedValue}`;
            })
            .join(', ');
          const mapSerializerTypeParams = currentParentName
            ? `${currentParentName.loose}, any, ${currentParentName.strict}`
            : 'any, any, any';
          const mappedSerializer =
            `mapSerializer<${mapSerializerTypeParams}>(` +
            `${baseManifest.serializer}, ` +
            `(value) => ({ ...value, ${defaultValues} }) ` +
            `)`;
          baseManifest.serializerImports.add('umiSerializers', 'mapSerializer');
          return { ...baseManifest, serializer: mappedSerializer };
        },

        visitStructFieldType(structFieldType, { self }) {
          const name = camelCase(structFieldType.name);
          const fieldChild = visit(structFieldType.type, self);
          const docblock = createDocblock(structFieldType.docs);
          const baseField = {
            ...fieldChild,
            strictType: `${docblock}${name}: ${fieldChild.strictType}; `,
            looseType: `${docblock}${name}: ${fieldChild.looseType}; `,
            serializer: `['${name}', ${fieldChild.serializer}]`,
          };
          if (!structFieldType.defaultValue) {
            return baseField;
          }
          if (structFieldType.defaultValueStrategy !== 'omitted') {
            return {
              ...baseField,
              looseType: `${docblock}${name}?: ${fieldChild.looseType}; `,
            };
          }
          return {
            ...baseField,
            looseType: '',
            looseImports: new JavaScriptImportMap(),
          };
        },

        visitTupleType(tupleType, { self }) {
          const items = tupleType.items.map((item) => visit(item, self));
          const mergedManifest = mergeManifests(items);
          mergedManifest.serializerImports.add('umiSerializers', 'tuple');
          const itemSerializers = items
            .map((child) => child.serializer)
            .join(', ');
          return {
            ...mergedManifest,
            strictType: `[${items.map((item) => item.strictType).join(', ')}]`,
            looseType: `[${items.map((item) => item.looseType).join(', ')}]`,
            serializer: `tuple([${itemSerializers}])`,
          };
        },

        visitBooleanType(booleanType, { self }) {
          const looseImports = new JavaScriptImportMap();
          const strictImports = new JavaScriptImportMap();
          const serializerImports = new JavaScriptImportMap().add(
            'umiSerializers',
            'bool'
          );
          let sizeSerializer = '';
          if (
            booleanType.size.format !== 'u8' ||
            booleanType.size.endian !== 'le'
          ) {
            const size = visit(booleanType.size, self);
            looseImports.mergeWith(size.looseImports);
            strictImports.mergeWith(size.strictImports);
            serializerImports.mergeWith(size.serializerImports);
            sizeSerializer = `{ size: ${size.serializer} }`;
          }

          return {
            isEnum: false,
            strictType: 'boolean',
            looseType: 'boolean',
            serializer: `bool(${sizeSerializer})`,
            looseImports,
            strictImports,
            serializerImports,
          };
        },

        visitBytesType(bytesType, { self }) {
          const strictImports = new JavaScriptImportMap();
          const looseImports = new JavaScriptImportMap();
          const serializerImports = new JavaScriptImportMap().add(
            'umiSerializers',
            'bytes'
          );
          const options: string[] = [];

          // Size option.
          if (isNode(bytesType.size, 'prefixedSizeNode')) {
            const prefix = visit(bytesType.size.prefix, self);
            strictImports.mergeWith(prefix.strictImports);
            looseImports.mergeWith(prefix.looseImports);
            serializerImports.mergeWith(prefix.serializerImports);
            options.push(`size: ${prefix.serializer}`);
          } else if (isNode(bytesType.size, 'fixedSizeNode')) {
            options.push(`size: ${bytesType.size.size}`);
          }

          const optionsAsString =
            options.length > 0 ? `{ ${options.join(', ')} }` : '';

          return {
            isEnum: false,
            strictType: 'Uint8Array',
            strictImports,
            looseType: 'Uint8Array',
            looseImports,
            serializer: `bytes(${optionsAsString})`,
            serializerImports,
          };
        },

        visitNumberType(numberType) {
          const isBigNumber = ['u64', 'u128', 'i64', 'i128'].includes(
            numberType.format
          );
          const serializerImports = new JavaScriptImportMap().add(
            'umiSerializers',
            numberType.format
          );
          let endianness = '';
          if (numberType.endian === 'be') {
            serializerImports.add('umiSerializers', 'Endian');
            endianness = '{ endian: Endian.Big }';
          }
          return {
            isEnum: false,
            strictType: isBigNumber ? 'bigint' : 'number',
            strictImports: new JavaScriptImportMap(),
            looseType: isBigNumber ? 'number | bigint' : 'number',
            looseImports: new JavaScriptImportMap(),
            serializer: `${numberType.format}(${endianness})`,
            serializerImports,
          };
        },

        visitAmountType(amountType, { self }) {
          const numberManifest = visit(amountType.number, self);
          if (!isUnsignedInteger(amountType.number)) {
            throw new Error(
              `Amount wrappers can only be applied to unsigned ` +
                `integer types. Got type [${amountType.number.toString()}].`
            );
          }
          const { unit, decimals } = amountType;
          const idAndDecimals = `'${unit ?? 'Unknown'}', ${decimals}`;
          const isSolAmount = unit === 'SOL' && decimals === 9;
          const amountTypeString = isSolAmount
            ? 'SolAmount'
            : `Amount<${idAndDecimals}>`;
          const amountImport = isSolAmount ? 'SolAmount' : 'Amount';
          numberManifest.strictImports.add('umi', amountImport);
          numberManifest.looseImports.add('umi', amountImport);
          numberManifest.serializerImports.add('umi', 'mapAmountSerializer');
          return {
            ...numberManifest,
            strictType: amountTypeString,
            looseType: amountTypeString,
            serializer: `mapAmountSerializer(${numberManifest.serializer}, ${idAndDecimals})`,
          };
        },

        visitDateTimeType(dateTimeType, { self }) {
          const numberManifest = visit(dateTimeType.number, self);
          if (!isInteger(dateTimeType.number)) {
            throw new Error(
              `DateTime wrappers can only be applied to integer ` +
                `types. Got type [${dateTimeType.number.toString()}].`
            );
          }
          numberManifest.strictImports.add('umi', 'DateTime');
          numberManifest.looseImports.add('umi', 'DateTimeInput');
          numberManifest.serializerImports.add('umi', 'mapDateTimeSerializer');
          return {
            ...numberManifest,
            strictType: `DateTime`,
            looseType: `DateTimeInput`,
            serializer: `mapDateTimeSerializer(${numberManifest.serializer})`,
          };
        },

        visitSolAmountType(solAmountType, { self }) {
          const numberManifest = visit(solAmountType.number, self);
          if (!isUnsignedInteger(solAmountType.number)) {
            throw new Error(
              `Amount wrappers can only be applied to unsigned ` +
                `integer types. Got type [${solAmountType.number.toString()}].`
            );
          }
          const idAndDecimals = `'SOL', 9`;
          numberManifest.strictImports.add('umi', 'SolAmount');
          numberManifest.looseImports.add('umi', 'SolAmount');
          numberManifest.serializerImports.add('umi', 'mapAmountSerializer');
          return {
            ...numberManifest,
            strictType: 'SolAmount',
            looseType: 'SolAmount',
            serializer: `mapAmountSerializer(${numberManifest.serializer}, ${idAndDecimals})`,
          };
        },

        visitPublicKeyType() {
          const imports = new JavaScriptImportMap().add('umi', 'PublicKey');
          return {
            isEnum: false,
            strictType: 'PublicKey',
            strictImports: imports,
            looseType: 'PublicKey',
            looseImports: imports,
            serializer: `publicKeySerializer()`,
            serializerImports: new JavaScriptImportMap()
              .add('umiSerializers', 'publicKey')
              .addAlias('umiSerializers', 'publicKey', 'publicKeySerializer'),
          };
        },

        visitStringType(stringType, { self }) {
          const looseImports = new JavaScriptImportMap();
          const strictImports = new JavaScriptImportMap();
          const serializerImports = new JavaScriptImportMap().add(
            'umiSerializers',
            'string'
          );
          const options: string[] = [];

          // Encoding option.
          if (stringType.encoding !== 'utf8') {
            looseImports.add('umiSerializers', stringType.encoding);
            strictImports.add('umiSerializers', stringType.encoding);
            options.push(`encoding: ${stringType.encoding}`);
          }

          // Size option.
          if (isNode(stringType.size, 'remainderSizeNode')) {
            options.push(`size: 'variable'`);
          } else if (isNode(stringType.size, 'fixedSizeNode')) {
            options.push(`size: ${stringType.size.size}`);
          } else if (
            stringType.size.prefix.format !== 'u32' ||
            stringType.size.prefix.endian !== 'le'
          ) {
            const prefix = visit(stringType.size.prefix, self);
            looseImports.mergeWith(prefix.looseImports);
            strictImports.mergeWith(prefix.strictImports);
            serializerImports.mergeWith(prefix.serializerImports);
            options.push(`size: ${prefix.serializer}`);
          }

          const optionsAsString =
            options.length > 0 ? `{ ${options.join(', ')} }` : '';

          return {
            isEnum: false,
            strictType: 'string',
            strictImports,
            looseType: 'string',
            looseImports,
            serializer: `string(${optionsAsString})`,
            serializerImports,
          };
        },
      })
  );
}

function mergeManifests(
  manifests: JavaScriptTypeManifest[]
): Pick<
  JavaScriptTypeManifest,
  'strictImports' | 'looseImports' | 'serializerImports' | 'isEnum'
> {
  return {
    strictImports: new JavaScriptImportMap().mergeWith(
      ...manifests.map((td) => td.strictImports)
    ),
    looseImports: new JavaScriptImportMap().mergeWith(
      ...manifests.map((td) => td.looseImports)
    ),
    serializerImports: new JavaScriptImportMap().mergeWith(
      ...manifests.map((td) => td.serializerImports)
    ),
    isEnum: false,
  };
}

function createDocblock(docs: string[]): string {
  if (docs.length <= 0) return '';
  if (docs.length === 1) return `\n/** ${docs[0]} */\n`;
  const lines = docs.map((doc) => ` * ${doc}`);
  return `\n/**\n${lines.join('\n')}\n */\n`;
}

function getArrayLikeSizeOption(
  size: ArrayTypeNode['size'],
  manifest: Pick<
    JavaScriptTypeManifest,
    'strictImports' | 'looseImports' | 'serializerImports'
  >,
  self: Visitor<JavaScriptTypeManifest, 'numberTypeNode'>
): string | null {
  if (isNode(size, 'fixedSizeNode')) return `size: ${size.size}`;
  if (isNode(size, 'remainderSizeNode')) return `size: 'remainder'`;

  const prefixManifest = visit(size.prefix, self);
  if (prefixManifest.serializer === 'u32()') return null;

  manifest.strictImports.mergeWith(prefixManifest.strictImports);
  manifest.looseImports.mergeWith(prefixManifest.looseImports);
  manifest.serializerImports.mergeWith(prefixManifest.serializerImports);
  return `size: ${prefixManifest.serializer}`;
}
