import * as nodes from '../../nodes';
import { Visitor } from '../../visitors';
import { ImportMap } from './ImportMap';

export type JavaScriptTypeDefinition = {
  type: string;
  isEnum: boolean;
  imports: ImportMap;
};

export class GetJavaScriptTypeDefinitionVisitor
  implements Visitor<JavaScriptTypeDefinition>
{
  visitRoot(): JavaScriptTypeDefinition {
    throw new Error(
      'Cannot get type definition for root node. ' +
        'Please select a child node.',
    );
  }

  visitAccount(account: nodes.AccountNode): JavaScriptTypeDefinition {
    return account.type.accept(this);
  }

  visitInstruction(
    instruction: nodes.InstructionNode,
  ): JavaScriptTypeDefinition {
    return instruction.args.accept(this);
  }

  visitDefinedType(
    definedType: nodes.DefinedTypeNode,
  ): JavaScriptTypeDefinition {
    return definedType.type.accept(this);
  }

  visitTypeArray(typeArray: nodes.TypeArrayNode): JavaScriptTypeDefinition {
    const itemType = typeArray.itemType.accept(this);
    return {
      ...itemType,
      type: `Array<${itemType.type}>`,
    };
  }

  visitTypeDefinedLink(
    typeDefinedLink: nodes.TypeDefinedLinkNode,
  ): JavaScriptTypeDefinition {
    return {
      type: typeDefinedLink.definedType,
      isEnum: false,
      imports: new ImportMap().add('types', typeDefinedLink.definedType),
    };
  }

  visitTypeEnum(typeEnum: nodes.TypeEnumNode): JavaScriptTypeDefinition {
    const variantNames = typeEnum.variants.map((variant) => variant.name);

    if (typeEnum.isScalarEnum()) {
      return {
        type: `{ ${variantNames.join(', ')} }`,
        isEnum: true,
        imports: new ImportMap(),
      };
    }

    const inlinedVariants = typeEnum.variants.map(
      (variant): JavaScriptTypeDefinition => {
        const kindAttribute = `__kind: "${variant.name}"`;

        if (variant.kind === 'struct') {
          const struct = variant.type.accept(this);
          return {
            ...struct,
            type: `{ ${kindAttribute},${struct.type.slice(1, -1)}}`,
          };
        }

        if (variant.kind === 'tuple') {
          const tuple = variant.type.accept(this);
          return {
            ...tuple,
            type: `{ ${kindAttribute}, fields: ${tuple.type} }`,
          };
        }

        return {
          type: `{ ${kindAttribute} }`,
          isEnum: false,
          imports: new ImportMap(),
        };
      },
    );

    return {
      ...this.mergeTypeDefinitions(inlinedVariants),
      type: inlinedVariants.map((v) => v.type).join(' | '),
    };
  }

  visitTypeLeaf(typeLeaf: nodes.TypeLeafNode): JavaScriptTypeDefinition {
    const base: Omit<JavaScriptTypeDefinition, 'type'> = {
      isEnum: false,
      imports: new ImportMap(),
    };

    switch (typeLeaf.type) {
      case 'string':
        return { ...base, type: 'string' };
      case 'bytes':
        return { ...base, type: 'Uint8Array' };
      case 'publicKey':
        return {
          ...base,
          type: 'PublicKey',
          imports: new ImportMap().add('core', 'PublicKey'),
        };
      case 'bool':
        return { ...base, type: 'boolean' };
      case 'u64':
      case 'u128':
      case 'i64':
      case 'i128':
        return { ...base, type: 'bigint' };
      default:
        return { ...base, type: 'number' };
    }
  }

  visitTypeMap(typeMap: nodes.TypeMapNode): JavaScriptTypeDefinition {
    const key = typeMap.keyType.accept(this);
    const value = typeMap.valueType.accept(this);
    return {
      ...this.mergeTypeDefinitions([key, value]),
      type: `Map<${key.type}, ${value.type}>`,
    };
  }

  visitTypeOption(typeOption: nodes.TypeOptionNode): JavaScriptTypeDefinition {
    const child = typeOption.type.accept(this);
    return {
      ...child,
      type: `Option<${child.type}>`,
      imports: child.imports.add('core', 'Option'),
    };
  }

  visitTypeSet(typeSet: nodes.TypeSetNode): JavaScriptTypeDefinition {
    const child = typeSet.type.accept(this);
    return {
      ...child,
      type: `Set<${child.type}>`,
    };
  }

  visitTypeStruct(typeStruct: nodes.TypeStructNode): JavaScriptTypeDefinition {
    const fields = typeStruct.fields.map((field) => {
      const fieldType = field.type.accept(this);
      const docblock = this.createDocblock(field.docs);
      return {
        ...fieldType,
        type: `${docblock}${field.name}: ${fieldType.type};`,
      };
    });
    return {
      ...this.mergeTypeDefinitions(fields),
      type: `{ ${fields.map((field) => field.type).join(' ')} }`,
    };
  }

  visitTypeTuple(typeTuple: nodes.TypeTupleNode): JavaScriptTypeDefinition {
    const children = typeTuple.itemTypes.map((itemType) =>
      itemType.accept(this),
    );
    return {
      ...this.mergeTypeDefinitions(children),
      type: `[${children.map((child) => child.type).join(', ')}]`,
    };
  }

  visitTypeVec(typeVec: nodes.TypeVecNode): JavaScriptTypeDefinition {
    const itemType = typeVec.itemType.accept(this);
    return {
      ...itemType,
      type: `Array<${itemType.type}>`,
    };
  }

  protected mergeTypeDefinitions(
    typeDefinitions: JavaScriptTypeDefinition[],
  ): Omit<JavaScriptTypeDefinition, 'type'> {
    return {
      isEnum: false,
      imports: new ImportMap().mergeWith(
        ...typeDefinitions.map((td) => td.imports),
      ),
    };
  }

  protected createDocblock(docs: string[]): string {
    if (docs.length <= 0) return '';
    if (docs.length === 1) return `\n/** ${docs[0]} */\n`;
    const lines = docs.map((doc) => ` * ${doc}`);
    return `\n/**\n${lines.join('\n')}\n */\n`;
  }
}
