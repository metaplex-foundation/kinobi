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
  }

  visitInstruction(instruction: nodes.InstructionNode): void {
    instruction.args.accept(this);
    instruction.subInstructions.forEach((ix) => ix.accept(this));
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): void {
    definedType.type.accept(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitError(error: nodes.ErrorNode): void {
    //
  }

  visitTypeArray(typeArray: nodes.TypeArrayNode): void {
    typeArray.item.accept(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitTypeDefinedLink(typeDefinedLink: nodes.TypeDefinedLinkNode): void {
    //
  }

  visitTypeEnum(typeEnum: nodes.TypeEnumNode): void {
    typeEnum.variants.forEach((variant) => variant.accept(this));
  }

  visitTypeEnumEmptyVariant(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    typeEnumEmptyVariant: nodes.TypeEnumEmptyVariantNode
  ): void {
    //
  }

  visitTypeEnumStructVariant(
    typeEnumStructVariant: nodes.TypeEnumStructVariantNode
  ): void {
    typeEnumStructVariant.struct.accept(this);
  }

  visitTypeEnumTupleVariant(
    typeEnumTupleVariant: nodes.TypeEnumTupleVariantNode
  ): void {
    typeEnumTupleVariant.tuple.accept(this);
  }

  visitTypeMap(typeMap: nodes.TypeMapNode): void {
    typeMap.key.accept(this);
    typeMap.value.accept(this);
  }

  visitTypeOption(typeOption: nodes.TypeOptionNode): void {
    typeOption.item.accept(this);
  }

  visitTypeSet(typeSet: nodes.TypeSetNode): void {
    typeSet.item.accept(this);
  }

  visitTypeStruct(typeStruct: nodes.TypeStructNode): void {
    typeStruct.fields.forEach((field) => field.accept(this));
  }

  visitTypeStructField(typeStructField: nodes.TypeStructFieldNode): void {
    typeStructField.type.accept(this);
  }

  visitTypeTuple(typeTuple: nodes.TypeTupleNode): void {
    typeTuple.items.forEach((item) => item.accept(this));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitTypeBool(typeBool: nodes.TypeBoolNode): void {
    //
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitTypeBytes(typeBytes: nodes.TypeBytesNode): void {
    //
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitTypeNumber(typeNumber: nodes.TypeNumberNode): void {
    //
  }

  visitTypeNumberWrapper(typeNumberWrapper: nodes.TypeNumberWrapperNode): void {
    typeNumberWrapper.item.accept(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitTypePublicKey(typePublicKey: nodes.TypePublicKeyNode): void {
    //
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitTypeString(typeString: nodes.TypeStringNode): void {
    //
  }
}
