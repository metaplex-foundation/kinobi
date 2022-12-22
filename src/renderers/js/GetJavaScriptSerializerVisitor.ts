import * as nodes from '../../nodes';
import { Visitor } from '../../visitors';
import { ImportMap } from './ImportMap';

export type JavaScriptSerializer = {
  code: string;
  imports: ImportMap;
};

export class GetJavaScriptSerializerVisitor
  implements Visitor<JavaScriptSerializer>
{
  private definedName: string | null = null;

  constructor(readonly serializerVariable = 's') {}

  visitRoot(): JavaScriptSerializer {
    throw new Error(
      'Cannot get serializer for root node. Please select a child node.',
    );
  }

  visitProgram(): JavaScriptSerializer {
    throw new Error(
      'Cannot get serializer for program node. Please select a child node.',
    );
  }

  visitAccount(account: nodes.AccountNode): JavaScriptSerializer {
    this.definedName = account.name;
    const child = account.type.accept(this);
    this.definedName = null;
    return child;
  }

  visitInstruction(instruction: nodes.InstructionNode): JavaScriptSerializer {
    this.definedName = `${instruction.name}InstructionArgs`;
    const child = instruction.args.accept(this);
    this.definedName = null;
    return child;
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): JavaScriptSerializer {
    this.definedName = definedType.name;
    const child = definedType.type.accept(this);
    this.definedName = null;
    return child;
  }

  visitError(): JavaScriptSerializer {
    throw new Error('Cannot get serializer for error node.');
  }

  visitTypeArray(typeArray: nodes.TypeArrayNode): JavaScriptSerializer {
    const itemType = typeArray.itemType.accept(this);
    return {
      ...itemType,
      code: `${this.s('array')}(${itemType.code}, ${typeArray.size})`,
    };
  }

  visitTypeDefinedLink(
    typeDefinedLink: nodes.TypeDefinedLinkNode,
  ): JavaScriptSerializer {
    const serializerName = `get${typeDefinedLink.definedType}Serializer`;
    return {
      code: `${serializerName}(context)`,
      imports: new ImportMap().add('types', serializerName),
    };
  }

  visitTypeEnum(typeEnum: nodes.TypeEnumNode): JavaScriptSerializer {
    const { definedName } = this;
    this.definedName = null;

    if (typeEnum.isScalarEnum()) {
      if (definedName === null) {
        throw new Error(
          'Scalar enums cannot be inlined and must be introduced ' +
            'via a defined type. Ensure you are not inlining a ' +
            ' defined type that is a scalar enum through a visitor.',
        );
      }
      return {
        code:
          `${this.s('enum')}<${definedName}>` +
          `(${definedName}, '${definedName}')`,
        imports: new ImportMap(),
      };
    }

    const variants = typeEnum.variants.map((variant): JavaScriptSerializer => {
      this.definedName = definedName
        ? `Omit<${definedName} & { __kind: '${variant.name}' }, '__kind'>`
        : null;

      if (variant.kind === 'struct') {
        const type = variant.type.accept(this);
        this.definedName = null;
        return {
          ...type,
          code: `['${variant.name}', ${type.code}]`,
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
          code: `['${variant.name}', ${type.code}]`,
        };
      }

      this.definedName = null;
      return {
        imports: new ImportMap(),
        code: `['${variant.name}']`,
      };
    });

    const variantCodes = variants.map((variant) => variant.code).join(', ');
    const description =
      typeEnum.name || definedName ? `, '${typeEnum.name || definedName}'` : '';

    return {
      ...this.mergeSerializers(variants),
      code:
        `${this.s('dataEnum')}<${definedName || 'any'}>` +
        `([${variantCodes}]${description})`,
    };
  }

  visitTypeLeaf(typeLeaf: nodes.TypeLeafNode): JavaScriptSerializer {
    switch (typeLeaf.type) {
      case 'publicKey':
        return {
          imports: new ImportMap(),
          code: `${this.s('publicKey')}(context)`,
        };
      default:
        return { imports: new ImportMap(), code: this.s(typeLeaf.type) };
    }
  }

  visitTypeMap(typeMap: nodes.TypeMapNode): JavaScriptSerializer {
    const key = typeMap.keyType.accept(this);
    const value = typeMap.valueType.accept(this);
    return {
      ...this.mergeSerializers([key, value]),
      code: `${this.s('map')}(${key.code}, ${value.code})`,
    };
  }

  visitTypeOption(typeOption: nodes.TypeOptionNode): JavaScriptSerializer {
    const child = typeOption.type.accept(this);
    return {
      ...child,
      code: `${this.s('option')}(${child.code})`,
    };
  }

  visitTypeSet(typeSet: nodes.TypeSetNode): JavaScriptSerializer {
    const child = typeSet.type.accept(this);
    return {
      ...child,
      code: `${this.s('set')}(${child.code})`,
    };
  }

  visitTypeStruct(typeStruct: nodes.TypeStructNode): JavaScriptSerializer {
    const { definedName } = this;
    this.definedName = null;

    const fields = typeStruct.fields.map((field) => {
      const fieldType = field.type.accept(this);
      return {
        ...fieldType,
        code: `['${field.name}', ${fieldType.code}]`,
      };
    });

    const fieldCodes = fields.map((field) => field.code).join(', ');
    const structDescription = typeStruct.name ? `, '${typeStruct.name}'` : '';

    return {
      ...this.mergeSerializers(fields),
      code:
        `${this.s('struct')}<${definedName || 'any'}>` +
        `([${fieldCodes}]${structDescription})`,
    };
  }

  visitTypeTuple(typeTuple: nodes.TypeTupleNode): JavaScriptSerializer {
    const items = typeTuple.itemTypes.map((itemType) => itemType.accept(this));
    const itemCodes = items.map((item) => item.code).join(', ');
    return {
      ...this.mergeSerializers(items),
      code: `${this.s('tuple')}([${itemCodes}])`,
    };
  }

  visitTypeVec(typeVec: nodes.TypeVecNode): JavaScriptSerializer {
    const itemType = typeVec.itemType.accept(this);
    return {
      ...itemType,
      code: `${this.s('vec')}(${itemType.code})`,
    };
  }

  protected mergeSerializers(
    typeDefinitions: JavaScriptSerializer[],
  ): Omit<JavaScriptSerializer, 'code'> {
    return {
      imports: new ImportMap().mergeWith(
        ...typeDefinitions.map((td) => td.imports),
      ),
    };
  }

  protected s(name: string): string {
    return `${this.serializerVariable}.${name}`;
  }
}
