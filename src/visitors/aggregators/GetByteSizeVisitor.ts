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

  visitTypeArray(typeArray: nodes.ArrayTypeNode): number | null {
    if (typeArray.size.kind !== 'fixed') return null;
    const itemSize = typeArray.item.accept(this);
    const arraySize = itemSize !== null ? itemSize * typeArray.size.size : null;
    return typeArray.size.size === 0 ? 0 : arraySize;
  }

  visitTypeDefinedLink(
    typeDefinedLink: nodes.DefinedLinkTypeNode
  ): number | null {
    if (typeDefinedLink.size !== null) return typeDefinedLink.size;
    if (typeDefinedLink.importFrom !== 'generated') return null;

    const linkedDefinedType = this.availableDefinedTypes.get(
      typeDefinedLink.name
    );

    if (!linkedDefinedType) {
      throw new Error(
        `Cannot find linked defined type ${typeDefinedLink.name}.`
      );
    }

    // This prevents infinite recursion by using assuming
    // cyclic types don't have a fixed size.
    if (this.definedTypeStack.includes(linkedDefinedType.name)) {
      return null;
    }

    return linkedDefinedType.accept(this);
  }

  visitTypeEnum(typeEnum: nodes.EnumTypeNode): number | null {
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
    typeEnumStructVariant: nodes.EnumStructVariantTypeNode
  ): number | null {
    return typeEnumStructVariant.struct.accept(this);
  }

  visitTypeEnumTupleVariant(
    typeEnumTupleVariant: nodes.EnumTupleVariantTypeNode
  ): number | null {
    return typeEnumTupleVariant.tuple.accept(this);
  }

  visitTypeMap(): number | null {
    return null;
  }

  visitTypeOption(typeOption: nodes.OptionTypeNode): number | null {
    if (!typeOption.fixed) return null;
    const prefixSize = typeOption.prefix.accept(this) as number;
    const itemSize = typeOption.item.accept(this);
    return itemSize !== null ? itemSize + prefixSize : null;
  }

  visitTypeSet(): number | null {
    return null;
  }

  visitTypeStruct(typeStruct: nodes.StructTypeNode): number | null {
    return this.sumSizes(typeStruct.fields.map((f) => f.accept(this)));
  }

  visitTypeStructField(
    typeStructField: nodes.StructFieldTypeNode
  ): number | null {
    return typeStructField.type.accept(this);
  }

  visitTypeTuple(typeTuple: nodes.TupleTypeNode): number | null {
    return this.sumSizes(typeTuple.items.map((i) => i.accept(this)));
  }

  visitTypeBool(typeBool: nodes.BoolTypeNode): number | null {
    return typeBool.size.accept(this);
  }

  visitTypeBytes(typeBytes: nodes.BytesTypeNode): number | null {
    if (typeBytes.size.kind !== 'fixed') return null;
    return typeBytes.size.bytes;
  }

  visitTypeNumber(typeNumber: nodes.NumberTypeNode): number | null {
    return parseInt(typeNumber.format.slice(1), 10) / 8;
  }

  visitTypeNumberWrapper(
    typeNumberWrapper: nodes.NumberWrapperTypeNode
  ): number | null {
    return typeNumberWrapper.item.accept(this);
  }

  visitTypePublicKey(): number | null {
    return 32;
  }

  visitTypeString(typeString: nodes.StringTypeNode): number | null {
    if (typeString.size.kind !== 'fixed') return null;
    return typeString.size.bytes;
  }

  protected sumSizes(sizes: (number | null)[]): number | null {
    return sizes.reduce(
      (all, one) => (all === null || one === null ? null : all + one),
      0 as number | null
    );
  }
}
