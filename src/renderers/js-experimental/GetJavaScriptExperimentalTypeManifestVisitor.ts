import * as nodes from '../../nodes';
import { SizeStrategy, camelCase, capitalize, pascalCase } from '../../shared';
import { Visitor, visit } from '../../visitors';
import { Fragment, fragment } from './Fragment';
import { ImportMap } from './ImportMap';
import { renderJavaScriptExperimentalValueNode } from './RenderJavaScriptExperimentalValueNode';

export type JavaScriptExperimentalTypeManifest = {
  isEnum: boolean;
  strictType: Fragment;
  looseType: Fragment;
  encoder: Fragment;
  decoder: Fragment;
};

function getEncoderFunction(name: string) {
  return `get${capitalize(name)}Encoder`;
}

function getDecoderFunction(name: string) {
  return `get${capitalize(name)}Decoder`;
}

export class GetJavaScriptExperimentalTypeManifestVisitor
  implements Visitor<JavaScriptExperimentalTypeManifest>
{
  private parentName: { strict: string; loose: string } | null = null;

  visitRoot(): JavaScriptExperimentalTypeManifest {
    throw new Error(
      'Cannot get type manifest for root node. Please select a child node.'
    );
  }

  visitProgram(): JavaScriptExperimentalTypeManifest {
    throw new Error(
      'Cannot get type manifest for program node. Please select a child node.'
    );
  }

  visitAccount(account: nodes.AccountNode): JavaScriptExperimentalTypeManifest {
    return visit(account.data, this);
  }

  visitAccountData(
    accountData: nodes.AccountDataNode
  ): JavaScriptExperimentalTypeManifest {
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

  visitInstruction(
    instruction: nodes.InstructionNode
  ): JavaScriptExperimentalTypeManifest {
    return visit(instruction.dataArgs, this);
  }

  visitInstructionAccount(): JavaScriptExperimentalTypeManifest {
    throw new Error(
      'Cannot get type manifest for instruction account node. Please select a another node.'
    );
  }

  visitInstructionDataArgs(
    instructionDataArgs: nodes.InstructionDataArgsNode
  ): JavaScriptExperimentalTypeManifest {
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
  ): JavaScriptExperimentalTypeManifest {
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

  visitDefinedType(
    definedType: nodes.DefinedTypeNode
  ): JavaScriptExperimentalTypeManifest {
    this.parentName = {
      strict: pascalCase(definedType.name),
      loose: `${pascalCase(definedType.name)}Args`,
    };
    const manifest = visit(definedType.data, this);
    this.parentName = null;
    return manifest;
  }

  visitError(): JavaScriptExperimentalTypeManifest {
    throw new Error('Cannot get type manifest for error node.');
  }

  visitArrayType(
    arrayType: nodes.ArrayTypeNode
  ): JavaScriptExperimentalTypeManifest {
    const childManifest = visit(arrayType.child, this);
    childManifest.serializerImports.add(
      'solanaCodecsDataStructures',
      'getArrayCodec'
    );
    const sizeOption = this.getArrayLikeSizeOption(
      arrayType.size,
      childManifest
    );
    const options = sizeOption ? `, { ${sizeOption} }` : '';
    return {
      ...childManifest,
      strictType: `Array<${childManifest.strictType}>`,
      looseType: `Array<${childManifest.looseType}>`,
      serializer: `array(${childManifest.serializer + options})`,
    };
  }

  visitLinkType(
    linkType: nodes.LinkTypeNode
  ): JavaScriptExperimentalTypeManifest {
    const pascalCaseDefinedType = pascalCase(linkType.name);
    const serializerName = `get${pascalCaseDefinedType}Serializer`;
    const importFrom =
      linkType.importFrom === 'generated'
        ? 'generatedTypes'
        : linkType.importFrom;

    return {
      isEnum: false,
      strictType: pascalCaseDefinedType,
      strictImports: new ImportMap().add(importFrom, pascalCaseDefinedType),
      looseType: `${pascalCaseDefinedType}Args`,
      looseImports: new ImportMap().add(
        importFrom,
        `${pascalCaseDefinedType}Args`
      ),
      serializer: `${serializerName}()`,
      serializerImports: new ImportMap().add(importFrom, serializerName),
    };
  }

  visitEnumType(
    enumType: nodes.EnumTypeNode
  ): JavaScriptExperimentalTypeManifest {
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

    const variants = enumType.variants.map(
      (variant): JavaScriptExperimentalTypeManifest => {
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
      }
    );

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
  ): JavaScriptExperimentalTypeManifest {
    const name = pascalCase(enumEmptyVariantType.name);
    const kindAttribute = `__kind: "${name}"`;
    return {
      isEnum: false,
      strictType: `{ ${kindAttribute} }`,
      strictImports: new ImportMap(),
      looseType: `{ ${kindAttribute} }`,
      looseImports: new ImportMap(),
      serializer: `['${name}', unit()]`,
      serializerImports: new ImportMap().add('umiSerializers', 'unit'),
    };
  }

  visitEnumStructVariantType(
    enumStructVariantType: nodes.EnumStructVariantTypeNode
  ): JavaScriptExperimentalTypeManifest {
    const name = pascalCase(enumStructVariantType.name);
    const kindAttribute = `__kind: "${name}"`;
    const type = visit(enumStructVariantType.struct, this);
    return {
      ...type,
      strictType: `{ ${kindAttribute},${type.strictType.slice(1, -1)}}`,
      looseType: `{ ${kindAttribute},${type.looseType.slice(1, -1)}}`,
      serializer: `['${name}', ${type.serializer}]`,
    };
  }

  visitEnumTupleVariantType(
    enumTupleVariantType: nodes.EnumTupleVariantTypeNode
  ): JavaScriptExperimentalTypeManifest {
    const name = pascalCase(enumTupleVariantType.name);
    const kindAttribute = `__kind: "${name}"`;
    const struct = nodes.structTypeNode([
      nodes.structFieldTypeNode({
        name: 'fields',
        child: enumTupleVariantType.tuple,
      }),
    ]);
    const type = visit(struct, this);
    return {
      ...type,
      strictType: `{ ${kindAttribute},${type.strictType.slice(1, -1)}}`,
      looseType: `{ ${kindAttribute},${type.looseType.slice(1, -1)}}`,
      serializer: `['${name}', ${type.serializer}]`,
    };
  }

  visitMapType(mapType: nodes.MapTypeNode): JavaScriptExperimentalTypeManifest {
    const key = visit(mapType.key, this);
    const value = visit(mapType.value, this);
    const mergedManifest = this.mergeManifests([key, value]);
    mergedManifest.serializerImports.add('umiSerializers', 'map');
    const sizeOption = this.getArrayLikeSizeOption(
      mapType.size,
      mergedManifest
    );
    const options = sizeOption ? `, { ${sizeOption} }` : '';
    return {
      ...mergedManifest,
      strictType: `Map<${key.strictType}, ${value.strictType}>`,
      looseType: `Map<${key.looseType}, ${value.looseType}>`,
      serializer: `map(${key.serializer}, ${value.serializer}${options})`,
    };
  }

  visitOptionType(
    optionType: nodes.OptionTypeNode
  ): JavaScriptExperimentalTypeManifest {
    const childManifest = visit(optionType.child, this);
    childManifest.strictImports.add('umi', 'Option');
    childManifest.looseImports.add('umi', 'OptionOrNullable');
    childManifest.serializerImports.add('umiSerializers', 'option');
    const options: string[] = [];

    // Prefix option.
    if (
      optionType.prefix.format !== 'u8' ||
      optionType.prefix.endian !== 'le'
    ) {
      const prefixManifest = visit(optionType.prefix, this);
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
  }

  visitSetType(setType: nodes.SetTypeNode): JavaScriptExperimentalTypeManifest {
    const childManifest = visit(setType.child, this);
    childManifest.serializerImports.add('umiSerializers', 'set');
    const sizeOption = this.getArrayLikeSizeOption(setType.size, childManifest);
    const options = sizeOption ? `, { ${sizeOption} }` : '';
    return {
      ...childManifest,
      strictType: `Set<${childManifest.strictType}>`,
      looseType: `Set<${childManifest.looseType}>`,
      serializer: `set(${childManifest.serializer + options})`,
    };
  }

  visitStructType(
    structType: nodes.StructTypeNode
  ): JavaScriptExperimentalTypeManifest {
    const { parentName } = this;
    this.parentName = null;

    const fields = structType.fields.map((field) => visit(field, this));
    const mergedManifest = this.mergeManifests(fields);
    mergedManifest.serializerImports.add('umiSerializers', 'struct');
    const fieldSerializers = fields.map((field) => field.serializer).join(', ');
    const structDescription =
      parentName?.strict && !parentName.strict.match(/['"<>]/)
        ? `, { description: '${pascalCase(parentName.strict)}' }`
        : '';
    const serializerTypeParams = parentName ? parentName.strict : 'any';
    const baseManifest = {
      ...mergedManifest,
      strictType: `{ ${fields.map((field) => field.strictType).join('')} }`,
      looseType: `{ ${fields.map((field) => field.looseType).join('')} }`,
      serializer:
        `struct<${serializerTypeParams}>` +
        `([${fieldSerializers}]${structDescription})`,
    };

    const optionalFields = structType.fields.filter(
      (f) => f.defaultsTo !== null
    );
    if (optionalFields.length === 0) {
      return baseManifest;
    }

    const defaultValues = optionalFields
      .map((f) => {
        const key = camelCase(f.name);
        const defaultsTo = f.defaultsTo as NonNullable<typeof f.defaultsTo>;
        const { render: renderedValue, imports } =
          renderJavaScriptExperimentalValueNode(defaultsTo.value);
        baseManifest.serializerImports.mergeWith(imports);
        if (defaultsTo.strategy === 'omitted') {
          return `${key}: ${renderedValue}`;
        }
        return `${key}: value.${key} ?? ${renderedValue}`;
      })
      .join(', ');
    const mapSerializerTypeParams = parentName
      ? `${parentName.loose}, any, ${parentName.strict}`
      : 'any, any, any';
    const mappedSerializer =
      `mapSerializer<${mapSerializerTypeParams}>(` +
      `${baseManifest.serializer}, ` +
      `(value) => ({ ...value, ${defaultValues} }) ` +
      `)`;
    baseManifest.serializerImports.add('umiSerializers', 'mapSerializer');
    return { ...baseManifest, serializer: mappedSerializer };
  }

  visitStructFieldType(
    structFieldType: nodes.StructFieldTypeNode
  ): JavaScriptExperimentalTypeManifest {
    const name = camelCase(structFieldType.name);
    const fieldChild = visit(structFieldType.child, this);
    const docblock = this.createDocblock(structFieldType.docs);
    const baseField = {
      ...fieldChild,
      strictType: `${docblock}${name}: ${fieldChild.strictType}; `,
      looseType: `${docblock}${name}: ${fieldChild.looseType}; `,
      serializer: `['${name}', ${fieldChild.serializer}]`,
    };
    if (structFieldType.defaultsTo === null) {
      return baseField;
    }
    if (structFieldType.defaultsTo.strategy === 'optional') {
      return {
        ...baseField,
        looseType: `${docblock}${name}?: ${fieldChild.looseType}; `,
      };
    }
    return {
      ...baseField,
      looseType: '',
      looseImports: new ImportMap(),
    };
  }

  visitTupleType(
    tupleType: nodes.TupleTypeNode
  ): JavaScriptExperimentalTypeManifest {
    const children = tupleType.children.map((item) => visit(item, this));
    const mergedManifest = this.mergeManifests(children);
    mergedManifest.serializerImports.add('umiSerializers', 'tuple');
    const childrenSerializers = children
      .map((child) => child.serializer)
      .join(', ');
    return {
      ...mergedManifest,
      strictType: `[${children.map((item) => item.strictType).join(', ')}]`,
      looseType: `[${children.map((item) => item.looseType).join(', ')}]`,
      serializer: `tuple([${childrenSerializers}])`,
    };
  }

  visitBoolType(
    boolType: nodes.BoolTypeNode
  ): JavaScriptExperimentalTypeManifest {
    const looseImports = new ImportMap();
    const strictImports = new ImportMap();
    const serializerImports = new ImportMap().add('umiSerializers', 'bool');
    let sizeSerializer = '';
    if (boolType.size.format !== 'u8' || boolType.size.endian !== 'le') {
      const size = visit(boolType.size, this);
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
  }

  visitBytesType(
    bytesType: nodes.BytesTypeNode
  ): JavaScriptExperimentalTypeManifest {
    const strictImports = new ImportMap();
    const looseImports = new ImportMap();
    const serializerImports = new ImportMap().add('umiSerializers', 'bytes');
    const options: string[] = [];

    // Size option.
    if (bytesType.size.kind === 'prefixed') {
      const prefix = visit(bytesType.size.prefix, this);
      strictImports.mergeWith(prefix.strictImports);
      looseImports.mergeWith(prefix.looseImports);
      serializerImports.mergeWith(prefix.serializerImports);
      options.push(`size: ${prefix.serializer}`);
    } else if (bytesType.size.kind === 'fixed') {
      options.push(`size: ${bytesType.size.value}`);
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
  }

  visitNumberType(
    numberType: nodes.NumberTypeNode
  ): JavaScriptExperimentalTypeManifest {
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
  ): JavaScriptExperimentalTypeManifest {
    // TODO: Support number wrapper types.
    const { number } = numberWrapperType;
    return visit(number, this);
  }

  visitPublicKeyType(): JavaScriptExperimentalTypeManifest {
    const imports = new ImportMap().add(
      'solanaAddresses',
      'Base58EncodedAddress'
    );
    return {
      isEnum: false,
      strictType: fragment('Base58EncodedAddress', imports),
      looseType: fragment('Base58EncodedAddress', imports),
      encoder: fragment('getAddressEncoder()').add(
        'solanaAddresses',
        'getAddressEncoder'
      ),
      decoder: fragment('getAddressDecoder()').add(
        'solanaAddresses',
        'getAddressDecoder'
      ),
    };
  }

  visitStringType(
    stringType: nodes.StringTypeNode
  ): JavaScriptExperimentalTypeManifest {
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

  protected getArrayLikeSizeOption(
    size: SizeStrategy,
    manifest: JavaScriptExperimentalTypeManifest
  ): string | null {
    if (size.kind === 'fixed') return `size: ${size.value}`;
    if (size.kind === 'remainder') return `size: 'remainder'`;
    if (size.prefix.format === 'u32' && size.prefix.endian === 'le')
      return null;

    const prefixManifest = visit(size.prefix, this);
    manifest.strictType.imports.mergeWith(prefixManifest.strictType.imports);
    manifest.looseType.imports.mergeWith(prefixManifest.looseType.imports);
    manifest.serializerImports.mergeWith(prefixManifest.serializerImports);
    return `size: ${prefixManifest.serializer}`;
  }
}
