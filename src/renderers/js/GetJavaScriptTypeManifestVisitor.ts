import * as nodes from '../../nodes';
import { Visitor } from '../../visitors';
import { ImportMap } from './ImportMap';

export type JavaScriptTypeManifest = {
  strictType: string;
  looseType: string;
  hasLooseType: boolean;
  isEnum: boolean;
  serializer: string;
  imports: ImportMap;
};

export class GetJavaScriptTypeManifestVisitor
  implements Visitor<JavaScriptTypeManifest>
{
  private definedName: {
    strict: string;
    loose: string;
  } | null = null;

  constructor(readonly serializerVariable = 's') {}

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
      strict: account.name,
      loose: `${account.name}Args`,
    };
    const child = account.type.accept(this);
    this.definedName = null;
    return child;
  }

  visitInstruction(instruction: nodes.InstructionNode): JavaScriptTypeManifest {
    this.definedName = {
      strict: `${instruction.name}InstructionData`,
      loose: `${instruction.name}InstructionArgs`,
    };
    const child = instruction.args.accept(this);
    this.definedName = null;
    return child;
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): JavaScriptTypeManifest {
    this.definedName = {
      strict: definedType.name,
      loose: `${definedType.name}Args`,
    };
    const child = definedType.type.accept(this);
    this.definedName = null;
    return child;
  }

  visitError(): JavaScriptTypeManifest {
    throw new Error('Cannot get type manifest for error node.');
  }

  visitTypeArray(typeArray: nodes.TypeArrayNode): JavaScriptTypeManifest {
    const itemType = typeArray.itemType.accept(this);
    return {
      ...itemType,
      strictType: `Array<${itemType.strictType}>`,
      looseType: `Array<${itemType.looseType}>`,
      serializer: `${this.s('array')}(${itemType.serializer}, ${
        typeArray.size
      })`,
    };
  }

  visitTypeDefinedLink(
    typeDefinedLink: nodes.TypeDefinedLinkNode
  ): JavaScriptTypeManifest {
    const serializerName = `get${typeDefinedLink.definedType}Serializer`;
    return {
      strictType: typeDefinedLink.definedType,
      looseType: typeDefinedLink.definedType, // TODO: Access linked loose type?
      hasLooseType: false,
      isEnum: false,
      serializer: `${serializerName}(context)`,
      imports: new ImportMap().add('types', [
        serializerName,
        typeDefinedLink.definedType,
      ]),
    };
  }

  visitTypeEnum(typeEnum: nodes.TypeEnumNode): JavaScriptTypeManifest {
    const variantNames = typeEnum.variants.map((variant) => variant.name);
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
        hasLooseType: false,
        isEnum: true,
        serializer:
          `${this.s('enum')}<${definedName.strict}>` +
          `(${definedName.strict}, '${definedName.strict}')`,
        imports: new ImportMap(),
      };
    }

    const variants = typeEnum.variants.map(
      (variant): JavaScriptTypeManifest => {
        const kindAttribute = `__kind: "${variant.name}"`;
        this.definedName = definedName
          ? {
              strict: `GetDataEnumKindContent<${definedName.strict}, '${variant.name}'>`,
              loose: `GetDataEnumKindContent<${definedName.loose}, '${variant.name}'>`,
            }
          : null;

        if (variant.kind === 'struct') {
          const type = variant.type.accept(this);
          this.definedName = null;
          return {
            ...type,
            strictType: `{ ${kindAttribute},${type.strictType.slice(1, -1)}}`,
            looseType: `{ ${kindAttribute},${type.looseType.slice(1, -1)}}`,
            serializer: `['${variant.name}', ${type.serializer}]`,
          };
        }

        if (variant.kind === 'tuple') {
          const struct = new nodes.TypeStructNode(variant.name, [
            { name: 'fields', type: variant.type, docs: [] },
          ]);
          const type = struct.accept(this);
          this.definedName = null;
          return {
            ...type,
            strictType: `{ ${kindAttribute}, fields: ${type.strictType} }`,
            looseType: `{ ${kindAttribute}, fields: ${type.looseType} }`,
            serializer: `['${variant.name}', ${type.serializer}]`,
          };
        }

        this.definedName = null;
        return {
          strictType: `{ ${kindAttribute} }`,
          looseType: `{ ${kindAttribute} }`,
          hasLooseType: false,
          isEnum: false,
          serializer: `['${variant.name}', ${this.s('unit')}]`,
          imports: new ImportMap(),
        };
      }
    );

    const mergedManifest = this.mergeManifests(variants);
    const variantSerializers = variants
      .map((variant) => variant.serializer)
      .join(', ');
    const description =
      typeEnum.name || definedName
        ? `, '${typeEnum.name || definedName?.strict}'`
        : '';
    const serializerTypeParams = definedName ? definedName.strict : 'any';

    return {
      ...mergedManifest,
      strictType: variants.map((v) => v.strictType).join(' | '),
      looseType: variants.map((v) => v.looseType).join(' | '),
      serializer:
        `${this.s('dataEnum')}<${serializerTypeParams}>` +
        `([${variantSerializers}]${description})`,
      imports: mergedManifest.imports.add('core', [
        'GetDataEnumKindContent',
        'GetDataEnumKind',
      ]),
    };
  }

  visitTypeLeaf(typeLeaf: nodes.TypeLeafNode): JavaScriptTypeManifest {
    const base = (
      strictType: string,
      looseType?: string
    ): JavaScriptTypeManifest => ({
      strictType,
      looseType: looseType ?? strictType,
      serializer: this.s(typeLeaf.type),
      hasLooseType: !!looseType,
      isEnum: false,
      imports: new ImportMap(),
    });

    switch (typeLeaf.type) {
      case 'string':
        return { ...base('string') };
      case 'bytes':
        return { ...base('Uint8Array') };
      case 'publicKey':
        return {
          ...base('PublicKey'),
          imports: new ImportMap().add('core', 'PublicKey'),
        };
      case 'bool':
        return { ...base('boolean') };
      case 'u64':
      case 'u128':
      case 'i64':
      case 'i128':
        return { ...base('bigint', 'number | bigint') };
      default:
        return { ...base('number') };
    }
  }

  visitTypeMap(typeMap: nodes.TypeMapNode): JavaScriptTypeManifest {
    const key = typeMap.keyType.accept(this);
    const value = typeMap.valueType.accept(this);
    return {
      ...this.mergeManifests([key, value]),
      strictType: `Map<${key.strictType}, ${value.strictType}>`,
      looseType: `Map<${key.looseType}, ${value.looseType}>`,
      serializer: `${this.s('map')}(${key.serializer}, ${value.serializer})`,
    };
  }

  visitTypeOption(typeOption: nodes.TypeOptionNode): JavaScriptTypeManifest {
    const child = typeOption.type.accept(this);
    return {
      ...child,
      strictType: `Option<${child.strictType}>`,
      looseType: `Option<${child.looseType}>`,
      serializer: `${this.s('option')}(${child.serializer})`,
      imports: child.imports.add('core', 'Option'),
    };
  }

  visitTypeSet(typeSet: nodes.TypeSetNode): JavaScriptTypeManifest {
    const child = typeSet.type.accept(this);
    return {
      ...child,
      strictType: `Set<${child.strictType}>`,
      looseType: `Set<${child.looseType}>`,
      serializer: `${this.s('set')}(${child.serializer})`,
    };
  }

  visitTypeStruct(typeStruct: nodes.TypeStructNode): JavaScriptTypeManifest {
    const { definedName } = this;
    this.definedName = null;

    const fields = typeStruct.fields.map((field) => {
      const fieldType = field.type.accept(this);
      const docblock = this.createDocblock(field.docs);
      return {
        ...fieldType,
        strictType: `${docblock}${field.name}: ${fieldType.strictType};`,
        looseType: `${docblock}${field.name}: ${fieldType.looseType};`,
        serializer: `['${field.name}', ${fieldType.serializer}]`,
      };
    });

    const mergedManifest = this.mergeManifests(fields);
    const fieldSerializers = fields.map((field) => field.serializer).join(', ');
    const structDescription = typeStruct.name ? `, '${typeStruct.name}'` : '';
    const serializerTypeParams = definedName ? definedName.strict : 'any';

    return {
      ...mergedManifest,
      strictType: `{ ${fields.map((field) => field.strictType).join(' ')} }`,
      looseType: `{ ${fields.map((field) => field.looseType).join(' ')} }`,
      serializer:
        `${this.s('struct')}<${serializerTypeParams}>` +
        `([${fieldSerializers}]${structDescription})`,
    };
  }

  visitTypeTuple(typeTuple: nodes.TypeTupleNode): JavaScriptTypeManifest {
    const items = typeTuple.itemTypes.map((itemType) => itemType.accept(this));
    const itemSerializers = items.map((item) => item.serializer).join(', ');
    return {
      ...this.mergeManifests(items),
      strictType: `[${items.map((item) => item.strictType).join(', ')}]`,
      looseType: `[${items.map((item) => item.looseType).join(', ')}]`,
      serializer: `${this.s('tuple')}([${itemSerializers}])`,
    };
  }

  visitTypeVec(typeVec: nodes.TypeVecNode): JavaScriptTypeManifest {
    const itemType = typeVec.itemType.accept(this);
    return {
      ...itemType,
      strictType: `Array<${itemType.strictType}>`,
      looseType: `Array<${itemType.looseType}>`,
      serializer: `${this.s('vec')}(${itemType.serializer})`,
    };
  }

  protected s(name: string): string {
    return `${this.serializerVariable}.${name}`;
  }

  protected mergeManifests(
    manifests: JavaScriptTypeManifest[]
  ): Pick<JavaScriptTypeManifest, 'imports' | 'hasLooseType' | 'isEnum'> {
    return {
      imports: new ImportMap().mergeWith(...manifests.map((td) => td.imports)),
      hasLooseType: manifests.some((td) => td.hasLooseType),
      isEnum: false,
    };
  }

  protected createDocblock(docs: string[]): string {
    if (docs.length <= 0) return '';
    if (docs.length === 1) return `\n/** ${docs[0]} */\n`;
    const lines = docs.map((doc) => ` * ${doc}`);
    return `\n/**\n${lines.join('\n')}\n */\n`;
  }
}
