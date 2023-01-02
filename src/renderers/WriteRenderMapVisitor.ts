import type * as nodes from '../nodes';
import { Visitor, BaseVoidVisitor } from '../visitors';
import { RenderMap } from './RenderMap';

export class WriteRenderMapVisitor extends BaseVoidVisitor {
  constructor(readonly visitor: Visitor<RenderMap>, readonly path: string) {
    super();
  }

  visitRoot(root: nodes.RootNode): void {
    root.accept(this.visitor).write(this.path);
  }

  visitProgram(program: nodes.ProgramNode) {
    program.accept(this.visitor).write(this.path);
  }

  visitAccount(account: nodes.AccountNode): void {
    account.accept(this.visitor).write(this.path);
  }

  visitInstruction(instruction: nodes.InstructionNode): void {
    instruction.accept(this.visitor).write(this.path);
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): void {
    definedType.accept(this.visitor).write(this.path);
  }

  visitError(error: nodes.ErrorNode): void {
    error.accept(this.visitor).write(this.path);
  }

  visitTypeArray(typeArray: nodes.TypeArrayNode): void {
    typeArray.accept(this.visitor).write(this.path);
  }

  visitTypeDefinedLink(typeDefinedLink: nodes.TypeDefinedLinkNode): void {
    typeDefinedLink.accept(this.visitor).write(this.path);
  }

  visitTypeEnum(typeEnum: nodes.TypeEnumNode): void {
    typeEnum.accept(this.visitor).write(this.path);
  }

  visitTypeLeaf(typeLeaf: nodes.TypeLeafNode): void {
    typeLeaf.accept(this.visitor).write(this.path);
  }

  visitTypeMap(typeMap: nodes.TypeMapNode): void {
    typeMap.accept(this.visitor).write(this.path);
  }

  visitTypeOption(typeOption: nodes.TypeOptionNode): void {
    typeOption.accept(this.visitor).write(this.path);
  }

  visitTypeSet(typeSet: nodes.TypeSetNode): void {
    typeSet.accept(this.visitor).write(this.path);
  }

  visitTypeStruct(typeStruct: nodes.TypeStructNode): void {
    typeStruct.accept(this.visitor).write(this.path);
  }

  visitTypeTuple(typeTuple: nodes.TypeTupleNode): void {
    typeTuple.accept(this.visitor).write(this.path);
  }

  visitTypeVec(typeVec: nodes.TypeVecNode): void {
    typeVec.accept(this.visitor).write(this.path);
  }
}
