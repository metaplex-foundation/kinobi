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

  visitTypeArray(typeArray: nodes.ArrayTypeNode): void {
    visit(typeArray.item, this);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitTypeDefinedLink(typeDefinedLink: nodes.LinkTypeNode): void {
    //
  }

  visitTypeEnum(typeEnum: nodes.EnumTypeNode): void {
    typeEnum.variants.forEach((variant) => visit(variant, this));
  }

  visitTypeEnumEmptyVariant(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    typeEnumEmptyVariant: nodes.EnumEmptyVariantTypeNode
  ): void {
    //
  }

  visitTypeEnumStructVariant(
    typeEnumStructVariant: nodes.EnumStructVariantTypeNode
  ): void {
    visit(typeEnumStructVariant.struct, this);
  }

  visitTypeEnumTupleVariant(
    typeEnumTupleVariant: nodes.EnumTupleVariantTypeNode
  ): void {
    visit(typeEnumTupleVariant.tuple, this);
  }

  visitTypeMap(typeMap: nodes.MapTypeNode): void {
    visit(typeMap.key, this);
    visit(typeMap.value, this);
  }

  visitTypeOption(typeOption: nodes.OptionTypeNode): void {
    visit(typeOption.item, this);
  }

  visitTypeSet(typeSet: nodes.SetTypeNode): void {
    visit(typeSet.item, this);
  }

  visitTypeStruct(typeStruct: nodes.StructTypeNode): void {
    typeStruct.fields.forEach((field) => visit(field, this));
  }

  visitTypeStructField(typeStructField: nodes.StructFieldTypeNode): void {
    visit(typeStructField.type, this);
  }

  visitTypeTuple(typeTuple: nodes.TupleTypeNode): void {
    typeTuple.items.forEach((item) => visit(item, this));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitTypeBool(typeBool: nodes.BoolTypeNode): void {
    //
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitTypeBytes(typeBytes: nodes.BytesTypeNode): void {
    //
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitTypeNumber(typeNumber: nodes.NumberTypeNode): void {
    //
  }

  visitTypeNumberWrapper(typeNumberWrapper: nodes.NumberWrapperTypeNode): void {
    visit(typeNumberWrapper.item, this);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitTypePublicKey(typePublicKey: nodes.PublicKeyTypeNode): void {
    //
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitTypeString(typeString: nodes.StringTypeNode): void {
    //
  }
}
