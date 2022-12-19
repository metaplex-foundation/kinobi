import { Visitor } from '../../visitors';
import * as nodes from '../../nodes';

export type JavaScriptTypeDefinition = {
  type: string;
  isEnum: boolean;
  definedTypeImports: Set<string>;
  coreImports: Set<string>;
  inlinedTypes: string[];
};

export class GetJavaScriptTypeDefinitionVisitor
  implements Visitor<JavaScriptTypeDefinition>
{
  visitRoot(root: nodes.RootNode): JavaScriptTypeDefinition {
    return this.mergeRootTypeDefinitions([
      ...root.accounts.map((account) => account.accept(this)),
      ...root.instructions.map((ix) => ix.accept(this)),
      ...root.definedTypes.map((type) => type.accept(this)),
    ]);
  }

  visitAccount(account: nodes.AccountNode): JavaScriptTypeDefinition {
    return account.type.accept(this);
  }

  visitInstruction(
    instruction: nodes.InstructionNode,
  ): JavaScriptTypeDefinition {
    return this.mergeRootTypeDefinitions(
      instruction.args.map((arg) => arg.type.accept(this)),
    );
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
      definedTypeImports: new Set([typeDefinedLink.definedType]),
      coreImports: new Set(),
      inlinedTypes: [],
    };
  }

  visitTypeEnum(typeEnum: nodes.TypeEnumNode): JavaScriptTypeDefinition {
    const variantNames = typeEnum.variants.map((variant) => variant.name);
    const allVariantsAreEmpty = typeEnum.variants.every(
      (variant) => variant.kind === 'empty',
    );

    if (allVariantsAreEmpty) {
      return {
        type: `{ ${variantNames.join(', ')} }`,
        isEnum: true,
        definedTypeImports: new Set(),
        coreImports: new Set(),
        inlinedTypes: [],
      };
    }

    const inlinedVariants = typeEnum.variants.map(
      (variant): JavaScriptTypeDefinition => {
        const kindAttribute = `__kind: "${variant.name}"`;
        if (variant.kind === 'struct') {
          const struct = variant.type.accept(this);
          const inlinesStruct = struct.type.slice(1, -1);
          return {
            ...struct,
            type: `{ ${kindAttribute},${inlinesStruct}}`,
          };
        }
        if (variant.kind === 'tuple') {
          const fields = variant.fields.map((field) => field.accept(this));
          const fieldsAttribute = `fields: [${fields
            .map((field) => field.type)
            .join(', ')}]`;
          return {
            ...this.mergeTypeDefinitions(fields),
            type: `{ ${kindAttribute}, ${fieldsAttribute} }`,
          };
        }
        return {
          type: `{ ${kindAttribute} }`,
          isEnum: false,
          definedTypeImports: new Set(),
          coreImports: new Set(),
          inlinedTypes: [],
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
      definedTypeImports: new Set(),
      coreImports: new Set(),
      inlinedTypes: [],
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
          coreImports: new Set(['PublicKey']),
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
      coreImports: this.mergeSets([new Set(['Option']), child.coreImports]),
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
      // TODO(loris): Add comments.
      const fieldType = field.type.accept(this);
      return {
        ...fieldType,
        type: `${field.name}: ${fieldType.type}`,
      };
    });
    return {
      ...this.mergeTypeDefinitions(fields),
      type: `{ ${fields.map((field) => field.type).join(', ')} }`,
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

  protected mergeSets<T>(sets: Set<T>[]): Set<T> {
    return sets.reduce((acc, set) => {
      set.forEach((item) => {
        acc.add(item);
      });
      return acc;
    }, new Set());
  }

  protected mergeTypeDefinitions(
    typeDefinitions: JavaScriptTypeDefinition[],
  ): Omit<JavaScriptTypeDefinition, 'type'> {
    return {
      isEnum: false,
      definedTypeImports: this.mergeSets(
        typeDefinitions.map((td) => td.definedTypeImports),
      ),
      coreImports: this.mergeSets(typeDefinitions.map((td) => td.coreImports)),
      inlinedTypes: typeDefinitions.flatMap((td) => td.inlinedTypes),
    };
  }

  /**
   * For debugging purposes.
   * @deprecated
   */
  protected mergeRootTypeDefinitions(
    typeDefinitions: JavaScriptTypeDefinition[],
  ): JavaScriptTypeDefinition {
    return {
      type: '',
      isEnum: false,
      definedTypeImports: this.mergeSets(
        typeDefinitions.map((td) => td.definedTypeImports),
      ),
      coreImports: this.mergeSets(typeDefinitions.map((td) => td.coreImports)),
      inlinedTypes: typeDefinitions.flatMap((td) => [
        td.type,
        ...td.inlinedTypes,
      ]),
    };
  }
}
