import * as nodes from '../nodes';
import type { Visitor } from './Visitor';

export abstract class BaseVoidVisitor implements Visitor<void> {
  visitRoot(root: nodes.RootNode): void {
    root.programs.forEach((program) => visit(program, this));
  }

  visitProgram(program: nodes.ProgramNode): void {
    program.accounts.forEach((account) => visit(account, this));
    program.instructions.forEach((instruction) => visit(instruction, this));
    program.definedTypes.forEach((type) => visit(type, this));
    program.errors.forEach((type) => visit(type, this));
  }

  visitAccount(account: nodes.AccountNode): void {
    visit(account.type, this);
    account.variableSeeds.forEach((seed) => visit(seed.type, this));
    account.metadata.gpaFields.forEach((field) => visit(field.type, this));
  }

  visitInstruction(instruction: nodes.InstructionNode): void {
    visit(instruction.args, this);
    instruction.extraArgs?.accept(this);
    instruction.subInstructions.forEach((ix) => visit(ix, this));
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): void {
    visit(definedType.type, this);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitError(error: nodes.ErrorNode): void {
    //
  }

  visitArrayType(arrayType: nodes.ArrayTypeNode): void {
    visit(typeArray.item, this);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitDefinedLinkType(definedLinkType: nodes.LinkTypeNode): void {
    //
  }

  visitEnumType(enumType: nodes.EnumTypeNode): void {
    typeEnum.variants.forEach((variant) => visit(variant, this));
  }

  visitEnumEmptyVariantType(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    enumEmptyVariantType: nodes.EnumEmptyVariantTypeNode
  ): void {
    //
  }

  visitEnumStructVariantType(
    enumStructVariantType: nodes.EnumStructVariantTypeNode
  ): void {
    visit(typeEnumStructVariant.struct, this);
  }

  visitEnumTupleVariantType(
    enumTupleVariantType: nodes.EnumTupleVariantTypeNode
  ): void {
    visit(typeEnumTupleVariant.tuple, this);
  }

  visitMapType(mapType: nodes.MapTypeNode): void {
    visit(typeMap.key, this);
    visit(typeMap.value, this);
  }

  visitOptionType(optionType: nodes.OptionTypeNode): void {
    visit(typeOption.item, this);
  }

  visitSetType(setType: nodes.SetTypeNode): void {
    visit(typeSet.item, this);
  }

  visitStructType(structType: nodes.StructTypeNode): void {
    typeStruct.fields.forEach((field) => visit(field, this));
  }

  visitStructFieldType(structFieldType: nodes.StructFieldTypeNode): void {
    visit(typeStructField.type, this);
  }

  visitTupleType(tupleType: nodes.TupleTypeNode): void {
    typeTuple.items.forEach((item) => visit(item, this));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitBoolType(boolType: nodes.BoolTypeNode): void {
    //
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitBytesType(bytesType: nodes.BytesTypeNode): void {
    //
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitNumberType(numberType: nodes.NumberTypeNode): void {
    //
  }

  visitNumberWrapperType(numberWrapperType: nodes.NumberWrapperTypeNode): void {
    visit(typeNumberWrapper.item, this);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitPublicKeyType(publicKeyType: nodes.PublicKeyTypeNode): void {
    //
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitStringType(stringType: nodes.StringTypeNode): void {
    //
  }
}
