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
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): void {
    definedType.type.accept(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitError(error: nodes.ErrorNode): void {
    //
  }

  visitTypeArray(typeArray: nodes.TypeArrayNode): void {
    typeArray.itemType.accept(this);
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  visitTypeLeaf(typeLeaf: nodes.TypeLeafNode): void {
    //
  }

  visitTypeLeafWrapper(typeLeafWrapper: nodes.TypeLeafWrapperNode): void {
    typeLeafWrapper.leaf.accept(this);
  }

  visitTypeMap(typeMap: nodes.TypeMapNode): void {
    typeMap.keyType.accept(this);
    typeMap.valueType.accept(this);
  }

  visitTypeOption(typeOption: nodes.TypeOptionNode): void {
    typeOption.type.accept(this);
  }

  visitTypeSet(typeSet: nodes.TypeSetNode): void {
    typeSet.type.accept(this);
  }

  visitTypeStruct(typeStruct: nodes.TypeStructNode): void {
    typeStruct.fields.forEach((field) => field.accept(this));
  }

  visitTypeStructField(typeStructField: nodes.TypeStructFieldNode): void {
    typeStructField.type.accept(this);
  }

  visitTypeTuple(typeTuple: nodes.TypeTupleNode): void {
    typeTuple.itemTypes.forEach((itemType) => itemType.accept(this));
  }

  visitTypeVec(typeVec: nodes.TypeVecNode): void {
    typeVec.itemType.accept(this);
  }
}
