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
  constructor(readonly serializerVariable = 's') {}

  visitRoot(): JavaScriptSerializer {
    throw new Error(
      'Cannot get serializer for root node. Please select a child node.',
    );
  }

  visitAccount(account: nodes.AccountNode): JavaScriptSerializer {
    return account.type.accept(this);
  }

  visitInstruction(instruction: nodes.InstructionNode): JavaScriptSerializer {
    return instruction.args.accept(this);
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): JavaScriptSerializer {
    return definedType.type.accept(this);
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
    if (typeEnum.isScalarEnum()) {
      return {
        code: `${this.s('enum')}<${typeEnum.name}>(${typeEnum.name})`,
        imports: new ImportMap().add('types', typeEnum.name),
      };
    }

    const variants = typeEnum.variants.map((variant): JavaScriptSerializer => {
      if (variant.kind === 'struct') {
        const type = variant.type.accept(this);
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
        return {
          ...type,
          code: `['${variant.name}', ${type.code}]`,
        };
      }

      return {
        imports: new ImportMap(),
        code: `['${variant.name}']`,
      };
    });

    const variantCodes = variants.map((variant) => variant.code).join(', ');
    const { imports } = this.mergeSerializers(variants);
    imports.add('types', typeEnum.name);

    return {
      imports,
      code: `${this.s('dataEnum')}<${typeEnum.name}>([${variantCodes}])`,
    };
  }

  visitTypeLeaf(typeLeaf: nodes.TypeLeafNode): JavaScriptSerializer {
    switch (typeLeaf.type) {
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
    const fields = typeStruct.fields.map((field) => {
      const fieldType = field.type.accept(this);
      return {
        ...fieldType,
        code: `['${field.name}', ${fieldType.code}]`,
      };
    });
    const fieldCodes = fields.map((field) => field.code).join(', ');
    const structType = typeStruct.name ? `<${typeStruct.name}>` : '';
    const structDescription = typeStruct.name ? `, '${typeStruct.name}'` : '';
    const { imports } = this.mergeSerializers(fields);
    if (typeStruct.name) imports.add('types', typeStruct.name);
    return {
      imports,
      code:
        `${this.s('struct')}${structType}` +
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
