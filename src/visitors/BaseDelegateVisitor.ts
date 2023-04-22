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

  visitTypeArray(typeArray: nodes.ArrayTypeNode): U {
    return this.map(typeArray.accept(this.visitor));
  }

  visitTypeDefinedLink(typeDefinedLink: nodes.LinkTypeNode): U {
    return this.map(typeDefinedLink.accept(this.visitor));
  }

  visitTypeEnum(typeEnum: nodes.EnumTypeNode): U {
    return this.map(typeEnum.accept(this.visitor));
  }

  visitTypeEnumEmptyVariant(
    typeEnumEmptyVariant: nodes.EnumEmptyVariantTypeNode
  ): U {
    return this.map(typeEnumEmptyVariant.accept(this.visitor));
  }

  visitTypeEnumStructVariant(
    typeEnumStructVariant: nodes.EnumStructVariantTypeNode
  ): U {
    return this.map(typeEnumStructVariant.accept(this.visitor));
  }

  visitTypeEnumTupleVariant(
    typeEnumTupleVariant: nodes.EnumTupleVariantTypeNode
  ): U {
    return this.map(typeEnumTupleVariant.accept(this.visitor));
  }

  visitTypeMap(typeMap: nodes.MapTypeNode): U {
    return this.map(typeMap.accept(this.visitor));
  }

  visitTypeOption(typeOption: nodes.OptionTypeNode): U {
    return this.map(typeOption.accept(this.visitor));
  }

  visitTypeSet(typeSet: nodes.SetTypeNode): U {
    return this.map(typeSet.accept(this.visitor));
  }

  visitTypeStruct(typeStruct: nodes.StructTypeNode): U {
    return this.map(typeStruct.accept(this.visitor));
  }

  visitTypeStructField(typeStructField: nodes.StructFieldTypeNode): U {
    return this.map(typeStructField.accept(this.visitor));
  }

  visitTypeTuple(typeTuple: nodes.TupleTypeNode): U {
    return this.map(typeTuple.accept(this.visitor));
  }

  visitTypeBool(typeBool: nodes.BoolTypeNode): U {
    return this.map(typeBool.accept(this.visitor));
  }

  visitTypeBytes(typeBytes: nodes.BytesTypeNode): U {
    return this.map(typeBytes.accept(this.visitor));
  }

  visitTypeNumber(typeNumber: nodes.NumberTypeNode): U {
    return this.map(typeNumber.accept(this.visitor));
  }

  visitTypeNumberWrapper(typeNumberWrapper: nodes.NumberWrapperTypeNode): U {
    return this.map(typeNumberWrapper.accept(this.visitor));
  }

  visitTypePublicKey(typePublicKey: nodes.PublicKeyTypeNode): U {
    return this.map(typePublicKey.accept(this.visitor));
  }

  visitTypeString(typeString: nodes.StringTypeNode): U {
    return this.map(typeString.accept(this.visitor));
  }
}
