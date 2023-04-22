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
    return visit(account.type, this);
  }

  visitInstruction(instruction: nodes.InstructionNode): number | null {
    return visit(instruction.args, this);
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): number | null {
    if (this.visitedDefinedTypes.has(definedType.name)) {
      return this.visitedDefinedTypes.get(definedType.name)!;
    }

    this.definedTypeStack.push(definedType.name);
    const child = visit(definedType.type, this);
    this.definedTypeStack.pop();
    this.visitedDefinedTypes.set(definedType.name, child);
    return child;
  }

  visitArrayType(arrayType: nodes.ArrayTypeNode): number | null {
    if (arrayType.size.kind !== 'fixed') return null;
    const itemSize = visit(arrayType.item, this);
    const arraySize = itemSize !== null ? itemSize * arrayType.size.size : null;
    return arrayType.size.size === 0 ? 0 : arraySize;
  }

  visitDefinedLinkType(definedLinkType: nodes.LinkTypeNode): number | null {
    if (definedLinkType.size !== null) return definedLinkType.size;
    if (definedLinkType.importFrom !== 'generated') return null;

    const linkedDefinedType = this.availableDefinedTypes.get(
      definedLinkType.name
    );

    if (!linkedDefinedType) {
      throw new Error(
        `Cannot find linked defined type ${definedLinkType.name}.`
      );
    }

    // This prevents infinite recursion by using assuming
    // cyclic types don't have a fixed size.
    if (this.definedTypeStack.includes(linkedDefinedType.name)) {
      return null;
    }

    return visit(linkedDefinedType, this);
  }

  visitEnumType(enumType: nodes.EnumTypeNode): number | null {
    if (enumType.isScalarEnum()) return 1;
    const variantSizes = enumType.variants.map((v) => visit(v, this));
    const allVariantHaveTheSameFixedSize = variantSizes.every(
      (one, i, all) => one === all[0]
    );
    return allVariantHaveTheSameFixedSize &&
      variantSizes.length > 0 &&
      variantSizes[0] !== null
      ? variantSizes[0] + 1
      : null;
  }

  visitEnumEmptyVariantType(): number | null {
    return 0;
  }

  visitEnumStructVariantType(
    enumStructVariantType: nodes.EnumStructVariantTypeNode
  ): number | null {
    return visit(enumStructVariantType.struct, this);
  }

  visitEnumTupleVariantType(
    enumTupleVariantType: nodes.EnumTupleVariantTypeNode
  ): number | null {
    return visit(enumTupleVariantType.tuple, this);
  }

  visitMapType(): number | null {
    return null;
  }

  visitOptionType(optionType: nodes.OptionTypeNode): number | null {
    if (!optionType.fixed) return null;
    const prefixSize = visit(optionType.prefix, this) as number;
    const itemSize = visit(optionType.item, this);
    return itemSize !== null ? itemSize + prefixSize : null;
  }

  visitSetType(): number | null {
    return null;
  }

  visitStructType(structType: nodes.StructTypeNode): number | null {
    return this.sumSizes(structType.fields.map((f) => visit(f, this)));
  }

  visitStructFieldType(
    structFieldType: nodes.StructFieldTypeNode
  ): number | null {
    return visit(structFieldType.type, this);
  }

  visitTupleType(tupleType: nodes.TupleTypeNode): number | null {
    return this.sumSizes(tupleType.items.map((i) => visit(i, this)));
  }

  visitBoolType(boolType: nodes.BoolTypeNode): number | null {
    return visit(boolType.size, this);
  }

  visitBytesType(bytesType: nodes.BytesTypeNode): number | null {
    if (bytesType.size.kind !== 'fixed') return null;
    return bytesType.size.bytes;
  }

  visitNumberType(numberType: nodes.NumberTypeNode): number | null {
    return parseInt(numberType.format.slice(1), 10) / 8;
  }

  visitNumberWrapperType(
    numberWrapperType: nodes.NumberWrapperTypeNode
  ): number | null {
    return visit(numberWrapperType.item, this);
  }

  visitPublicKeyType(): number | null {
    return 32;
  }

  visitStringType(stringType: nodes.StringTypeNode): number | null {
    if (stringType.size.kind !== 'fixed') return null;
    return stringType.size.bytes;
  }

  protected sumSizes(sizes: (number | null)[]): number | null {
    return sizes.reduce(
      (all, one) => (all === null || one === null ? null : all + one),
      0 as number | null
    );
  }
}
