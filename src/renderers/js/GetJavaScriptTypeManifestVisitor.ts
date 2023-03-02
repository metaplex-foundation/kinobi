import * as nodes from '../../nodes';
import { isTypeDefinedLinkNode } from '../../nodes';
import { camelCase, pascalCase } from '../../utils';
import { Visitor } from '../../visitors';
import { JavaScriptImportMap } from './JavaScriptImportMap';
import { renderJavaScriptValueNode } from './RenderJavaScriptValueNode';

export type JavaScriptTypeManifest = {
  strictType: string;
  looseType: string;
  isEnum: boolean;
  serializer: string;
  imports: JavaScriptImportMap;
};

export class GetJavaScriptTypeManifestVisitor
  implements Visitor<JavaScriptTypeManifest>
{
  private importStrategy: 'all' | 'looseOnly' | 'strictOnly' = 'all';

  private definedName: {
    strict: string;
    loose: string;
  } | null = null;

  constructor(readonly serializerVariable = 's') {}

  setImportStrategy(
    strategy: GetJavaScriptTypeManifestVisitor['importStrategy']
  ): void {
    this.importStrategy = strategy;
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
    if (isTypeDefinedLinkNode(account.type)) {
      this.setImportStrategy('strictOnly');
    }
    const child = account.type.accept(this);
    this.setImportStrategy('all');
    this.definedName = null;
    return child;
  }

  visitInstruction(instruction: nodes.InstructionNode): JavaScriptTypeManifest {
    this.definedName = {
      strict: `${pascalCase(instruction.name)}InstructionData`,
      loose: `${pascalCase(instruction.name)}InstructionDataArgs`,
    };
    if (isTypeDefinedLinkNode(instruction.args)) {
      this.setImportStrategy('looseOnly');
    }
    const child = instruction.args.accept(this);
    this.setImportStrategy('all');
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

  visitTypeArray(typeArray: nodes.TypeArrayNode): JavaScriptTypeManifest {
    const itemManifest = typeArray.item.accept(this);
    const { imports } = itemManifest;
    const sizeOption = this.getArrayLikeSizeOption(typeArray.size, imports);
    const options = sizeOption ? `, { ${sizeOption} }` : '';
    return {
      ...itemManifest,
      imports,
      strictType: `Array<${itemManifest.strictType}>`,
      looseType: `Array<${itemManifest.looseType}>`,
      serializer: `${this.s('array')}(${itemManifest.serializer + options})`,
    };
  }

  visitTypeDefinedLink(
    typeDefinedLink: nodes.TypeDefinedLinkNode
  ): JavaScriptTypeManifest {
    const pascalCaseDefinedType = pascalCase(typeDefinedLink.name);
    const serializerName = `get${pascalCaseDefinedType}Serializer`;
    const dependency =
      typeDefinedLink.dependency === 'generated'
        ? 'generatedTypes'
        : typeDefinedLink.dependency;

    return {
      strictType: pascalCaseDefinedType,
      looseType: `${pascalCaseDefinedType}Args`,
      isEnum: false,
      serializer: `${serializerName}(context)`,
      imports: new JavaScriptImportMap().add(dependency, [
        serializerName,
        ...(this.importStrategy === 'looseOnly' ? [] : [pascalCaseDefinedType]),
        ...(this.importStrategy === 'strictOnly'
          ? []
          : [`${pascalCaseDefinedType}Args`]),
      ]),
    };
  }

  visitTypeEnum(typeEnum: nodes.TypeEnumNode): JavaScriptTypeManifest {
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
        strictType: `{ ${variantNames.join(', ')} }`,
        looseType: `{ ${variantNames.join(', ')} }`,
        isEnum: true,
        serializer:
          `${this.s('enum')}<${definedName.strict}>` +
          `(${definedName.strict}, { description: '${definedName.strict}' })`,
        imports: new JavaScriptImportMap(),
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
      imports: mergedManifest.imports.add('core', [
        'GetDataEnumKindContent',
        'GetDataEnumKind',
      ]),
    };
  }

  visitTypeEnumEmptyVariant(
    typeEnumEmptyVariant: nodes.TypeEnumEmptyVariantNode
  ): JavaScriptTypeManifest {
    const name = pascalCase(typeEnumEmptyVariant.name);
    const kindAttribute = `__kind: "${name}"`;
    return {
      strictType: `{ ${kindAttribute} }`,
      looseType: `{ ${kindAttribute} }`,
      isEnum: false,
      serializer: `['${name}', ${this.s('unit()')}]`,
      imports: new JavaScriptImportMap(),
    };
  }

  visitTypeEnumStructVariant(
    typeEnumStructVariant: nodes.TypeEnumStructVariantNode
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
    typeEnumTupleVariant: nodes.TypeEnumTupleVariantNode
  ): JavaScriptTypeManifest {
    const name = pascalCase(typeEnumTupleVariant.name);
    const kindAttribute = `__kind: "${name}"`;
    const struct = new nodes.TypeStructNode(name, [
      new nodes.TypeStructFieldNode(
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

  visitTypeMap(typeMap: nodes.TypeMapNode): JavaScriptTypeManifest {
    const key = typeMap.key.accept(this);
    const value = typeMap.value.accept(this);
    const mergedManifest = this.mergeManifests([key, value]);
    const { imports } = mergedManifest;
    const sizeOption = this.getArrayLikeSizeOption(typeMap.size, imports);
    const options = sizeOption ? `, { ${sizeOption} }` : '';
    return {
      ...mergedManifest,
      imports,
      strictType: `Map<${key.strictType}, ${value.strictType}>`,
      looseType: `Map<${key.looseType}, ${value.looseType}>`,
      serializer:
        `${this.s('map')}(` +
        `${key.serializer}, ${value.serializer}${options}` +
        `)`,
    };
  }

  visitTypeOption(typeOption: nodes.TypeOptionNode): JavaScriptTypeManifest {
    const itemManifest = typeOption.item.accept(this);
    const imports = itemManifest.imports.add('core', 'Option');
    const options: string[] = [];

    // Prefix option.
    const prefixManifest = typeOption.prefix.accept(this);
    if (prefixManifest.serializer !== this.s('u8()')) {
      imports.mergeWith(prefixManifest.imports);
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
      imports,
      strictType: `Option<${itemManifest.strictType}>`,
      looseType: `Option<${itemManifest.looseType}>`,
      serializer: this.s(
        `option(${itemManifest.serializer}${optionsAsString})`
      ),
    };
  }

  visitTypeSet(typeSet: nodes.TypeSetNode): JavaScriptTypeManifest {
    const itemManifest = typeSet.item.accept(this);
    const { imports } = itemManifest;
    const sizeOption = this.getArrayLikeSizeOption(typeSet.size, imports);
    const options = sizeOption ? `, { ${sizeOption} }` : '';
    return {
      ...itemManifest,
      imports,
      strictType: `Set<${itemManifest.strictType}>`,
      looseType: `Set<${itemManifest.looseType}>`,
      serializer: `${this.s('set')}(${itemManifest.serializer + options})`,
    };
  }

  visitTypeStruct(typeStruct: nodes.TypeStructNode): JavaScriptTypeManifest {
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
        baseManifest.imports.mergeWith(imports);
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

    return {
      ...baseManifest,
      serializer: mappedSerializer,
      imports: baseManifest.imports.add('core', 'mapSerializer'),
    };
  }

  visitTypeStructField(
    typeStructField: nodes.TypeStructFieldNode
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

  visitTypeTuple(typeTuple: nodes.TypeTupleNode): JavaScriptTypeManifest {
    const items = typeTuple.items.map((item) => item.accept(this));
    const itemSerializers = items.map((item) => item.serializer).join(', ');
    return {
      ...this.mergeManifests(items),
      strictType: `[${items.map((item) => item.strictType).join(', ')}]`,
      looseType: `[${items.map((item) => item.looseType).join(', ')}]`,
      serializer: `${this.s('tuple')}([${itemSerializers}])`,
    };
  }

  visitTypeBool(typeBool: nodes.TypeBoolNode): JavaScriptTypeManifest {
    const size = typeBool.size.accept(this);
    const sizeSerializer =
      size.serializer === this.s('u8()') ? '' : `{ size: ${size.serializer} }`;
    return {
      strictType: 'boolean',
      looseType: 'boolean',
      serializer: this.s(`bool(${sizeSerializer})`),
      isEnum: false,
      imports: size.imports,
    };
  }

  visitTypeBytes(typeBytes: nodes.TypeBytesNode): JavaScriptTypeManifest {
    const imports = new JavaScriptImportMap();
    const options: string[] = [];

    // Size option.
    if (typeBytes.size.kind === 'prefixed') {
      const prefix = typeBytes.size.prefix.accept(this);
      imports.mergeWith(prefix.imports);
      options.push(`size: ${prefix.serializer}`);
    } else if (typeBytes.size.kind === 'fixed') {
      options.push(`size: ${typeBytes.size.bytes}`);
    }

    const optionsAsString =
      options.length > 0 ? `{ ${options.join(', ')} }` : '';

    return {
      strictType: 'Uint8Array',
      looseType: 'Uint8Array',
      serializer: this.s(`bytes(${optionsAsString})`),
      isEnum: false,
      imports: new JavaScriptImportMap(),
    };
  }

  visitTypeNumber(typeNumber: nodes.TypeNumberNode): JavaScriptTypeManifest {
    const isBigNumber = ['u64', 'u128', 'i64', 'i128'].includes(
      typeNumber.format
    );
    const imports = new JavaScriptImportMap();
    let endianness = '';
    if (typeNumber.endian === 'be') {
      imports.add('core', 'Endian');
      endianness = '{ endian: Endian.Big }';
    }
    return {
      strictType: isBigNumber ? 'bigint' : 'number',
      looseType: isBigNumber ? 'number | bigint' : 'number',
      serializer: this.s(`${typeNumber.format}(${endianness})`),
      isEnum: false,
      imports: new JavaScriptImportMap(),
    };
  }

  visitTypeNumberWrapper(
    typeNumberWrapper: nodes.TypeNumberWrapperNode
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
        return {
          ...itemManifest,
          imports: itemManifest.imports.add('core', [
            'DateTime',
            'DateTimeInput',
            'mapDateTimeSerializer',
          ]),
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
        return {
          ...itemManifest,
          imports: itemManifest.imports.add('core', [
            isSolAmount ? 'SolAmount' : 'Amount',
            'mapAmountSerializer',
          ]),
          strictType: amountType,
          looseType: amountType,
          serializer: `mapAmountSerializer(${itemManifest.serializer}, ${idAndDecimals})`,
        };
      default:
        return itemManifest;
    }
  }

  visitTypePublicKey(): JavaScriptTypeManifest {
    return {
      strictType: 'PublicKey',
      looseType: 'PublicKey',
      serializer: this.s(`publicKey()`),
      isEnum: false,
      imports: new JavaScriptImportMap().add('core', 'PublicKey'),
    };
  }

  visitTypeString(typeString: nodes.TypeStringNode): JavaScriptTypeManifest {
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
        imports.mergeWith(prefix.imports);
        options.push(`size: ${prefix.serializer}`);
      }
    }

    const optionsAsString =
      options.length > 0 ? `{ ${options.join(', ')} }` : '';

    return {
      strictType: 'string',
      looseType: 'string',
      serializer: this.s(`string(${optionsAsString})`),
      isEnum: false,
      imports: new JavaScriptImportMap(),
    };
  }

  protected s(name: string): string {
    return `${this.serializerVariable}.${name}`;
  }

  protected mergeManifests(
    manifests: JavaScriptTypeManifest[]
  ): Pick<JavaScriptTypeManifest, 'imports' | 'isEnum'> {
    return {
      imports: new JavaScriptImportMap().mergeWith(
        ...manifests.map((td) => td.imports)
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
    size: nodes.TypeArrayNode['size'],
    imports: JavaScriptImportMap
  ): string | null {
    if (size.kind === 'fixed') return `size: ${size.size}`;
    if (size.kind === 'remainder') return `size: 'remainder'`;

    const prefixManifest = size.prefix.accept(this);
    if (prefixManifest.serializer === this.s('u32()')) return null;

    imports.mergeWith(prefixManifest.imports);
    return `size: ${prefixManifest.serializer}`;
  }
}
