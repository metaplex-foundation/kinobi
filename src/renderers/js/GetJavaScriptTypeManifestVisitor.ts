import * as nodes from '../../nodes';
import { camelCase, pascalCase } from '../../shared';
import { Visitor } from '../../visitors';
import { JavaScriptImportMap } from './JavaScriptImportMap';
import { renderJavaScriptValueNode } from './RenderJavaScriptValueNode';

export type JavaScriptTypeManifest = {
  isEnum: boolean;
  strictType: string;
  strictImports: JavaScriptImportMap;
  looseType: string;
  looseImports: JavaScriptImportMap;
  serializer: string;
  serializerImports: JavaScriptImportMap;
};

export class GetJavaScriptTypeManifestVisitor
  implements Visitor<JavaScriptTypeManifest>
{
  private definedName: {
    strict: string;
    loose: string;
  } | null = null;

  constructor(readonly serializerVariable = 's') {}

  setDefinedName(
    definedName: GetJavaScriptTypeManifestVisitor['definedName']
  ): void {
    this.definedName = definedName;
  }

  visitRoot(): JavaScriptTypeManifest {
    throw new Error(
      'Cannot get type manifest for root node. Please select a child node.'
    );
  }

  visitProgram(): JavaScriptTypeManifest {
    throw new Error(
      'Cannot get type manifest for program node. Please select a child node.'
    );
  }

  visitAccount(account: nodes.AccountNode): JavaScriptTypeManifest {
    this.definedName = {
      strict: `${pascalCase(account.name)}AccountData`,
      loose: `${pascalCase(account.name)}AccountDataArgs`,
    };
    const child = account.type.accept(this);
    this.definedName = null;
    return child;
  }

  visitInstruction(instruction: nodes.InstructionNode): JavaScriptTypeManifest {
    this.definedName = {
      strict: `${pascalCase(instruction.name)}InstructionData`,
      loose: `${pascalCase(instruction.name)}InstructionDataArgs`,
    };
    const child = instruction.args.accept(this);
    this.definedName = null;
    return child;
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): JavaScriptTypeManifest {
    this.definedName = {
      strict: pascalCase(definedType.name),
      loose: `${pascalCase(definedType.name)}Args`,
    };
    const child = definedType.type.accept(this);
    this.definedName = null;
    return child;
  }

  visitError(): JavaScriptTypeManifest {
    throw new Error('Cannot get type manifest for error node.');
  }

  visitTypeArray(typeArray: nodes.ArrayTypeNode): JavaScriptTypeManifest {
    const itemManifest = typeArray.item.accept(this);
    const sizeOption = this.getArrayLikeSizeOption(
      typeArray.size,
      itemManifest
    );
    const options = sizeOption ? `, { ${sizeOption} }` : '';
    return {
      ...itemManifest,
      strictType: `Array<${itemManifest.strictType}>`,
      looseType: `Array<${itemManifest.looseType}>`,
      serializer: `${this.s('array')}(${itemManifest.serializer + options})`,
    };
  }

  visitTypeDefinedLink(
    typeDefinedLink: nodes.LinkTypeNode
  ): JavaScriptTypeManifest {
    const pascalCaseDefinedType = pascalCase(typeDefinedLink.name);
    const serializerName = `get${pascalCaseDefinedType}Serializer`;
    const importFrom =
      typeDefinedLink.importFrom === 'generated'
        ? 'generatedTypes'
        : typeDefinedLink.importFrom;

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
      serializer: `${serializerName}(context)`,
      serializerImports: new JavaScriptImportMap().add(
        importFrom,
        serializerName
      ),
    };
  }

  visitTypeEnum(typeEnum: nodes.EnumTypeNode): JavaScriptTypeManifest {
    const variantNames = typeEnum.variants.map((variant) =>
      pascalCase(variant.name)
    );
    const { definedName } = this;
    this.definedName = null;

    if (typeEnum.isScalarEnum()) {
      if (definedName === null) {
        throw new Error(
          'Scalar enums cannot be inlined and must be introduced ' +
            'via a defined type. Ensure you are not inlining a ' +
            'defined type that is a scalar enum through a visitor.'
        );
      }
      return {
        isEnum: true,
        strictType: `{ ${variantNames.join(', ')} }`,
        strictImports: new JavaScriptImportMap(),
        looseType: `{ ${variantNames.join(', ')} }`,
        looseImports: new JavaScriptImportMap(),
        serializer:
          `${this.s('enum')}<${definedName.strict}>` +
          `(${definedName.strict}, { description: '${definedName.strict}' })`,
        serializerImports: new JavaScriptImportMap(),
      };
    }

    const variants = typeEnum.variants.map(
      (variant): JavaScriptTypeManifest => {
        const variantName = pascalCase(variant.name);
        this.definedName = definedName
          ? {
              strict: `GetDataEnumKindContent<${definedName.strict}, '${variantName}'>`,
              loose: `GetDataEnumKindContent<${definedName.loose}, '${variantName}'>`,
            }
          : null;
        const variantManifest = variant.accept(this);
        this.definedName = null;
        return variantManifest;
      }
    );

    const mergedManifest = this.mergeManifests(variants);
    const variantSerializers = variants
      .map((variant) => variant.serializer)
      .join(', ');
    const description = typeEnum.name || definedName?.strict;
    const descriptionArgs = description
      ? `, { description: '${pascalCase(description)}' }`
      : '';
    const serializerTypeParams = definedName ? definedName.strict : 'any';

    return {
      ...mergedManifest,
      strictType: variants.map((v) => v.strictType).join(' | '),
      looseType: variants.map((v) => v.looseType).join(' | '),
      serializer:
        `${this.s('dataEnum')}<${serializerTypeParams}>` +
        `([${variantSerializers}]${descriptionArgs})`,
      serializerImports: mergedManifest.serializerImports.add('core', [
        'GetDataEnumKindContent',
        'GetDataEnumKind',
      ]),
    };
  }

  visitTypeEnumEmptyVariant(
    typeEnumEmptyVariant: nodes.EnumEmptyVariantTypeNode
  ): JavaScriptTypeManifest {
    const name = pascalCase(typeEnumEmptyVariant.name);
    const kindAttribute = `__kind: "${name}"`;
    return {
      isEnum: false,
      strictType: `{ ${kindAttribute} }`,
      strictImports: new JavaScriptImportMap(),
      looseType: `{ ${kindAttribute} }`,
      looseImports: new JavaScriptImportMap(),
      serializer: `['${name}', ${this.s('unit()')}]`,
      serializerImports: new JavaScriptImportMap(),
    };
  }

  visitTypeEnumStructVariant(
    typeEnumStructVariant: nodes.EnumStructVariantTypeNode
  ): JavaScriptTypeManifest {
    const name = pascalCase(typeEnumStructVariant.name);
    const kindAttribute = `__kind: "${name}"`;
    const type = typeEnumStructVariant.struct.accept(this);
    return {
      ...type,
      strictType: `{ ${kindAttribute},${type.strictType.slice(1, -1)}}`,
      looseType: `{ ${kindAttribute},${type.looseType.slice(1, -1)}}`,
      serializer: `['${name}', ${type.serializer}]`,
    };
  }

  visitTypeEnumTupleVariant(
    typeEnumTupleVariant: nodes.EnumTupleVariantTypeNode
  ): JavaScriptTypeManifest {
    const name = pascalCase(typeEnumTupleVariant.name);
    const kindAttribute = `__kind: "${name}"`;
    const struct = nodes.structTypeNode(name, [
      nodes.structFieldTypeNode(
        { name: 'fields', docs: [], defaultsTo: null },
        typeEnumTupleVariant.tuple
      ),
    ]);
    const type = struct.accept(this);
    return {
      ...type,
      strictType: `{ ${kindAttribute},${type.strictType.slice(1, -1)}}`,
      looseType: `{ ${kindAttribute},${type.looseType.slice(1, -1)}}`,
      serializer: `['${name}', ${type.serializer}]`,
    };
  }

  visitTypeMap(typeMap: nodes.MapTypeNode): JavaScriptTypeManifest {
    const key = typeMap.key.accept(this);
    const value = typeMap.value.accept(this);
    const mergedManifest = this.mergeManifests([key, value]);
    const sizeOption = this.getArrayLikeSizeOption(
      typeMap.size,
      mergedManifest
    );
    const options = sizeOption ? `, { ${sizeOption} }` : '';
    return {
      ...mergedManifest,
      strictType: `Map<${key.strictType}, ${value.strictType}>`,
      looseType: `Map<${key.looseType}, ${value.looseType}>`,
      serializer:
        `${this.s('map')}(` +
        `${key.serializer}, ${value.serializer}${options}` +
        `)`,
    };
  }

  visitTypeOption(typeOption: nodes.OptionTypeNode): JavaScriptTypeManifest {
    const itemManifest = typeOption.item.accept(this);
    itemManifest.strictImports.add('core', 'Option');
    itemManifest.looseImports.add('core', 'Option');
    const options: string[] = [];

    // Prefix option.
    const prefixManifest = typeOption.prefix.accept(this);
    if (prefixManifest.serializer !== this.s('u8()')) {
      options.push(`prefix: ${prefixManifest.serializer}`);
    }

    // Fixed option.
    if (typeOption.fixed) {
      options.push(`fixed: true`);
    }

    const optionsAsString =
      options.length > 0 ? `, { ${options.join(', ')} }` : '';

    return {
      ...itemManifest,
      strictType: `Option<${itemManifest.strictType}>`,
      looseType: `Option<${itemManifest.looseType}>`,
      serializer: this.s(
        `option(${itemManifest.serializer}${optionsAsString})`
      ),
    };
  }

  visitTypeSet(typeSet: nodes.SetTypeNode): JavaScriptTypeManifest {
    const itemManifest = typeSet.item.accept(this);
    const sizeOption = this.getArrayLikeSizeOption(typeSet.size, itemManifest);
    const options = sizeOption ? `, { ${sizeOption} }` : '';
    return {
      ...itemManifest,
      strictType: `Set<${itemManifest.strictType}>`,
      looseType: `Set<${itemManifest.looseType}>`,
      serializer: `${this.s('set')}(${itemManifest.serializer + options})`,
    };
  }

  visitTypeStruct(typeStruct: nodes.StructTypeNode): JavaScriptTypeManifest {
    const { definedName } = this;
    this.definedName = null;

    const fields = typeStruct.fields.map((field) => field.accept(this));
    const mergedManifest = this.mergeManifests(fields);
    const fieldSerializers = fields.map((field) => field.serializer).join(', ');
    const structDescription = typeStruct.name
      ? `, { description: '${pascalCase(typeStruct.name)}' }`
      : '';
    const serializerTypeParams = definedName ? definedName.strict : 'any';
    const baseManifest = {
      ...mergedManifest,
      strictType: `{ ${fields.map((field) => field.strictType).join('')} }`,
      looseType: `{ ${fields.map((field) => field.looseType).join('')} }`,
      serializer:
        `${this.s('struct')}<${serializerTypeParams}>` +
        `([${fieldSerializers}]${structDescription})`,
    };

    const optionalFields = typeStruct.fields.filter(
      (f) => f.metadata.defaultsTo !== null
    );
    if (optionalFields.length === 0) {
      return baseManifest;
    }

    const defaultValues = optionalFields
      .map((f) => {
        const key = camelCase(f.name);
        const defaultsTo = f.metadata.defaultsTo as NonNullable<
          typeof f.metadata.defaultsTo
        >;
        const { render: renderedValue, imports } = renderJavaScriptValueNode(
          defaultsTo.value
        );
        baseManifest.serializerImports.mergeWith(imports);
        if (defaultsTo.strategy === 'omitted') {
          return `${key}: ${renderedValue}`;
        }
        return `${key}: value.${key} ?? ${renderedValue}`;
      })
      .join(', ');
    const mapSerializerTypeParams = definedName
      ? `${definedName.loose}, ${definedName.strict}, ${definedName.strict}`
      : 'any, any, any';
    const asReturnType = definedName ? ` as ${definedName.strict}` : '';
    const mappedSerializer =
      `mapSerializer<${mapSerializerTypeParams}>(` +
      `${baseManifest.serializer}, ` +
      `(value) => ({ ...value, ${defaultValues} }${asReturnType}) ` +
      `)`;
    baseManifest.serializerImports.add('core', 'mapSerializer');
    return { ...baseManifest, serializer: mappedSerializer };
  }

  visitTypeStructField(
    typeStructField: nodes.StructFieldTypeNode
  ): JavaScriptTypeManifest {
    const { metadata } = typeStructField;
    const name = camelCase(typeStructField.name);
    const fieldType = typeStructField.type.accept(this);
    const docblock = this.createDocblock(metadata.docs);
    const baseField = {
      ...fieldType,
      strictType: `${docblock}${name}: ${fieldType.strictType}; `,
      looseType: `${docblock}${name}: ${fieldType.looseType}; `,
      serializer: `['${name}', ${fieldType.serializer}]`,
    };
    if (metadata.defaultsTo === null) {
      return baseField;
    }
    if (metadata.defaultsTo.strategy === 'optional') {
      return {
        ...baseField,
        looseType: `${docblock}${name}?: ${fieldType.looseType}; `,
      };
    }
    return { ...baseField, looseType: '' };
  }

  visitTypeTuple(typeTuple: nodes.TupleTypeNode): JavaScriptTypeManifest {
    const items = typeTuple.items.map((item) => item.accept(this));
    const itemSerializers = items.map((item) => item.serializer).join(', ');
    return {
      ...this.mergeManifests(items),
      strictType: `[${items.map((item) => item.strictType).join(', ')}]`,
      looseType: `[${items.map((item) => item.looseType).join(', ')}]`,
      serializer: `${this.s('tuple')}([${itemSerializers}])`,
    };
  }

  visitTypeBool(typeBool: nodes.BoolTypeNode): JavaScriptTypeManifest {
    const size = typeBool.size.accept(this);
    const sizeSerializer =
      size.serializer === this.s('u8()') ? '' : `{ size: ${size.serializer} }`;
    return {
      ...size,
      isEnum: false,
      strictType: 'boolean',
      looseType: 'boolean',
      serializer: this.s(`bool(${sizeSerializer})`),
    };
  }

  visitTypeBytes(typeBytes: nodes.BytesTypeNode): JavaScriptTypeManifest {
    const options: string[] = [];

    // Size option.
    if (typeBytes.size.kind === 'prefixed') {
      const prefix = typeBytes.size.prefix.accept(this);
      options.push(`size: ${prefix.serializer}`);
    } else if (typeBytes.size.kind === 'fixed') {
      options.push(`size: ${typeBytes.size.bytes}`);
    }

    const optionsAsString =
      options.length > 0 ? `{ ${options.join(', ')} }` : '';

    return {
      isEnum: false,
      strictType: 'Uint8Array',
      strictImports: new JavaScriptImportMap(),
      looseType: 'Uint8Array',
      looseImports: new JavaScriptImportMap(),
      serializer: this.s(`bytes(${optionsAsString})`),
      serializerImports: new JavaScriptImportMap(),
    };
  }

  visitTypeNumber(typeNumber: nodes.NumberTypeNode): JavaScriptTypeManifest {
    const isBigNumber = ['u64', 'u128', 'i64', 'i128'].includes(
      typeNumber.format
    );
    const serializerImports = new JavaScriptImportMap();
    let endianness = '';
    if (typeNumber.endian === 'be') {
      serializerImports.add('core', 'Endian');
      endianness = '{ endian: Endian.Big }';
    }
    return {
      isEnum: false,
      strictType: isBigNumber ? 'bigint' : 'number',
      strictImports: new JavaScriptImportMap(),
      looseType: isBigNumber ? 'number | bigint' : 'number',
      looseImports: new JavaScriptImportMap(),
      serializer: this.s(`${typeNumber.format}(${endianness})`),
      serializerImports,
    };
  }

  visitTypeNumberWrapper(
    typeNumberWrapper: nodes.NumberWrapperTypeNode
  ): JavaScriptTypeManifest {
    const { item, wrapper } = typeNumberWrapper;
    const itemManifest = item.accept(this);
    switch (wrapper.kind) {
      case 'DateTime':
        if (!item.isInteger()) {
          throw new Error(
            `DateTime wrappers can only be applied to integer ` +
              `types. Got type [${item.toString()}].`
          );
        }
        itemManifest.strictImports.add('core', 'DateTime');
        itemManifest.looseImports.add('core', 'DateTimeInput');
        itemManifest.serializerImports.add('core', 'mapDateTimeSerializer');
        return {
          ...itemManifest,
          strictType: `DateTime`,
          looseType: `DateTimeInput`,
          serializer: `mapDateTimeSerializer(${itemManifest.serializer})`,
        };
      case 'Amount':
      case 'SolAmount':
        if (!item.isUnsignedInteger()) {
          throw new Error(
            `Amount wrappers can only be applied to unsigned ` +
              `integer types. Got type [${item.toString()}].`
          );
        }
        const identifier =
          wrapper.kind === 'SolAmount' ? 'SOL' : wrapper.identifier;
        const decimals = wrapper.kind === 'SolAmount' ? 9 : wrapper.decimals;
        const idAndDecimals = `'${identifier}', ${decimals}`;
        const isSolAmount = identifier === 'SOL' && decimals === 9;
        const amountType = isSolAmount
          ? 'SolAmount'
          : `Amount<${idAndDecimals}>`;
        const amountImport = isSolAmount ? 'SolAmount' : 'Amount';
        itemManifest.strictImports.add('core', amountImport);
        itemManifest.looseImports.add('core', amountImport);
        itemManifest.serializerImports.add('core', 'mapAmountSerializer');
        return {
          ...itemManifest,
          strictType: amountType,
          looseType: amountType,
          serializer: `mapAmountSerializer(${itemManifest.serializer}, ${idAndDecimals})`,
        };
      default:
        return itemManifest;
    }
  }

  visitTypePublicKey(): JavaScriptTypeManifest {
    const imports = new JavaScriptImportMap().add('core', 'PublicKey');
    return {
      isEnum: false,
      strictType: 'PublicKey',
      strictImports: imports,
      looseType: 'PublicKey',
      looseImports: imports,
      serializer: this.s(`publicKey()`),
      serializerImports: new JavaScriptImportMap(),
    };
  }

  visitTypeString(typeString: nodes.StringTypeNode): JavaScriptTypeManifest {
    const imports = new JavaScriptImportMap();
    const options: string[] = [];

    // Encoding option.
    if (typeString.encoding !== 'utf8') {
      imports.add('core', typeString.encoding);
      options.push(`encoding: ${typeString.encoding}`);
    }

    // Size option.
    if (typeString.size.kind === 'variable') {
      options.push(`size: 'variable'`);
    } else if (typeString.size.kind === 'fixed') {
      options.push(`size: ${typeString.size.bytes}`);
    } else {
      const prefix = typeString.size.prefix.accept(this);
      if (prefix.serializer !== this.s('u32()')) {
        imports.mergeWith(prefix.strictImports);
        options.push(`size: ${prefix.serializer}`);
      }
    }

    const optionsAsString =
      options.length > 0 ? `{ ${options.join(', ')} }` : '';

    return {
      isEnum: false,
      strictType: 'string',
      strictImports: imports,
      looseType: 'string',
      looseImports: imports,
      serializer: this.s(`string(${optionsAsString})`),
      serializerImports: new JavaScriptImportMap(),
    };
  }

  protected s(name: string): string {
    return `${this.serializerVariable}.${name}`;
  }

  protected mergeManifests(
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

  protected createDocblock(docs: string[]): string {
    if (docs.length <= 0) return '';
    if (docs.length === 1) return `\n/** ${docs[0]} */\n`;
    const lines = docs.map((doc) => ` * ${doc}`);
    return `\n/**\n${lines.join('\n')}\n */\n`;
  }

  protected getArrayLikeSizeOption(
    size: nodes.ArrayTypeNode['size'],
    manifest: Pick<
      JavaScriptTypeManifest,
      'strictImports' | 'looseImports' | 'serializerImports'
    >
  ): string | null {
    if (size.kind === 'fixed') return `size: ${size.size}`;
    if (size.kind === 'remainder') return `size: 'remainder'`;

    const prefixManifest = size.prefix.accept(this);
    if (prefixManifest.serializer === this.s('u32()')) return null;

    manifest.strictImports.mergeWith(prefixManifest.strictImports);
    manifest.looseImports.mergeWith(prefixManifest.looseImports);
    manifest.serializerImports.mergeWith(prefixManifest.serializerImports);
    return `size: ${prefixManifest.serializer}`;
  }
}
