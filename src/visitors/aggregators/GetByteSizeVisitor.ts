import * as nodes from '../../nodes';
import { BaseThrowVisitor } from '../BaseThrowVisitor';

export class GetByteSizeVisitor extends BaseThrowVisitor<number | null> {
  private availableDefinedTypes = new Map<string, nodes.DefinedTypeNode>();

  private visitedDefinedTypes = new Map<string, number | null>();

  private definedTypeStack: string[] = [];

  registerDefinedTypes(definedTypes: nodes.DefinedTypeNode[]): void {
    definedTypes.forEach((definedType) => {
      this.availableDefinedTypes.set(definedType.name, definedType);
    });
  }

  visitAccount(account: nodes.AccountNode): number | null {
    return account.type.accept(this);
  }

  visitInstruction(instruction: nodes.InstructionNode): number | null {
    return instruction.args.accept(this);
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): number | null {
    if (this.visitedDefinedTypes.has(definedType.name)) {
      return this.visitedDefinedTypes.get(definedType.name)!;
    }

    this.definedTypeStack.push(definedType.name);
    const child = definedType.type.accept(this);
    this.definedTypeStack.pop();
    this.visitedDefinedTypes.set(definedType.name, child);
    return child;
  }

  visitTypeArray(typeArray: nodes.TypeArrayNode): number | null {
    const itemSize = typeArray.itemType.accept(this);
    const arraySize = itemSize !== null ? itemSize * typeArray.size : null;
    return typeArray.size === 0 ? 0 : arraySize;
  }

  visitTypeDefinedLink(
    typeDefinedLink: nodes.TypeDefinedLinkNode
  ): number | null {
    const linkedDefinedType = this.availableDefinedTypes.get(
      typeDefinedLink.definedType
    );

    if (!linkedDefinedType) {
      throw new Error(
        `Cannot find linked defined type ${typeDefinedLink.definedType}.`
      );
    }

    // This prevents infinite recursion by using assuming
    // cyclic types don't have a fixed size.
    if (this.definedTypeStack.includes(linkedDefinedType.name)) {
      return null;
    }

    return linkedDefinedType.accept(this);
  }

  visitTypeEnum(typeEnum: nodes.TypeEnumNode): number | null {
    if (typeEnum.isScalarEnum()) return 1;
    const variantSizes = typeEnum.variants.map((v) => v.accept(this));
    const allVariantHaveTheSameFixedSize = variantSizes.every(
      (one, i, all) => one === all[0]
    );
    return allVariantHaveTheSameFixedSize &&
      variantSizes.length > 0 &&
      variantSizes[0] !== null
      ? variantSizes[0] + 1
      : null;
  }

  visitTypeEnumEmptyVariant(): number | null {
    return 0;
  }

  visitTypeEnumStructVariant(
    typeEnumStructVariant: nodes.TypeEnumStructVariantNode
  ): number | null {
    return typeEnumStructVariant.struct.accept(this);
  }

  visitTypeEnumTupleVariant(
    typeEnumTupleVariant: nodes.TypeEnumTupleVariantNode
  ): number | null {
    return typeEnumTupleVariant.tuple.accept(this);
  }

  visitTypeLeaf(typeLeaf: nodes.TypeLeafNode): number | null {
    switch (typeLeaf.leaf.kind) {
      case 'number':
        return parseInt(typeLeaf.leaf.number.slice(1), 10) / 8;
      case 'bool':
        return 1;
      case 'publicKey':
        return 32;
      case 'fixedString':
        return typeLeaf.leaf.bytes;
      case 'variableString':
      case 'string':
      case 'bytes':
      default:
        return null;
    }
  }

  visitTypeLeafWrapper(
    typeLeafWrapper: nodes.TypeLeafWrapperNode
  ): number | null {
    return typeLeafWrapper.leaf.accept(this);
  }

  visitTypeMap(): number | null {
    return null;
  }

  visitTypeOption(typeOption: nodes.TypeOptionNode): number | null {
    const child = typeOption.type.accept(this);
    if (typeOption.optionType === 'option') return null;
    return child !== null ? child + 4 : null;
  }

  visitTypeSet(): number | null {
    return null;
  }

  visitTypeStruct(typeStruct: nodes.TypeStructNode): number | null {
    return this.sumSizes(typeStruct.fields.map((f) => f.accept(this)));
  }

  visitTypeStructField(
    typeStructField: nodes.TypeStructFieldNode
  ): number | null {
    return typeStructField.type.accept(this);
  }

  visitTypeTuple(typeTuple: nodes.TypeTupleNode): number | null {
    return this.sumSizes(typeTuple.itemTypes.map((i) => i.accept(this)));
  }

  visitTypeVec(): number | null {
    return null;
  }

  protected sumSizes(sizes: (number | null)[]): number | null {
    return sizes.reduce(
      (all, one) => (all === null || one === null ? null : all + one),
      0 as number | null
    );
  }
}
