import * as nodes from '../../nodes';
import { SizeStrategy, camelCase, pascalCase } from '../../shared';
import { Visitor, visit } from '../../visitors';
import { Fragment, fragment } from './Fragment';
import { ImportMap } from './ImportMap';
import { renderJavaScriptExperimentalValueNode } from './RenderJavaScriptExperimentalValueNode';
import { TypeManifest, mergeManifests } from './TypeManifest';

function getEncoderFunction(name: string) {
  return `get${pascalCase(name)}Encoder`;
}

function getDecoderFunction(name: string) {
  return `get${pascalCase(name)}Decoder`;
}

export class GetJavaScriptExperimentalTypeManifestVisitor
  implements Visitor<TypeManifest>
{
  private parentName: { strict: string; loose: string } | null = null;

  visitRoot(): TypeManifest {
    throw new Error(
      'Cannot get type manifest for root node. Please select a child node.'
    );
  }

  visitProgram(): TypeManifest {
    throw new Error(
      'Cannot get type manifest for program node. Please select a child node.'
    );
  }

  visitAccount(account: nodes.AccountNode): TypeManifest {
    return visit(account.data, this);
  }

  visitAccountData(accountData: nodes.AccountDataNode): TypeManifest {
    this.parentName = {
      strict: pascalCase(accountData.name),
      loose: `${pascalCase(accountData.name)}Args`,
    };
    const manifest = accountData.link
      ? visit(accountData.link, this)
      : visit(accountData.struct, this);
    this.parentName = null;
    return manifest;
  }

  visitInstruction(instruction: nodes.InstructionNode): TypeManifest {
    return visit(instruction.dataArgs, this);
  }

  visitInstructionAccount(): TypeManifest {
    throw new Error(
      'Cannot get type manifest for instruction account node. Please select a another node.'
    );
  }

  visitInstructionDataArgs(
    instructionDataArgs: nodes.InstructionDataArgsNode
  ): TypeManifest {
    this.parentName = {
      strict: pascalCase(instructionDataArgs.name),
      loose: `${pascalCase(instructionDataArgs.name)}Args`,
    };
    const manifest = instructionDataArgs.link
      ? visit(instructionDataArgs.link, this)
      : visit(instructionDataArgs.struct, this);
    this.parentName = null;
    return manifest;
  }

  visitInstructionExtraArgs(
    instructionExtraArgs: nodes.InstructionExtraArgsNode
  ): TypeManifest {
    this.parentName = {
      strict: pascalCase(instructionExtraArgs.name),
      loose: `${pascalCase(instructionExtraArgs.name)}Args`,
    };
    const manifest = instructionExtraArgs.link
      ? visit(instructionExtraArgs.link, this)
      : visit(instructionExtraArgs.struct, this);
    this.parentName = null;
    return manifest;
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): TypeManifest {
    this.parentName = {
      strict: pascalCase(definedType.name),
      loose: `${pascalCase(definedType.name)}Args`,
    };
    const manifest = visit(definedType.data, this);
    this.parentName = null;
    return manifest;
  }

  visitError(): TypeManifest {
    throw new Error('Cannot get type manifest for error node.');
  }

  visitArrayType(arrayType: nodes.ArrayTypeNode): TypeManifest {
    const childManifest = visit(arrayType.child, this);
    childManifest.looseType.mapRender((r) => `Array<${r}>`);
    childManifest.strictType.mapRender((r) => `Array<${r}>`);
    const sizeManifest = this.getArrayLikeSizeOption(arrayType.size);
    const encoderOptions = sizeManifest.encoder.render
      ? `, { ${sizeManifest.encoder.render} }`
      : '';
    const decoderOptions = sizeManifest.decoder.render
      ? `, { ${sizeManifest.decoder.render} }`
      : '';
    childManifest.encoder
      .mapRender((r) => `getArrayEncoder(${r + encoderOptions})`)
      .addImports('solanaCodecsDataStructures', 'getArrayEncoder');
    childManifest.decoder
      .mapRender((r) => `getArrayDecoder(${r + decoderOptions})`)
      .addImports('solanaCodecsDataStructures', 'getArrayDecoder');
    return childManifest;
  }

  visitLinkType(linkType: nodes.LinkTypeNode): TypeManifest {
    const pascalCaseDefinedType = pascalCase(linkType.name);
    const encoderFunction = getEncoderFunction(linkType.name);
    const decoderFunction = getDecoderFunction(linkType.name);
    const importFrom =
      linkType.importFrom === 'generated'
        ? 'generatedTypes'
        : linkType.importFrom;

    return {
      isEnum: false,
      strictType: fragment(pascalCaseDefinedType).addImports(
        importFrom,
        pascalCaseDefinedType
      ),
      looseType: fragment(`${pascalCaseDefinedType}Args`).addImports(
        importFrom,
        `${pascalCaseDefinedType}Args`
      ),
      encoder: fragment(`${encoderFunction}()`).addImports(
        importFrom,
        encoderFunction
      ),
      decoder: fragment(`${decoderFunction}()`).addImports(
        importFrom,
        decoderFunction
      ),
    };
  }

  visitEnumType(enumType: nodes.EnumTypeNode): TypeManifest {
    const strictImports = new ImportMap();
    const looseImports = new ImportMap();
    const serializerImports = new ImportMap().add(
      'umiSerializers',
      'scalarEnum'
    );

    const variantNames = enumType.variants.map((variant) =>
      pascalCase(variant.name)
    );
    const { parentName } = this;
    this.parentName = null;
    const options: string[] = [];

    if (enumType.size.format !== 'u8' || enumType.size.endian !== 'le') {
      const sizeManifest = visit(enumType.size, this);
      strictImports.mergeWith(sizeManifest.strictImports);
      looseImports.mergeWith(sizeManifest.looseImports);
      serializerImports.mergeWith(sizeManifest.serializerImports);
      options.push(`size: ${sizeManifest.serializer}`);
    }

    if (nodes.isScalarEnum(enumType)) {
      if (parentName === null) {
        throw new Error(
          'Scalar enums cannot be inlined and must be introduced ' +
            'via a defined type. Ensure you are not inlining a ' +
            'defined type that is a scalar enum through a visitor.'
        );
      }
      options.push(`description: '${parentName.strict}'`);
      const optionsAsString =
        options.length > 0 ? `, { ${options.join(', ')} }` : '';
      return {
        isEnum: true,
        strictType: `{ ${variantNames.join(', ')} }`,
        strictImports,
        looseType: `{ ${variantNames.join(', ')} }`,
        looseImports,
        serializer:
          `scalarEnum<${parentName.strict}>` +
          `(${parentName.strict + optionsAsString})`,
        serializerImports,
      };
    }

    const variants = enumType.variants.map((variant): TypeManifest => {
      const variantName = pascalCase(variant.name);
      this.parentName = parentName
        ? {
            strict: `GetDataEnumKindContent<${parentName.strict}, '${variantName}'>`,
            loose: `GetDataEnumKindContent<${parentName.loose}, '${variantName}'>`,
          }
        : null;
      const variantManifest = visit(variant, this);
      this.parentName = null;
      return variantManifest;
    });

    const mergedManifest = this.mergeManifests(variants);
    const variantSerializers = variants
      .map((variant) => variant.serializer)
      .join(', ');
    const serializerTypeParams = parentName ? parentName.strict : 'any';
    if (parentName?.strict) {
      options.push(`description: '${pascalCase(parentName.strict)}'`);
    }
    const optionsAsString =
      options.length > 0 ? `, { ${options.join(', ')} }` : '';

    return {
      ...mergedManifest,
      strictType: variants.map((v) => v.strictType).join(' | '),
      looseType: variants.map((v) => v.looseType).join(' | '),
      serializer:
        `dataEnum<${serializerTypeParams}>` +
        `([${variantSerializers}]${optionsAsString})`,
      serializerImports: mergedManifest.serializerImports.add(
        'umiSerializers',
        ['GetDataEnumKindContent', 'GetDataEnumKind', 'dataEnum']
      ),
    };
  }

  visitEnumEmptyVariantType(
    enumEmptyVariantType: nodes.EnumEmptyVariantTypeNode
  ): TypeManifest {
    const name = pascalCase(enumEmptyVariantType.name);
    const kindAttribute = `__kind: "${name}"`;
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
  }

  visitEnumStructVariantType(
    enumStructVariantType: nodes.EnumStructVariantTypeNode
  ): TypeManifest {
    const name = pascalCase(enumStructVariantType.name);
    const kindAttribute = `__kind: "${name}"`;
    const structManifest = visit(enumStructVariantType.struct, this);
    structManifest.strictType.mapRender(
      (r) => `{ ${kindAttribute},${r.slice(1, -1)}}`
    );
    structManifest.looseType.mapRender(
      (r) => `{ ${kindAttribute},${r.slice(1, -1)}}`
    );
    structManifest.encoder.mapRender((r) => `['${name}', ${r}]`);
    structManifest.decoder.mapRender((r) => `['${name}', ${r}]`);
    return structManifest;
  }

  visitEnumTupleVariantType(
    enumTupleVariantType: nodes.EnumTupleVariantTypeNode
  ): TypeManifest {
    const name = pascalCase(enumTupleVariantType.name);
    const kindAttribute = `__kind: "${name}"`;
    const struct = nodes.structTypeNode([
      nodes.structFieldTypeNode({
        name: 'fields',
        child: enumTupleVariantType.tuple,
      }),
    ]);
    const structManifest = visit(struct, this);
    structManifest.strictType.mapRender(
      (r) => `{ ${kindAttribute},${r.slice(1, -1)}}`
    );
    structManifest.looseType.mapRender(
      (r) => `{ ${kindAttribute},${r.slice(1, -1)}}`
    );
    structManifest.encoder.mapRender((r) => `['${name}', ${r}]`);
    structManifest.decoder.mapRender((r) => `['${name}', ${r}]`);
    return structManifest;
  }

  visitMapType(mapType: nodes.MapTypeNode): TypeManifest {
    const key = visit(mapType.key, this);
    const value = visit(mapType.value, this);
    const mergedManifest = mergeManifests(
      [key, value],
      ([k, v]) => `Map<${k}, ${v}>`,
      ([k, v]) => `${k}, ${v}`
    );
    const sizeManifest = this.getArrayLikeSizeOption(mapType.size);
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
  }

  visitOptionType(optionType: nodes.OptionTypeNode): TypeManifest {
    const childManifest = visit(optionType.child, this);
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
      const prefixManifest = visit(optionType.prefix, this);
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
      encoderOptions.length > 0 ? `, { ${encoderOptions.join(', ')} }` : '';
    const decoderOptionsAsString =
      decoderOptions.length > 0 ? `, { ${decoderOptions.join(', ')} }` : '';
    childManifest.encoder
      .mapRender((r) => `getOptionEncoder(${r + encoderOptionsAsString})`)
      .addImports('solanaOptions', 'getOptionEncoder');
    childManifest.decoder
      .mapRender((r) => `getOptionDecoder(${r + decoderOptionsAsString})`)
      .addImports('solanaOptions', 'getOptionDecoder');
    return childManifest;
  }

  visitSetType(setType: nodes.SetTypeNode): TypeManifest {
    const childManifest = visit(setType.child, this);
    childManifest.strictType.mapRender((r) => `Set<${r}>`);
    childManifest.looseType.mapRender((r) => `Set<${r}>`);

    const sizeManifest = this.getArrayLikeSizeOption(setType.size);
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
  }

  visitStructType(structType: nodes.StructTypeNode): TypeManifest {
    const { parentName } = this;
    this.parentName = null;
    const serializerTypeParams = parentName ? parentName.strict : 'any';
    const structDescription =
      parentName?.strict && !parentName.strict.match(/['"<>]/)
        ? `, { description: '${pascalCase(parentName.strict)}' }`
        : '';

    const fields = structType.fields.map((field) => visit(field, this));
    const mergedManifest = mergeManifests(
      fields,
      (renders) => `{ ${renders.join('')} }`,
      (renders) =>
        `<${serializerTypeParams}>([${renders.join(', ')}]${structDescription})`
    );
    mergedManifest.encoder
      .mapRender((r) => `getStructEncoder${r}`)
      .addImports('solanaCodecsDataStructures', 'getStructEncoder');
    mergedManifest.decoder
      .mapRender((r) => `getStructDecoder${r}`)
      .addImports('solanaCodecsDataStructures', 'getStructDecoder');

    const optionalFields = structType.fields.filter(
      (f) => f.defaultsTo !== null
    );
    if (optionalFields.length === 0) {
      return mergedManifest;
    }

    const defaultValues = optionalFields
      .map((f) => {
        const key = camelCase(f.name);
        const defaultsTo = f.defaultsTo as NonNullable<typeof f.defaultsTo>;
        const { render: renderedValue, imports } =
          renderJavaScriptExperimentalValueNode(defaultsTo.value);
        mergedManifest.encoder.mergeImportsWith(imports);
        return defaultsTo.strategy === 'omitted'
          ? `${key}: ${renderedValue}`
          : `${key}: value.${key} ?? ${renderedValue}`;
      })
      .join(', ');
    const mapEncoderTypeParams = parentName
      ? `${parentName.loose}, any, ${parentName.strict}`
      : 'any, any, any';
    mergedManifest.encoder
      .mapRender(
        (r) =>
          `mapEncoder<${mapEncoderTypeParams}>(${r}, ` +
          `(value) => ({ ...value, ${defaultValues} }) ` +
          `)`
      )
      .addImports('solanaCodecsCore', 'mapEncoder');
    return mergedManifest;
  }

  visitStructFieldType(
    structFieldType: nodes.StructFieldTypeNode
  ): TypeManifest {
    const name = camelCase(structFieldType.name);
    const childManifest = visit(structFieldType.child, this);
    const docblock = this.createDocblock(structFieldType.docs);
    const originalLooseType = childManifest.looseType.render;
    childManifest.strictType.mapRender((r) => `${docblock}${name}: ${r}; `);
    childManifest.looseType.mapRender((r) => `${docblock}${name}: ${r}; `);
    childManifest.encoder.mapRender((r) => `['${name}', ${r}]`);
    childManifest.decoder.mapRender((r) => `['${name}', ${r}]`);

    // No default value.
    if (structFieldType.defaultsTo === null) {
      return childManifest;
    }

    // Optional default value.
    if (structFieldType.defaultsTo.strategy === 'optional') {
      childManifest.looseType.render = `${docblock}${name}?: ${originalLooseType}; `;
      return childManifest;
    }

    // Omitted default value.
    childManifest.looseType = fragment('');
    return childManifest;
  }

  visitTupleType(tupleType: nodes.TupleTypeNode): TypeManifest {
    const children = tupleType.children.map((item) => visit(item, this));
    const mergedManifest = mergeManifests(
      children,
      (types) => `[${types.join(', ')}]`,
      (codecs) => `[${codecs.join(', ')}]`
    );
    mergedManifest.encoder
      .mapRender((render) => `getTupleEncoder([${render}])`)
      .addImports('solanaCodecsDataStructures', 'getTupleEncoder');
    mergedManifest.decoder
      .mapRender((render) => `getTupleDecoder([${render}])`)
      .addImports('solanaCodecsDataStructures', 'getTupleDecoder');
    return mergedManifest;
  }

  visitBoolType(boolType: nodes.BoolTypeNode): TypeManifest {
    const encoderImports = new ImportMap().add(
      'solanaCodecsDataStructure',
      'getBooleanEncoder'
    );
    const decoderImports = new ImportMap().add(
      'solanaCodecsDataStructure',
      'getBooleanDecoder'
    );

    let sizeEncoder = '';
    let sizeDecoder = '';
    if (boolType.size.format !== 'u8' || boolType.size.endian !== 'le') {
      const size = visit(boolType.size, this);
      encoderImports.mergeWith(size.encoder);
      decoderImports.mergeWith(size.decoder);
      sizeEncoder = `{ size: ${size.encoder.render} }`;
      sizeDecoder = `{ size: ${size.decoder.render} }`;
    }

    return {
      isEnum: false,
      strictType: fragment('boolean'),
      looseType: fragment('boolean'),
      encoder: fragment(`getBooleanEncoder(${sizeEncoder})`, encoderImports),
      decoder: fragment(`getBooleanDecoder(${sizeDecoder})`, decoderImports),
    };
  }

  visitBytesType(bytesType: nodes.BytesTypeNode): TypeManifest {
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
    if (bytesType.size.kind === 'prefixed') {
      const prefix = visit(bytesType.size.prefix, this);
      encoderImports.mergeWith(prefix.encoder);
      decoderImports.mergeWith(prefix.decoder);
      encoderOptions.push(`size: ${prefix.encoder.render}`);
      decoderOptions.push(`size: ${prefix.decoder.render}`);
    } else if (bytesType.size.kind === 'fixed') {
      encoderOptions.push(`size: ${bytesType.size.value}`);
      decoderOptions.push(`size: ${bytesType.size.value}`);
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
  }

  visitNumberType(numberType: nodes.NumberTypeNode): TypeManifest {
    const encoderFunction = getEncoderFunction(numberType.format);
    const decoderFunction = getDecoderFunction(numberType.format);
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
      encoder: fragment(`${encoderFunction}(${endianness})`, encoderImports),
      decoder: fragment(`${decoderFunction}(${endianness})`, decoderImports),
    };
  }

  visitNumberWrapperType(
    numberWrapperType: nodes.NumberWrapperTypeNode
  ): TypeManifest {
    // TODO: Support number wrapper types.
    const { number } = numberWrapperType;
    return visit(number, this);
  }

  visitPublicKeyType(): TypeManifest {
    const imports = new ImportMap().add(
      'solanaAddresses',
      'Base58EncodedAddress'
    );
    return {
      isEnum: false,
      strictType: fragment('Base58EncodedAddress', imports),
      looseType: fragment('Base58EncodedAddress', imports),
      encoder: fragment('getAddressEncoder()').addImports(
        'solanaAddresses',
        'getAddressEncoder'
      ),
      decoder: fragment('getAddressDecoder()').addImports(
        'solanaAddresses',
        'getAddressDecoder'
      ),
    };
  }

  visitStringType(stringType: nodes.StringTypeNode): TypeManifest {
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
      const encoderFunction = getEncoderFunction(stringType.encoding);
      const decoderFunction = getDecoderFunction(stringType.encoding);
      encoderImports.add('solanaCodecsStrings', encoderFunction);
      decoderImports.add('solanaCodecsStrings', decoderFunction);
      encoderOptions.push(`encoding: ${encoderFunction}`);
      decoderOptions.push(`encoding: ${decoderFunction}`);
    }

    // Size option.
    if (stringType.size.kind === 'remainder') {
      encoderOptions.push(`size: 'variable'`);
      decoderOptions.push(`size: 'variable'`);
    } else if (stringType.size.kind === 'fixed') {
      encoderOptions.push(`size: ${stringType.size.value}`);
      decoderOptions.push(`size: ${stringType.size.value}`);
    } else if (
      stringType.size.prefix.format !== 'u32' ||
      stringType.size.prefix.endian !== 'le'
    ) {
      const prefix = visit(stringType.size.prefix, this);
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
  }

  protected createDocblock(docs: string[]): string {
    if (docs.length <= 0) return '';
    if (docs.length === 1) return `\n/** ${docs[0]} */\n`;
    const lines = docs.map((doc) => ` * ${doc}`);
    return `\n/**\n${lines.join('\n')}\n */\n`;
  }

  protected getArrayLikeSizeOption(size: SizeStrategy): {
    encoder: Fragment;
    decoder: Fragment;
  } {
    if (size.kind === 'fixed') {
      return {
        encoder: fragment(`size: ${size.value}`),
        decoder: fragment(`size: ${size.value}`),
      };
    }
    if (size.kind === 'remainder') {
      return {
        encoder: fragment(`size: 'remainder'`),
        decoder: fragment(`size: 'remainder'`),
      };
    }
    if (size.prefix.format === 'u32' && size.prefix.endian === 'le') {
      return { encoder: fragment(''), decoder: fragment('') };
    }
    const prefixManifest = visit(size.prefix, this);
    prefixManifest.encoder.mapRender((r) => `size: ${r}`);
    prefixManifest.decoder.mapRender((r) => `size: ${r}`);
    return prefixManifest;
  }
}
