import {
  REGISTERED_TYPE_NODE_KINDS,
  SizeNode,
  isNode,
  isScalarEnum,
  structFieldTypeNode,
  structTypeNode,
  structTypeNodeFromInstructionArgumentNodes,
} from '../../nodes';
import { camelCase, pipe } from '../../shared';
import { Visitor, extendVisitor, staticVisitor, visit } from '../../visitors';
import { ImportMap } from './ImportMap';
import { TypeManifest, mergeManifests } from './TypeManifest';
import { ParsedCustomDataOptions } from './customDataHelpers';
import { Fragment, fragment } from './fragments';
import { NameApi } from './nameTransformers';
import { ValueNodeVisitor } from './renderValueNodeVisitor';

export type TypeManifestVisitor = ReturnType<typeof getTypeManifestVisitor>;

export function getTypeManifestVisitor(input: {
  nameApi: NameApi;
  valueNodeVisitor: ValueNodeVisitor;
  customAccountData: ParsedCustomDataOptions;
  customInstructionData: ParsedCustomDataOptions;
  parentName?: { strict: string; loose: string };
}) {
  const {
    nameApi,
    valueNodeVisitor,
    customAccountData,
    customInstructionData,
  } = input;
  let parentName = input.parentName ?? null;

  return pipe(
    staticVisitor(
      () =>
        ({
          isEnum: false,
          strictType: fragment(''),
          looseType: fragment(''),
          encoder: fragment(''),
          decoder: fragment(''),
        }) as TypeManifest,
      [
        ...REGISTERED_TYPE_NODE_KINDS,
        'definedTypeLinkNode',
        'definedTypeNode',
        'accountNode',
        'instructionNode',
      ]
    ),
    (visitor) =>
      extendVisitor(visitor, {
        visitAccount(account, { self }) {
          const accountDataName = nameApi.accountDataType(account.name);
          parentName = {
            strict: nameApi.dataType(accountDataName),
            loose: nameApi.dataArgsType(accountDataName),
          };
          const link = customAccountData.get(account.name)?.linkNode;
          const manifest = link ? visit(link, self) : visit(account.data, self);
          parentName = null;
          return manifest;
        },

        visitInstruction(instruction, { self }) {
          const instructionDataName = nameApi.instructionDataType(
            instruction.name
          );
          parentName = {
            strict: nameApi.dataType(instructionDataName),
            loose: nameApi.dataArgsType(instructionDataName),
          };
          const link = customInstructionData.get(instruction.name)?.linkNode;
          const struct = structTypeNodeFromInstructionArgumentNodes(
            instruction.arguments
          );
          const manifest = link ? visit(link, self) : visit(struct, self);
          parentName = null;
          return manifest;
        },

        visitDefinedType(definedType, { self }) {
          parentName = {
            strict: nameApi.dataType(definedType.name),
            loose: nameApi.dataArgsType(definedType.name),
          };
          const manifest = visit(definedType.type, self);
          parentName = null;
          return manifest;
        },

        visitArrayType(arrayType, { self }) {
          const childManifest = visit(arrayType.item, self);
          childManifest.looseType.mapRender((r) => `Array<${r}>`);
          childManifest.strictType.mapRender((r) => `Array<${r}>`);
          const sizeManifest = getArrayLikeSizeOption(arrayType.size, self);
          const encoderOptions = sizeManifest.encoder.render
            ? `, { ${sizeManifest.encoder.render} }`
            : '';
          const decoderOptions = sizeManifest.decoder.render
            ? `, { ${sizeManifest.decoder.render} }`
            : '';
          childManifest.encoder
            .mapRender((r) => `getArrayEncoder(${r + encoderOptions})`)
            .mergeImportsWith(sizeManifest.encoder)
            .addImports('solanaCodecsDataStructures', 'getArrayEncoder');
          childManifest.decoder
            .mapRender((r) => `getArrayDecoder(${r + decoderOptions})`)
            .mergeImportsWith(sizeManifest.decoder)
            .addImports('solanaCodecsDataStructures', 'getArrayDecoder');
          return childManifest;
        },

        visitDefinedTypeLink(node) {
          const strictName = nameApi.dataType(node.name);
          const looseName = nameApi.dataArgsType(node.name);
          const encoderFunction = nameApi.encoderFunction(node.name);
          const decoderFunction = nameApi.decoderFunction(node.name);
          const importFrom = node.importFrom ?? 'generatedTypes';

          return {
            isEnum: false,
            strictType: fragment(strictName).addImports(importFrom, strictName),
            looseType: fragment(looseName).addImports(importFrom, looseName),
            encoder: fragment(`${encoderFunction}()`).addImports(
              importFrom,
              encoderFunction
            ),
            decoder: fragment(`${decoderFunction}()`).addImports(
              importFrom,
              decoderFunction
            ),
          };
        },

        visitEnumType(enumType, { self }) {
          const currentParentName = parentName;
          parentName = null;

          const encoderImports = new ImportMap();
          const decoderImports = new ImportMap();
          const encoderOptions: string[] = [];
          const decoderOptions: string[] = [];

          if (enumType.size.format !== 'u8' || enumType.size.endian !== 'le') {
            const sizeManifest = visit(enumType.size, self);
            encoderImports.mergeWith(sizeManifest.encoder);
            decoderImports.mergeWith(sizeManifest.decoder);
            encoderOptions.push(`size: ${sizeManifest.encoder.render}`);
            decoderOptions.push(`size: ${sizeManifest.decoder.render}`);
          }

          const encoderOptionsAsString =
            encoderOptions.length > 0
              ? `, { ${encoderOptions.join(', ')} }`
              : '';
          const decoderOptionsAsString =
            decoderOptions.length > 0
              ? `, { ${decoderOptions.join(', ')} }`
              : '';

          if (isScalarEnum(enumType)) {
            if (currentParentName === null) {
              throw new Error(
                'Scalar enums cannot be inlined and must be introduced ' +
                  'via a defined type. Ensure you are not inlining a ' +
                  'defined type that is a scalar enum through a visitor.'
              );
            }
            const variantNames = enumType.variants.map(({ name }) =>
              nameApi.scalarEnumVariant(name)
            );
            return {
              isEnum: true,
              strictType: fragment(`{ ${variantNames.join(', ')} }`),
              looseType: fragment(`{ ${variantNames.join(', ')} }`),
              encoder: fragment(
                `getScalarEnumEncoder(${
                  currentParentName.strict + encoderOptionsAsString
                })`,
                encoderImports.add(
                  'solanaCodecsDataStructures',
                  'getScalarEnumEncoder'
                )
              ),
              decoder: fragment(
                `getScalarEnumDecoder(${
                  currentParentName.strict + decoderOptionsAsString
                })`,
                decoderImports.add(
                  'solanaCodecsDataStructures',
                  'getScalarEnumDecoder'
                )
              ),
            };
          }

          const mergedManifest = mergeManifests(
            enumType.variants.map((variant) => visit(variant, self)),
            (renders) => renders.join(' | '),
            (renders) => renders.join(', ')
          );
          mergedManifest.encoder
            .mapRender(
              (r) => `getDataEnumEncoder([${r}]${encoderOptionsAsString})`
            )
            .addImports('solanaCodecsDataStructures', ['getDataEnumEncoder']);
          mergedManifest.decoder
            .mapRender(
              (r) => `getDataEnumDecoder([${r}]${decoderOptionsAsString})`
            )
            .addImports('solanaCodecsDataStructures', ['getDataEnumDecoder']);
          return mergedManifest;
        },

        visitEnumEmptyVariantType(enumEmptyVariantType) {
          const discriminator = nameApi.dataEnumDiscriminator(
            enumEmptyVariantType.name
          );
          const name = nameApi.dataEnumVariant(enumEmptyVariantType.name);
          const kindAttribute = `${discriminator}: "${name}"`;
          return {
            isEnum: false,
            strictType: fragment(`{ ${kindAttribute} }`),
            looseType: fragment(`{ ${kindAttribute} }`),
            encoder: fragment(`['${name}', getUnitEncoder()]`).addImports(
              'solanaCodecsDataStructures',
              'getUnitEncoder'
            ),
            decoder: fragment(`['${name}', getUnitDecoder()]`).addImports(
              'solanaCodecsDataStructures',
              'getUnitDecoder'
            ),
          };
        },

        visitEnumStructVariantType(enumStructVariantType, { self }) {
          const discriminator = nameApi.dataEnumDiscriminator(
            enumStructVariantType.name
          );
          const name = nameApi.dataEnumVariant(enumStructVariantType.name);
          const kindAttribute = `${discriminator}: "${name}"`;
          const structManifest = visit(enumStructVariantType.struct, self);
          structManifest.strictType.mapRender(
            (r) => `{ ${kindAttribute},${r.slice(1, -1)}}`
          );
          structManifest.looseType.mapRender(
            (r) => `{ ${kindAttribute},${r.slice(1, -1)}}`
          );
          structManifest.encoder.mapRender((r) => `['${name}', ${r}]`);
          structManifest.decoder.mapRender((r) => `['${name}', ${r}]`);
          return structManifest;
        },

        visitEnumTupleVariantType(enumTupleVariantType, { self }) {
          const discriminator = nameApi.dataEnumDiscriminator(
            enumTupleVariantType.name
          );
          const name = nameApi.dataEnumVariant(enumTupleVariantType.name);
          const kindAttribute = `${discriminator}: "${name}"`;
          const struct = structTypeNode([
            structFieldTypeNode({
              name: 'fields',
              type: enumTupleVariantType.tuple,
            }),
          ]);
          const structManifest = visit(struct, self);
          structManifest.strictType.mapRender(
            (r) => `{ ${kindAttribute},${r.slice(1, -1)}}`
          );
          structManifest.looseType.mapRender(
            (r) => `{ ${kindAttribute},${r.slice(1, -1)}}`
          );
          structManifest.encoder.mapRender((r) => `['${name}', ${r}]`);
          structManifest.decoder.mapRender((r) => `['${name}', ${r}]`);
          return structManifest;
        },

        visitMapType(mapType, { self }) {
          const key = visit(mapType.key, self);
          const value = visit(mapType.value, self);
          const mergedManifest = mergeManifests(
            [key, value],
            ([k, v]) => `Map<${k}, ${v}>`,
            ([k, v]) => `${k}, ${v}`
          );
          const sizeManifest = getArrayLikeSizeOption(mapType.size, self);
          const encoderOptions = sizeManifest.encoder.render
            ? `, { ${sizeManifest.encoder.render} }`
            : '';
          const decoderOptions = sizeManifest.decoder.render
            ? `, { ${sizeManifest.decoder.render} }`
            : '';
          mergedManifest.encoder
            .mapRender((r) => `getMapEncoder(${r}${encoderOptions})`)
            .addImports('solanaCodecsDataStructures', 'getMapEncoder');
          mergedManifest.decoder
            .mapRender((r) => `getMapDecoder(${r}${decoderOptions})`)
            .addImports('solanaCodecsDataStructures', 'getMapDecoder');
          return mergedManifest;
        },

        visitOptionType(optionType, { self }) {
          const childManifest = visit(optionType.item, self);
          childManifest.strictType
            .mapRender((r) => `Option<${r}>`)
            .addImports('solanaOptions', 'Option');
          childManifest.looseType
            .mapRender((r) => `OptionOrNullable<${r}>`)
            .addImports('solanaOptions', 'OptionOrNullable');
          const encoderOptions: string[] = [];
          const decoderOptions: string[] = [];

          // Prefix option.
          if (
            optionType.prefix.format !== 'u8' ||
            optionType.prefix.endian !== 'le'
          ) {
            const prefixManifest = visit(optionType.prefix, self);
            childManifest.encoder.mergeImportsWith(prefixManifest.encoder);
            childManifest.decoder.mergeImportsWith(prefixManifest.decoder);
            encoderOptions.push(`prefix: ${prefixManifest.encoder.render}`);
            decoderOptions.push(`prefix: ${prefixManifest.decoder.render}`);
          }

          // Fixed option.
          if (optionType.fixed) {
            encoderOptions.push(`fixed: true`);
            decoderOptions.push(`fixed: true`);
          }

          const encoderOptionsAsString =
            encoderOptions.length > 0
              ? `, { ${encoderOptions.join(', ')} }`
              : '';
          const decoderOptionsAsString =
            decoderOptions.length > 0
              ? `, { ${decoderOptions.join(', ')} }`
              : '';
          childManifest.encoder
            .mapRender((r) => `getOptionEncoder(${r + encoderOptionsAsString})`)
            .addImports('solanaOptions', 'getOptionEncoder');
          childManifest.decoder
            .mapRender((r) => `getOptionDecoder(${r + decoderOptionsAsString})`)
            .addImports('solanaOptions', 'getOptionDecoder');
          return childManifest;
        },

        visitSetType(setType, { self }) {
          const childManifest = visit(setType.item, self);
          childManifest.strictType.mapRender((r) => `Set<${r}>`);
          childManifest.looseType.mapRender((r) => `Set<${r}>`);

          const sizeManifest = getArrayLikeSizeOption(setType.size, self);
          const encoderOptions = sizeManifest.encoder.render
            ? `, { ${sizeManifest.encoder.render} }`
            : '';
          const decoderOptions = sizeManifest.decoder.render
            ? `, { ${sizeManifest.decoder.render} }`
            : '';
          childManifest.encoder
            .mergeImportsWith(sizeManifest.encoder)
            .mapRender((r) => `getSetEncoder(${r + encoderOptions})`)
            .addImports('solanaCodecsDataStructures', 'getSetEncoder');
          childManifest.decoder
            .mergeImportsWith(sizeManifest.decoder)
            .mapRender((r) => `getSetDecoder(${r + decoderOptions})`)
            .addImports('solanaCodecsDataStructures', 'getSetDecoder');

          return childManifest;
        },

        visitStructType(structType, { self }) {
          // const currentParentName = parentName;
          parentName = null;
          const optionalFields = structType.fields.filter(
            (f) => !!f.defaultValue
          );

          const mergedManifest = mergeManifests(
            structType.fields.map((field) => visit(field, self)),
            (renders) => `{ ${renders.join('')} }`,
            (renders) => `([${renders.join(', ')}])`
          );

          mergedManifest.encoder
            .mapRender((r) => `getStructEncoder${r}`)
            .addImports('solanaCodecsDataStructures', 'getStructEncoder');
          mergedManifest.decoder
            .mapRender((r) => `getStructDecoder${r}`)
            .addImports('solanaCodecsDataStructures', 'getStructDecoder');

          if (optionalFields.length === 0) {
            return mergedManifest;
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
              mergedManifest.encoder.mergeImportsWith(imports);
              return f.defaultValueStrategy === 'omitted'
                ? `${key}: ${renderedValue}`
                : `${key}: value.${key} ?? ${renderedValue}`;
            })
            .join(', ');
          mergedManifest.encoder
            .mapRender(
              (r) =>
                `mapEncoder(${r}, (value) => ({ ...value, ${defaultValues} }))`
            )
            .addImports('solanaCodecsCore', 'mapEncoder');
          return mergedManifest;
        },

        visitStructFieldType(structFieldType, { self }) {
          const name = camelCase(structFieldType.name);
          const childManifest = visit(structFieldType.type, self);
          const docblock = createDocblock(structFieldType.docs);
          const originalLooseType = childManifest.looseType.render;
          childManifest.strictType.mapRender(
            (r) => `${docblock}${name}: ${r}; `
          );
          childManifest.looseType.mapRender(
            (r) => `${docblock}${name}: ${r}; `
          );
          childManifest.encoder.mapRender((r) => `['${name}', ${r}]`);
          childManifest.decoder.mapRender((r) => `['${name}', ${r}]`);

          // No default value.
          if (!structFieldType.defaultValue) {
            return childManifest;
          }

          // Optional default value.
          if (structFieldType.defaultValueStrategy !== 'omitted') {
            childManifest.looseType.setRender(
              `${docblock}${name}?: ${originalLooseType}; `
            );
            return childManifest;
          }

          // Omitted default value.
          childManifest.looseType = fragment('');
          return childManifest;
        },

        visitTupleType(tupleType, { self }) {
          const items = tupleType.items.map((item) => visit(item, self));
          const mergedManifest = mergeManifests(
            items,
            (types) => `[${types.join(', ')}]`,
            (codecs) => `[${codecs.join(', ')}]`
          );
          mergedManifest.encoder
            .mapRender((render) => `getTupleEncoder(${render})`)
            .addImports('solanaCodecsDataStructures', 'getTupleEncoder');
          mergedManifest.decoder
            .mapRender((render) => `getTupleDecoder(${render})`)
            .addImports('solanaCodecsDataStructures', 'getTupleDecoder');
          return mergedManifest;
        },

        visitBooleanType(booleanType, { self }) {
          const encoderImports = new ImportMap().add(
            'solanaCodecsDataStructures',
            'getBooleanEncoder'
          );
          const decoderImports = new ImportMap().add(
            'solanaCodecsDataStructures',
            'getBooleanDecoder'
          );

          let sizeEncoder = '';
          let sizeDecoder = '';
          if (
            booleanType.size.format !== 'u8' ||
            booleanType.size.endian !== 'le'
          ) {
            const size = visit(booleanType.size, self);
            encoderImports.mergeWith(size.encoder);
            decoderImports.mergeWith(size.decoder);
            sizeEncoder = `{ size: ${size.encoder.render} }`;
            sizeDecoder = `{ size: ${size.decoder.render} }`;
          }

          return {
            isEnum: false,
            strictType: fragment('boolean'),
            looseType: fragment('boolean'),
            encoder: fragment(
              `getBooleanEncoder(${sizeEncoder})`,
              encoderImports
            ),
            decoder: fragment(
              `getBooleanDecoder(${sizeDecoder})`,
              decoderImports
            ),
          };
        },

        visitBytesType(bytesType, { self }) {
          const encoderImports = new ImportMap().add(
            'solanaCodecsDataStructures',
            'getBytesEncoder'
          );
          const decoderImports = new ImportMap().add(
            'solanaCodecsDataStructures',
            'getBytesDecoder'
          );
          const encoderOptions: string[] = [];
          const decoderOptions: string[] = [];

          // Size option.
          if (isNode(bytesType.size, 'prefixedSizeNode')) {
            const prefix = visit(bytesType.size.prefix, self);
            encoderImports.mergeWith(prefix.encoder);
            decoderImports.mergeWith(prefix.decoder);
            encoderOptions.push(`size: ${prefix.encoder.render}`);
            decoderOptions.push(`size: ${prefix.decoder.render}`);
          } else if (isNode(bytesType.size, 'fixedSizeNode')) {
            encoderOptions.push(`size: ${bytesType.size.size}`);
            decoderOptions.push(`size: ${bytesType.size.size}`);
          }

          const encoderOptionsAsString =
            encoderOptions.length > 0 ? `{ ${encoderOptions.join(', ')} }` : '';
          const decoderOptionsAsString =
            decoderOptions.length > 0 ? `{ ${decoderOptions.join(', ')} }` : '';

          return {
            isEnum: false,
            strictType: fragment('Uint8Array'),
            looseType: fragment('Uint8Array'),
            encoder: fragment(
              `getBytesEncoder(${encoderOptionsAsString})`,
              encoderImports
            ),
            decoder: fragment(
              `getBytesDecoder(${decoderOptionsAsString})`,
              decoderImports
            ),
          };
        },

        visitNumberType(numberType) {
          const encoderFunction = nameApi.encoderFunction(numberType.format);
          const decoderFunction = nameApi.decoderFunction(numberType.format);
          const isBigNumber = ['u64', 'u128', 'i64', 'i128'].includes(
            numberType.format
          );
          const encoderImports = new ImportMap().add(
            'solanaCodecsNumbers',
            encoderFunction
          );
          const decoderImports = new ImportMap().add(
            'solanaCodecsNumbers',
            decoderFunction
          );
          let endianness = '';
          if (numberType.endian === 'be') {
            encoderImports.add('solanaCodecsNumbers', 'Endian');
            decoderImports.add('solanaCodecsNumbers', 'Endian');
            endianness = '{ endian: Endian.Big }';
          }
          return {
            isEnum: false,
            strictType: fragment(isBigNumber ? 'bigint' : 'number'),
            looseType: fragment(isBigNumber ? 'number | bigint' : 'number'),
            encoder: fragment(
              `${encoderFunction}(${endianness})`,
              encoderImports
            ),
            decoder: fragment(
              `${decoderFunction}(${endianness})`,
              decoderImports
            ),
          };
        },

        visitAmountType(amountType, { self }) {
          return visit(amountType.number, self);
        },

        visitDateTimeType(dateTimeType, { self }) {
          return visit(dateTimeType.number, self);
        },

        visitSolAmountType(solAmountType, { self }) {
          return visit(solAmountType.number, self);
        },

        visitPublicKeyType() {
          const imports = new ImportMap().add('solanaAddresses', 'Address');
          return {
            isEnum: false,
            strictType: fragment('Address', imports),
            looseType: fragment('Address', imports),
            encoder: fragment('getAddressEncoder()').addImports(
              'solanaAddresses',
              'getAddressEncoder'
            ),
            decoder: fragment('getAddressDecoder()').addImports(
              'solanaAddresses',
              'getAddressDecoder'
            ),
          };
        },

        visitStringType(stringType, { self }) {
          const encoderImports = new ImportMap().add(
            'solanaCodecsStrings',
            'getStringEncoder'
          );
          const decoderImports = new ImportMap().add(
            'solanaCodecsStrings',
            'getStringDecoder'
          );
          const encoderOptions: string[] = [];
          const decoderOptions: string[] = [];

          // Encoding option.
          if (stringType.encoding !== 'utf8') {
            const encoderFunction = nameApi.encoderFunction(
              stringType.encoding
            );
            const decoderFunction = nameApi.decoderFunction(
              stringType.encoding
            );
            encoderImports.add('solanaCodecsStrings', encoderFunction);
            decoderImports.add('solanaCodecsStrings', decoderFunction);
            encoderOptions.push(`encoding: ${encoderFunction}`);
            decoderOptions.push(`encoding: ${decoderFunction}`);
          }

          // Size option.
          if (isNode(stringType.size, 'remainderSizeNode')) {
            encoderOptions.push(`size: 'variable'`);
            decoderOptions.push(`size: 'variable'`);
          } else if (isNode(stringType.size, 'fixedSizeNode')) {
            encoderOptions.push(`size: ${stringType.size.size}`);
            decoderOptions.push(`size: ${stringType.size.size}`);
          } else if (
            stringType.size.prefix.format !== 'u32' ||
            stringType.size.prefix.endian !== 'le'
          ) {
            const prefix = visit(stringType.size.prefix, self);
            encoderImports.mergeWith(prefix.encoder.imports);
            decoderImports.mergeWith(prefix.decoder.imports);
            encoderOptions.push(`size: ${prefix.encoder.render}`);
            decoderOptions.push(`size: ${prefix.decoder.render}`);
          }

          const encoderOptionsAsString =
            encoderOptions.length > 0 ? `{ ${encoderOptions.join(', ')} }` : '';
          const decoderOptionsAsString =
            decoderOptions.length > 0 ? `{ ${decoderOptions.join(', ')} }` : '';

          return {
            isEnum: false,
            strictType: fragment('string'),
            looseType: fragment('string'),
            encoder: fragment(
              `getStringEncoder(${encoderOptionsAsString})`,
              encoderImports
            ),
            decoder: fragment(
              `getStringDecoder(${decoderOptionsAsString})`,
              decoderImports
            ),
          };
        },
      })
  );
}

function createDocblock(docs: string[]): string {
  if (docs.length <= 0) return '';
  if (docs.length === 1) return `\n/** ${docs[0]} */\n`;
  const lines = docs.map((doc) => ` * ${doc}`);
  return `\n/**\n${lines.join('\n')}\n */\n`;
}

function getArrayLikeSizeOption(
  size: SizeNode,
  visitor: Visitor<TypeManifest, 'numberTypeNode'>
): {
  encoder: Fragment;
  decoder: Fragment;
} {
  if (isNode(size, 'fixedSizeNode')) {
    return {
      encoder: fragment(`size: ${size.size}`),
      decoder: fragment(`size: ${size.size}`),
    };
  }
  if (isNode(size, 'remainderSizeNode')) {
    return {
      encoder: fragment(`size: 'remainder'`),
      decoder: fragment(`size: 'remainder'`),
    };
  }
  if (size.prefix.format === 'u32' && size.prefix.endian === 'le') {
    return { encoder: fragment(''), decoder: fragment('') };
  }
  const prefixManifest = visit(size.prefix, visitor);
  prefixManifest.encoder.mapRender((r) => `size: ${r}`);
  prefixManifest.decoder.mapRender((r) => `size: ${r}`);
  return prefixManifest;
}
