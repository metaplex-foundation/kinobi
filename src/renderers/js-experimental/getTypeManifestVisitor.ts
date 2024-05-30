import {
  CountNode,
  REGISTERED_TYPE_NODE_KINDS,
  REGISTERED_VALUE_NODE_KINDS,
  TypeNode,
  getBytesFromBytesValueNode,
  isNode,
  isScalarEnum,
  resolveNestedTypeNode,
  structFieldTypeNode,
  structTypeNode,
  structTypeNodeFromInstructionArgumentNodes,
} from '../../nodes';
import {
  LinkableDictionary,
  MainCaseString,
  camelCase,
  jsDocblock,
  mainCase,
  pipe,
} from '../../shared';
import { Visitor, extendVisitor, staticVisitor, visit } from '../../visitors';
import { ImportMap } from './ImportMap';
import { TypeManifest, mergeManifests, typeManifest } from './TypeManifest';
import { ParsedCustomDataOptions } from './customDataHelpers';
import { Fragment, fragment, mergeFragments } from './fragments';
import { NameApi } from './nameTransformers';

export type TypeManifestVisitor = ReturnType<typeof getTypeManifestVisitor>;

export function getTypeManifestVisitor(input: {
  nameApi: NameApi;
  linkables: LinkableDictionary;
  nonScalarEnums: MainCaseString[];
  customAccountData: ParsedCustomDataOptions;
  customInstructionData: ParsedCustomDataOptions;
  parentName?: { strict: string; loose: string };
}) {
  const {
    nameApi,
    linkables,
    nonScalarEnums,
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
          value: fragment(''),
        }) as TypeManifest,
      [
        ...REGISTERED_TYPE_NODE_KINDS,
        ...REGISTERED_VALUE_NODE_KINDS,
        'definedTypeLinkNode',
        'definedTypeNode',
        'accountNode',
        'instructionNode',
      ]
    ),
    (visitor) =>
      extendVisitor(visitor, {
        visitAccount(account, { self }) {
          parentName = {
            strict: nameApi.dataType(account.name),
            loose: nameApi.dataArgsType(account.name),
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
          const sizeManifest = getArrayLikeSizeOption(arrayType.count, self);
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

          console.log(strictName, looseName, node);

          return {
            isEnum: false,
            strictType: fragment(strictName).addImports(importFrom, `type ${strictName}`),
            looseType: fragment(looseName).addImports(importFrom, `type ${looseName}`),
            encoder: fragment(`${encoderFunction}()`).addImports(
              importFrom,
              encoderFunction
            ),
            decoder: fragment(`${decoderFunction}()`).addImports(
              importFrom,
              decoderFunction
            ),
            value: fragment(''),
          };
        },

        visitEnumType(enumType, { self }) {
          const currentParentName = parentName;
          const encoderImports = new ImportMap();
          const decoderImports = new ImportMap();
          const encoderOptions: string[] = [];
          const decoderOptions: string[] = [];

          const enumSize = resolveNestedTypeNode(enumType.size);
          if (enumSize.format !== 'u8' || enumSize.endian !== 'le') {
            const sizeManifest = visit(enumType.size, self);
            encoderImports.mergeWith(sizeManifest.encoder);
            decoderImports.mergeWith(sizeManifest.decoder);
            encoderOptions.push(`size: ${sizeManifest.encoder.render}`);
            decoderOptions.push(`size: ${sizeManifest.decoder.render}`);
          }

          const discriminator = nameApi.discriminatedUnionDiscriminator(
            mainCase(currentParentName?.strict ?? '')
          );
          if (!isScalarEnum(enumType) && discriminator !== '__kind') {
            encoderOptions.push(`discriminator: '${discriminator}'`);
            decoderOptions.push(`discriminator: '${discriminator}'`);
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
              nameApi.enumVariant(name)
            );
            return {
              isEnum: true,
              strictType: fragment(`{ ${variantNames.join(', ')} }`),
              looseType: fragment(`{ ${variantNames.join(', ')} }`),
              encoder: fragment(
                `getEnumEncoder(${
                  currentParentName.strict + encoderOptionsAsString
                })`,
                encoderImports.add(
                  'solanaCodecsDataStructures',
                  'getEnumEncoder'
                )
              ),
              decoder: fragment(
                `getEnumDecoder(${
                  currentParentName.strict + decoderOptionsAsString
                })`,
                decoderImports.add(
                  'solanaCodecsDataStructures',
                  'getEnumDecoder'
                )
              ),
              value: fragment(''),
            };
          }

          const mergedManifest = mergeManifests(
            enumType.variants.map((variant) => visit(variant, self)),
            {
              mergeTypes: (renders) => renders.join(' | '),
              mergeCodecs: (renders) => renders.join(', '),
            }
          );
          mergedManifest.encoder
            .mapRender(
              (r) =>
                `getDiscriminatedUnionEncoder([${r}]${encoderOptionsAsString})`
            )
            .mergeImportsWith(encoderImports)
            .addImports('solanaCodecsDataStructures', [
              'getDiscriminatedUnionEncoder',
            ]);
          mergedManifest.decoder
            .mapRender(
              (r) =>
                `getDiscriminatedUnionDecoder([${r}]${decoderOptionsAsString})`
            )
            .mergeImportsWith(decoderImports)
            .addImports('solanaCodecsDataStructures', [
              'getDiscriminatedUnionDecoder',
            ]);
          return mergedManifest;
        },

        visitEnumEmptyVariantType(enumEmptyVariantType) {
          const discriminator = nameApi.discriminatedUnionDiscriminator(
            mainCase(parentName?.strict ?? '')
          );
          const name = nameApi.discriminatedUnionVariant(
            enumEmptyVariantType.name
          );
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
            value: fragment(''),
          };
        },

        visitEnumStructVariantType(enumStructVariantType, { self }) {
          const currentParentName = parentName;
          const discriminator = nameApi.discriminatedUnionDiscriminator(
            mainCase(currentParentName?.strict ?? '')
          );
          const name = nameApi.discriminatedUnionVariant(
            enumStructVariantType.name
          );
          const kindAttribute = `${discriminator}: "${name}"`;

          parentName = null;
          const structManifest = visit(enumStructVariantType.struct, self);
          parentName = currentParentName;

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
          const currentParentName = parentName;
          const discriminator = nameApi.discriminatedUnionDiscriminator(
            mainCase(currentParentName?.strict ?? '')
          );
          const name = nameApi.discriminatedUnionVariant(
            enumTupleVariantType.name
          );
          const kindAttribute = `${discriminator}: "${name}"`;
          const struct = structTypeNode([
            structFieldTypeNode({
              name: 'fields',
              type: enumTupleVariantType.tuple,
            }),
          ]);

          parentName = null;
          const structManifest = visit(struct, self);
          parentName = currentParentName;

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
          const mergedManifest = mergeManifests([key, value], {
            mergeTypes: ([k, v]) => `Map<${k}, ${v}>`,
            mergeCodecs: ([k, v]) => `${k}, ${v}`,
          });
          const sizeManifest = getArrayLikeSizeOption(mapType.count, self);
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
            .addImports('solanaOptions', 'type Option');
          childManifest.looseType
            .mapRender((r) => `OptionOrNullable<${r}>`)
            .addImports('solanaOptions', 'type OptionOrNullable');
          const encoderOptions: string[] = [];
          const decoderOptions: string[] = [];

          // Prefix option.
          const optionPrefix = resolveNestedTypeNode(optionType.prefix);
          if (optionPrefix.format !== 'u8' || optionPrefix.endian !== 'le') {
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

          const sizeManifest = getArrayLikeSizeOption(setType.count, self);
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
          const optionalFields = structType.fields.filter(
            (f) => !!f.defaultValue
          );

          const mergedManifest = mergeManifests(
            structType.fields.map((field) => visit(field, self)),
            {
              mergeTypes: (renders) => `{ ${renders.join('')} }`,
              mergeCodecs: (renders) => `([${renders.join(', ')}])`,
            }
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
                self
              ).value;
              mergedManifest.encoder.mergeImportsWith(imports);
              return f.defaultValueStrategy === 'omitted'
                ? `${key}: ${renderedValue}`
                : `${key}: value.${key} ?? ${renderedValue}`;
            })
            .join(', ');
          mergedManifest.encoder
            .mapRender(
              (r) =>
                `transformEncoder(${r}, (value) => ({ ...value, ${defaultValues} }))`
            )
            .addImports('solanaCodecsCore', 'transformEncoder');
          return mergedManifest;
        },

        visitStructFieldType(structFieldType, { self }) {
          const name = camelCase(structFieldType.name);
          const childManifest = visit(structFieldType.type, self);
          const docblock =
            structFieldType.docs.length > 0
              ? `\n${jsDocblock(structFieldType.docs)}`
              : '';
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
          const mergedManifest = mergeManifests(items, {
            mergeTypes: (types) => `readonly [${types.join(', ')}]`,
            mergeCodecs: (codecs) => `[${codecs.join(', ')}]`,
          });
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
          const resolvedSize = resolveNestedTypeNode(booleanType.size);
          if (resolvedSize.format !== 'u8' || resolvedSize.endian !== 'le') {
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
            value: fragment(''),
          };
        },

        visitBytesType() {
          return {
            isEnum: false,
            strictType: fragment('ReadonlyUint8Array').addImports(
              'solanaCodecsCore',
              'type ReadonlyUint8Array'
            ),
            looseType: fragment('ReadonlyUint8Array').addImports(
              'solanaCodecsCore',
              'type ReadonlyUint8Array'
            ),
            encoder: fragment(`getBytesEncoder()`).addImports(
              'solanaCodecsDataStructures',
              'getBytesEncoder'
            ),
            decoder: fragment(`getBytesDecoder()`).addImports(
              'solanaCodecsDataStructures',
              'getBytesDecoder'
            ),
            value: fragment(''),
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
            value: fragment(''),
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
          const imports = new ImportMap().add('solanaAddresses', 'type Address');
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
            value: fragment(''),
          };
        },

        visitStringType(stringType) {
          const [encoder, decoder] = (() => {
            switch (stringType.encoding) {
              case 'base16':
                return ['getBase16Encoder', 'getBase16Decoder'];
              case 'base58':
                return ['getBase58Encoder', 'getBase58Decoder'];
              case 'base64':
                return ['getBase64Encoder', 'getBase64Decoder'];
              case 'utf8':
                return ['getUtf8Encoder', 'getUtf8Decoder'];
              default:
                throw new Error(
                  `Unsupported string encoding: ${stringType.encoding}`
                );
            }
          })();
          return {
            isEnum: false,
            strictType: fragment('string'),
            looseType: fragment('string'),
            encoder: fragment(`${encoder}()`).addImports(
              'solanaCodecsStrings',
              encoder
            ),
            decoder: fragment(`${decoder}()`).addImports(
              'solanaCodecsStrings',
              decoder
            ),
            value: fragment(''),
          };
        },

        visitFixedSizeType(node, { self }) {
          const manifest = visit(node.type, self);
          manifest.encoder
            .mapRender((r) => `fixEncoderSize(${r}, ${node.size})`)
            .addImports('solanaCodecsCore', 'fixEncoderSize');
          manifest.decoder
            .mapRender((r) => `fixDecoderSize(${r}, ${node.size})`)
            .addImports('solanaCodecsCore', 'fixDecoderSize');
          return manifest;
        },

        visitHiddenPrefixType(node, { self }) {
          const manifest = visit(node.type, self);
          const prefixes = node.prefix.map((c) => visit(c, self).value);
          const prefixEncoders = fragment(
            prefixes.map((c) => `getConstantEncoder(${c})`).join(', ')
          )
            .addImports('solanaCodecsCore', 'getConstantEncoder')
            .mergeImportsWith(...prefixes);
          const prefixDecoders = fragment(
            prefixes.map((c) => `getConstantDecoder(${c})`).join(', ')
          )
            .addImports('solanaCodecsCore', 'getConstantDecoder')
            .mergeImportsWith(...prefixes);
          manifest.encoder
            .mapRender(
              (r) => `getHiddenPrefixEncoder(${r}, [${prefixEncoders}])`
            )
            .mergeImportsWith(prefixEncoders)
            .addImports('solanaCodecsDataStructures', 'getHiddenPrefixEncoder');
          manifest.decoder
            .mapRender(
              (r) => `getHiddenPrefixDecoder(${r}, [${prefixDecoders}])`
            )
            .mergeImportsWith(prefixDecoders)
            .addImports('solanaCodecsDataStructures', 'getHiddenPrefixDecoder');
          return manifest;
        },

        visitHiddenSuffixType(node, { self }) {
          const manifest = visit(node.type, self);
          const suffixes = node.suffix.map((c) => visit(c, self).value);
          const suffixEncoders = fragment(
            suffixes.map((c) => `getConstantEncoder(${c})`).join(', ')
          )
            .addImports('solanaCodecsCore', 'getConstantEncoder')
            .mergeImportsWith(...suffixes);
          const suffixDecoders = fragment(
            suffixes.map((c) => `getConstantDecoder(${c})`).join(', ')
          )
            .addImports('solanaCodecsCore', 'getConstantDecoder')
            .mergeImportsWith(...suffixes);
          manifest.encoder
            .mapRender(
              (r) => `getHiddenSuffixEncoder(${r}, [${suffixEncoders}])`
            )
            .mergeImportsWith(suffixEncoders)
            .addImports('solanaCodecsDataStructures', 'getHiddenSuffixEncoder');
          manifest.decoder
            .mapRender(
              (r) => `getHiddenSuffixDecoder(${r}, [${suffixDecoders}])`
            )
            .mergeImportsWith(suffixDecoders)
            .addImports('solanaCodecsDataStructures', 'getHiddenSuffixDecoder');
          return manifest;
        },

        visitPostOffsetType(node, { self }) {
          const manifest = visit(node.type, self);
          if (node.strategy === 'padded') {
            manifest.encoder
              .mapRender((r) => `padRightEncoder(${r}, ${node.offset})`)
              .addImports('solanaCodecsCore', 'padRightEncoder');
            manifest.decoder
              .mapRender((r) => `padRightDecoder(${r}, ${node.offset})`)
              .addImports('solanaCodecsCore', 'padRightDecoder');
            return manifest;
          }
          const fn = (() => {
            switch (node.strategy) {
              case 'absolute':
                return node.offset < 0
                  ? `({ wrapBytes }) => wrapBytes(${node.offset})`
                  : `() => ${node.offset}`;
              case 'preOffset':
                return node.offset < 0
                  ? `({ preOffset }) => preOffset ${node.offset}`
                  : `({ preOffset }) => preOffset + ${node.offset}`;
              case 'relative':
              default:
                return node.offset < 0
                  ? `({ postOffset }) => postOffset ${node.offset}`
                  : `({ postOffset }) => postOffset + ${node.offset}`;
            }
          })();
          manifest.encoder
            .mapRender((r) => `offsetEncoder(${r}, { postOffset: ${fn} })`)
            .addImports('solanaCodecsCore', 'offsetEncoder');
          manifest.decoder
            .mapRender((r) => `offsetDecoder(${r}, { postOffset: ${fn} })`)
            .addImports('solanaCodecsCore', 'offsetDecoder');
          return manifest;
        },

        visitPreOffsetType(node, { self }) {
          const manifest = visit(node.type, self);
          if (node.strategy === 'padded') {
            manifest.encoder
              .mapRender((r) => `padLeftEncoder(${r}, ${node.offset})`)
              .addImports('solanaCodecsCore', 'padLeftEncoder');
            manifest.decoder
              .mapRender((r) => `padLeftDecoder(${r}, ${node.offset})`)
              .addImports('solanaCodecsCore', 'padLeftDecoder');
            return manifest;
          }
          const fn = (() => {
            switch (node.strategy) {
              case 'absolute':
                return node.offset < 0
                  ? `({ wrapBytes }) => wrapBytes(${node.offset})`
                  : `() => ${node.offset}`;
              case 'relative':
              default:
                return node.offset < 0
                  ? `({ preOffset }) => preOffset ${node.offset}`
                  : `({ preOffset }) => preOffset + ${node.offset}`;
            }
          })();
          manifest.encoder
            .mapRender((r) => `offsetEncoder(${r}, { preOffset: ${fn} })`)
            .addImports('solanaCodecsCore', 'offsetEncoder');
          manifest.decoder
            .mapRender((r) => `offsetDecoder(${r}, { preOffset: ${fn} })`)
            .addImports('solanaCodecsCore', 'offsetDecoder');
          return manifest;
        },

        visitSentinelType(node, { self }) {
          const manifest = visit(node.type, self);
          const sentinel = visit(node.sentinel, self).value;
          manifest.encoder
            .mapRender((r) => `addEncoderSentinel(${r}, ${sentinel})`)
            .mergeImportsWith(sentinel)
            .addImports('solanaCodecsCore', 'addEncoderSentinel');
          manifest.decoder
            .mapRender((r) => `addDecoderSentinel(${r}, ${sentinel})`)
            .mergeImportsWith(sentinel)
            .addImports('solanaCodecsCore', 'addDecoderSentinel');
          return manifest;
        },

        visitSizePrefixType(node, { self }) {
          const manifest = visit(node.type, self);
          const prefix = visit(node.prefix, self);
          manifest.encoder
            .mapRender((r) => `addEncoderSizePrefix(${r}, ${prefix.encoder})`)
            .mergeImportsWith(prefix.encoder)
            .addImports('solanaCodecsCore', 'addEncoderSizePrefix');
          manifest.decoder
            .mapRender((r) => `addDecoderSizePrefix(${r}, ${prefix.decoder})`)
            .mergeImportsWith(prefix.decoder)
            .addImports('solanaCodecsCore', 'addDecoderSizePrefix');
          return manifest;
        },

        visitZeroableOptionType(node, { self }) {
          const childManifest = visit(node.item, self);
          childManifest.strictType
            .mapRender((r) => `Option<${r}>`)
            .addImports('solanaOptions', 'type Option');
          childManifest.looseType
            .mapRender((r) => `OptionOrNullable<${r}>`)
            .addImports('solanaOptions', 'type OptionOrNullable');
          const encoderOptions: string[] = [];
          const decoderOptions: string[] = [];

          // Zero-value option.
          if (node.zeroValue) {
            const zeroValueManifest = visit(node.zeroValue, self);
            childManifest.encoder.mergeImportsWith(zeroValueManifest.value);
            childManifest.decoder.mergeImportsWith(zeroValueManifest.value);
            encoderOptions.push(`zeroValue: ${zeroValueManifest.value.render}`);
            decoderOptions.push(`zeroValue: ${zeroValueManifest.value.render}`);
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
            .mapRender(
              (r) => `getZeroableOptionEncoder(${r + encoderOptionsAsString})`
            )
            .addImports('solanaOptions', 'getZeroableOptionEncoder');
          childManifest.decoder
            .mapRender(
              (r) => `getZeroableOptionDecoder(${r + decoderOptionsAsString})`
            )
            .addImports('solanaOptions', 'getZeroableOptionDecoder');
          return childManifest;
        },

        visitArrayValue(node, { self }) {
          return mergeManifests(
            node.items.map((v) => visit(v, self)),
            { mergeValues: (renders) => `[${renders.join(', ')}]` }
          );
        },

        visitBooleanValue(node) {
          const manifest = typeManifest();
          manifest.value.setRender(JSON.stringify(node.boolean));
          return manifest;
        },

        visitBytesValue(node) {
          const manifest = typeManifest();
          const bytes = getBytesFromBytesValueNode(node);
          manifest.value.setRender(
            `new Uint8Array([${Array.from(bytes).join(', ')}])`
          );
          return manifest;
        },

        visitConstantValue(node, { self }) {
          if (
            isNode(node.type, 'bytesTypeNode') &&
            isNode(node.value, 'bytesValueNode')
          ) {
            return visit(node.value, self);
          }
          return {
            ...typeManifest(),
            value: mergeFragments(
              [visit(node.type, self).encoder, visit(node.value, self).value],
              ([encoderFunction, value]) =>
                `${encoderFunction}.encode(${value})`
            ),
          };
        },

        visitEnumValue(node, { self }) {
          const manifest = typeManifest();
          const enumName = nameApi.dataType(node.enum.name);
          const enumFunction = nameApi.discriminatedUnionFunction(
            node.enum.name
          );
          const importFrom = node.enum.importFrom ?? 'generatedTypes';

          const enumNode = linkables.get(node.enum)?.type;
          const isScalar =
            enumNode && isNode(enumNode, 'enumTypeNode')
              ? isScalarEnum(enumNode)
              : !nonScalarEnums.includes(node.enum.name);

          if (!node.value && isScalar) {
            const variantName = nameApi.enumVariant(node.variant);
            manifest.value
              .setRender(`${enumName}.${variantName}`)
              .addImports(importFrom, enumName);
            return manifest;
          }

          const variantName = nameApi.discriminatedUnionVariant(node.variant);
          if (!node.value) {
            manifest.value
              .setRender(`${enumFunction}('${variantName}')`)
              .addImports(importFrom, enumFunction);
            return manifest;
          }

          manifest.value = visit(node.value, self)
            .value.mapRender((r) => `${enumFunction}('${variantName}', ${r})`)
            .addImports(importFrom, enumFunction);
          return manifest;
        },

        visitMapValue(node, { self }) {
          const entryFragments = node.entries.map((entry) =>
            visit(entry, self)
          );
          return mergeManifests(entryFragments, {
            mergeValues: (renders) => `new Map([${renders.join(', ')}])`,
          });
        },

        visitMapEntryValue(node, { self }) {
          return mergeManifests(
            [visit(node.key, self), visit(node.value, self)],
            { mergeValues: (renders) => `[${renders.join(', ')}]` }
          );
        },

        visitNoneValue() {
          const manifest = typeManifest();
          manifest.value
            .setRender('none()')
            .addImports('solanaOptions', 'none');
          return manifest;
        },

        visitNumberValue(node) {
          const manifest = typeManifest();
          manifest.value.setRender(JSON.stringify(node.number));
          return manifest;
        },

        visitPublicKeyValue(node) {
          const manifest = typeManifest();
          manifest.value
            .setRender(`address("${node.publicKey}")`)
            .addImports('solanaAddresses', 'address');
          return manifest;
        },

        visitSetValue(node, { self }) {
          return mergeManifests(
            node.items.map((v) => visit(v, self)),
            { mergeValues: (renders) => `new Set([${renders.join(', ')}])` }
          );
        },

        visitSomeValue(node, { self }) {
          const manifest = typeManifest();
          manifest.value = visit(node.value, self)
            .value.mapRender((r) => `some(${r})`)
            .addImports('solanaOptions', 'some');
          return manifest;
        },

        visitStringValue(node) {
          const manifest = typeManifest();
          manifest.value.setRender(JSON.stringify(node.string));
          return manifest;
        },

        visitStructValue(node, { self }) {
          return mergeManifests(
            node.fields.map((field) => visit(field, self)),
            { mergeValues: (renders) => `{ ${renders.join(', ')} }` }
          );
        },

        visitStructFieldValue(node, { self }) {
          const manifest = typeManifest();
          manifest.value = visit(node.value, self).value.mapRender(
            (r) => `${node.name}: ${r}`
          );
          return manifest;
        },

        visitTupleValue(node, { self }) {
          return mergeManifests(
            node.items.map((v) => visit(v, self)),
            { mergeValues: (renders) => `[${renders.join(', ')}]` }
          );
        },
      })
  );
}

function getArrayLikeSizeOption(
  count: CountNode,
  visitor: Visitor<TypeManifest, TypeNode['kind']>
): {
  encoder: Fragment;
  decoder: Fragment;
} {
  if (isNode(count, 'fixedCountNode')) {
    return {
      encoder: fragment(`size: ${count.value}`),
      decoder: fragment(`size: ${count.value}`),
    };
  }
  if (isNode(count, 'remainderCountNode')) {
    return {
      encoder: fragment(`size: 'remainder'`),
      decoder: fragment(`size: 'remainder'`),
    };
  }
  const prefix = resolveNestedTypeNode(count.prefix);
  if (prefix.format === 'u32' && prefix.endian === 'le') {
    return { encoder: fragment(''), decoder: fragment('') };
  }
  const prefixManifest = visit(count.prefix, visitor);
  prefixManifest.encoder.mapRender((r) => `size: ${r}`);
  prefixManifest.decoder.mapRender((r) => `size: ${r}`);
  return prefixManifest;
}
