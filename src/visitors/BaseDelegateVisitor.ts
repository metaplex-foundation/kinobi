import type * as nodes from '../nodes';
import { Visitor } from './Visitor';

export abstract class BaseDelegateVisitor<T, U> implements Visitor<U> {
  constructor(readonly visitor: Visitor<T>) {}

  abstract map(value: T): U;

  visitRoot(root: nodes.RootNode): U {
    return this.map(root.accept(this.visitor));
  }

  visitProgram(program: nodes.ProgramNode): U {
    return this.map(program.accept(this.visitor));
  }

  visitAccount(account: nodes.AccountNode): U {
    return this.map(account.accept(this.visitor));
  }

  visitInstruction(instruction: nodes.InstructionNode): U {
    return this.map(instruction.accept(this.visitor));
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): U {
    return this.map(definedType.accept(this.visitor));
  }

  visitError(error: nodes.ErrorNode): U {
    return this.map(error.accept(this.visitor));
  }

  visitTypeArray(typeArray: nodes.TypeArrayNode): U {
    return this.map(typeArray.accept(this.visitor));
  }

  visitTypeDefinedLink(typeDefinedLink: nodes.TypeDefinedLinkNode): U {
    return this.map(typeDefinedLink.accept(this.visitor));
  }

  visitTypeEnum(typeEnum: nodes.TypeEnumNode): U {
    return this.map(typeEnum.accept(this.visitor));
  }

  visitTypeEnumEmptyVariant(
    typeEnumEmptyVariant: nodes.TypeEnumEmptyVariantNode
  ): U {
    return this.map(typeEnumEmptyVariant.accept(this.visitor));
  }

  visitTypeEnumStructVariant(
    typeEnumStructVariant: nodes.TypeEnumStructVariantNode
  ): U {
    return this.map(typeEnumStructVariant.accept(this.visitor));
  }

  visitTypeEnumTupleVariant(
    typeEnumTupleVariant: nodes.TypeEnumTupleVariantNode
  ): U {
    return this.map(typeEnumTupleVariant.accept(this.visitor));
  }

  visitTypeLeaf(typeLeaf: nodes.TypeLeafNode): U {
    return this.map(typeLeaf.accept(this.visitor));
  }

  visitTypeMap(typeMap: nodes.TypeMapNode): U {
    return this.map(typeMap.accept(this.visitor));
  }

  visitTypeOption(typeOption: nodes.TypeOptionNode): U {
    return this.map(typeOption.accept(this.visitor));
  }

  visitTypeSet(typeSet: nodes.TypeSetNode): U {
    return this.map(typeSet.accept(this.visitor));
  }

  visitTypeStruct(typeStruct: nodes.TypeStructNode): U {
    return this.map(typeStruct.accept(this.visitor));
  }

  visitTypeStructField(typeStructField: nodes.TypeStructFieldNode): U {
    return this.map(typeStructField.accept(this.visitor));
  }

  visitTypeTuple(typeTuple: nodes.TypeTupleNode): U {
    return this.map(typeTuple.accept(this.visitor));
  }

  visitTypeVec(typeVec: nodes.TypeVecNode): U {
    return this.map(typeVec.accept(this.visitor));
  }
}
