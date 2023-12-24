import * as nodes from '../../nodes';
import { BaseThrowVisitor } from '../BaseThrowVisitor';
import { Visitor, visit } from '../Visitor';

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
    return visit(account.data, this as Visitor<number | null>);
  }

  visitAccountData(accountData: nodes.AccountDataNode): number | null {
    return visit(accountData.struct, this as Visitor<number | null>);
  }

  visitInstruction(instruction: nodes.InstructionNode): number | null {
    return visit(instruction.dataArgs, this as Visitor<number | null>);
  }

  visitInstructionDataArgs(
    instructionDataArgs: nodes.InstructionDataArgsNode
  ): number | null {
    return visit(instructionDataArgs.struct, this as Visitor<number | null>);
  }

  visitInstructionExtraArgs(
    instructionExtraArgs: nodes.InstructionExtraArgsNode
  ): number | null {
    return visit(instructionExtraArgs.struct, this as Visitor<number | null>);
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): number | null {
    if (this.visitedDefinedTypes.has(definedType.name)) {
      return this.visitedDefinedTypes.get(definedType.name)!;
    }

    this.definedTypeStack.push(definedType.name);
    const child = visit(definedType.data, this as Visitor<number | null>);
    this.definedTypeStack.pop();
    this.visitedDefinedTypes.set(definedType.name, child);
    return child;
  }

  visitArrayType(arrayType: nodes.ArrayTypeNode): number | null {
    if (arrayType.size.kind !== 'fixed') return null;
    const fixedSize = arrayType.size.value;
    const childSize = visit(arrayType.child, this as Visitor<number | null>);
    const arraySize = childSize !== null ? childSize * fixedSize : null;
    return fixedSize === 0 ? 0 : arraySize;
  }

  visitLinkType(linkType: nodes.LinkTypeNode): number | null {
    if (linkType.size !== undefined) return linkType.size;
    if (linkType.importFrom !== 'generated') return null;

    // Fetch the linked type and return null if not found.
    // The validator visitor will throw a proper error later on.
    const linkedDefinedType = this.availableDefinedTypes.get(linkType.name);
    if (!linkedDefinedType) {
      return null;
    }

    // This prevents infinite recursion by using assuming
    // cyclic types don't have a fixed size.
    if (this.definedTypeStack.includes(linkedDefinedType.name)) {
      return null;
    }

    return visit(linkedDefinedType, this as Visitor<number | null>);
  }

  visitEnumType(enumType: nodes.EnumTypeNode): number | null {
    const prefix = visit(enumType.size, this as Visitor<number | null>) ?? 1;
    if (nodes.isScalarEnum(enumType)) return prefix;
    const variantSizes = enumType.variants.map((v) =>
      visit(v, this as Visitor<number | null>)
    );
    const allVariantHaveTheSameFixedSize = variantSizes.every(
      (one, i, all) => one === all[0]
    );
    return allVariantHaveTheSameFixedSize &&
      variantSizes.length > 0 &&
      variantSizes[0] !== null
      ? variantSizes[0] + prefix
      : null;
  }

  visitEnumEmptyVariantType(): number | null {
    return 0;
  }

  visitEnumStructVariantType(
    enumStructVariantType: nodes.EnumStructVariantTypeNode
  ): number | null {
    return visit(enumStructVariantType.struct, this as Visitor<number | null>);
  }

  visitEnumTupleVariantType(
    enumTupleVariantType: nodes.EnumTupleVariantTypeNode
  ): number | null {
    return visit(enumTupleVariantType.tuple, this as Visitor<number | null>);
  }

  visitMapType(): number | null {
    return null;
  }

  visitOptionType(optionType: nodes.OptionTypeNode): number | null {
    if (!optionType.fixed) return null;
    const prefixSize = visit(
      optionType.prefix,
      this as Visitor<number | null>
    ) as number;
    const childSize = visit(optionType.child, this as Visitor<number | null>);
    return childSize !== null ? childSize + prefixSize : null;
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
    return visit(structFieldType.child, this as Visitor<number | null>);
  }

  visitTupleType(tupleType: nodes.TupleTypeNode): number | null {
    return this.sumSizes(tupleType.children.map((child) => visit(child, this)));
  }

  visitBoolType(boolType: nodes.BoolTypeNode): number | null {
    return visit(boolType.size, this as Visitor<number | null>);
  }

  visitBytesType(bytesType: nodes.BytesTypeNode): number | null {
    if (bytesType.size.kind !== 'fixed') return null;
    return bytesType.size.value;
  }

  visitNumberType(numberType: nodes.NumberTypeNode): number | null {
    return parseInt(numberType.format.slice(1), 10) / 8;
  }

  visitAmountType(amountType: nodes.AmountTypeNode): number | null {
    return visit(amountType.number, this as Visitor<number | null>);
  }

  visitDateTimeType(dateTimeType: nodes.DateTimeTypeNode): number | null {
    return visit(dateTimeType.number, this as Visitor<number | null>);
  }

  visitSolAmountType(solAmountType: nodes.SolAmountTypeNode): number | null {
    return visit(solAmountType.number, this as Visitor<number | null>);
  }

  visitPublicKeyType(): number | null {
    return 32;
  }

  visitStringType(stringType: nodes.StringTypeNode): number | null {
    if (stringType.size.kind !== 'fixed') return null;
    return stringType.size.value;
  }

  protected sumSizes(sizes: (number | null)[]): number | null {
    return sizes.reduce(
      (all, one) => (all === null || one === null ? null : all + one),
      0 as number | null
    );
  }
}
