import * as nodes from '../nodes';
import { Visitor, visit } from './visitor2';

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
    visit(account.data, this);
    account.seeds.forEach((seed) => {
      if (seed.kind !== 'variable') return;
      visit(seed.type, this);
    });
  }

  visitAccountData(accountData: nodes.AccountDataNode): void {
    visit(accountData.struct, this);
    if (accountData.link) visit(accountData.link, this);
  }

  visitInstruction(instruction: nodes.InstructionNode): void {
    visit(instruction.dataArgs, this);
    visit(instruction.extraArgs, this);
    instruction.accounts.forEach((account) => visit(account, this));
    instruction.subInstructions.forEach((ix) => visit(ix, this));
  }

  visitInstructionAccount(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    instructionAccount: nodes.InstructionAccountNode
  ): void {
    //
  }

  visitInstructionDataArgs(
    instructionDataArgs: nodes.InstructionDataArgsNode
  ): void {
    visit(instructionDataArgs.struct, this);
    if (instructionDataArgs.link) visit(instructionDataArgs.link, this);
  }

  visitInstructionExtraArgs(
    instructionExtraArgs: nodes.InstructionExtraArgsNode
  ): void {
    visit(instructionExtraArgs.struct, this);
    if (instructionExtraArgs.link) visit(instructionExtraArgs.link, this);
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): void {
    visit(definedType.data, this);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitError(error: nodes.ErrorNode): void {
    //
  }

  visitArrayType(arrayType: nodes.ArrayTypeNode): void {
    visit(arrayType.child, this);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitLinkType(linkType: nodes.LinkTypeNode): void {
    //
  }

  visitEnumType(enumType: nodes.EnumTypeNode): void {
    enumType.variants.forEach((variant) => visit(variant, this));
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
    visit(enumStructVariantType.struct, this);
  }

  visitEnumTupleVariantType(
    enumTupleVariantType: nodes.EnumTupleVariantTypeNode
  ): void {
    visit(enumTupleVariantType.tuple, this);
  }

  visitMapType(mapType: nodes.MapTypeNode): void {
    visit(mapType.key, this);
    visit(mapType.value, this);
  }

  visitOptionType(optionType: nodes.OptionTypeNode): void {
    visit(optionType.child, this);
  }

  visitSetType(setType: nodes.SetTypeNode): void {
    visit(setType.child, this);
  }

  visitStructType(structType: nodes.StructTypeNode): void {
    structType.fields.forEach((field) => visit(field, this));
  }

  visitStructFieldType(structFieldType: nodes.StructFieldTypeNode): void {
    visit(structFieldType.child, this);
  }

  visitTupleType(tupleType: nodes.TupleTypeNode): void {
    tupleType.children.forEach((child) => visit(child, this));
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

  visitAmountType(amountType: nodes.AmountTypeNode): void {
    visit(amountType.number, this);
  }

  visitDateTimeType(numberWrapperType: nodes.DateTimeTypeNode): void {
    visit(numberWrapperType.number, this);
  }

  visitSolAmountType(solAmountType: nodes.SolAmountTypeNode): void {
    visit(solAmountType.number, this);
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
