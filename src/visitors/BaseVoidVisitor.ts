import * as nodes from '../nodes';
import type { Visitor } from './Visitor';

export abstract class BaseVoidVisitor implements Visitor<void> {
  visitRoot(root: nodes.RootNode): void {
    root.programs.forEach((program) => program.accept(this));
  }

  visitProgram(program: nodes.ProgramNode): void {
    program.accounts.forEach((account) => account.accept(this));
    program.instructions.forEach((instruction) => instruction.accept(this));
    program.definedTypes.forEach((type) => type.accept(this));
    program.errors.forEach((type) => type.accept(this));
  }

  visitAccount(account: nodes.AccountNode): void {
    account.type.accept(this);
    account.variableSeeds.forEach((seed) => seed.type.accept(this));
    account.metadata.gpaFields.forEach((field) => field.type.accept(this));
  }

  visitInstruction(instruction: nodes.InstructionNode): void {
    instruction.args.accept(this);
    instruction.extraArgs?.accept(this);
    instruction.subInstructions.forEach((ix) => ix.accept(this));
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): void {
    definedType.type.accept(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitError(error: nodes.ErrorNode): void {
    //
  }

  visitTypeArray(typeArray: nodes.ArrayTypeNode): void {
    typeArray.item.accept(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitTypeDefinedLink(typeDefinedLink: nodes.DefinedLinkTypeNode): void {
    //
  }

  visitTypeEnum(typeEnum: nodes.EnumTypeNode): void {
    typeEnum.variants.forEach((variant) => variant.accept(this));
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
    typeEnumStructVariant.struct.accept(this);
  }

  visitTypeEnumTupleVariant(
    typeEnumTupleVariant: nodes.EnumTupleVariantTypeNode
  ): void {
    typeEnumTupleVariant.tuple.accept(this);
  }

  visitTypeMap(typeMap: nodes.MapTypeNode): void {
    typeMap.key.accept(this);
    typeMap.value.accept(this);
  }

  visitTypeOption(typeOption: nodes.OptionTypeNode): void {
    typeOption.item.accept(this);
  }

  visitTypeSet(typeSet: nodes.SetTypeNode): void {
    typeSet.item.accept(this);
  }

  visitTypeStruct(typeStruct: nodes.StructTypeNode): void {
    typeStruct.fields.forEach((field) => field.accept(this));
  }

  visitTypeStructField(typeStructField: nodes.StructFieldTypeNode): void {
    typeStructField.type.accept(this);
  }

  visitTypeTuple(typeTuple: nodes.TupleTypeNode): void {
    typeTuple.items.forEach((item) => item.accept(this));
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
    typeNumberWrapper.item.accept(this);
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
