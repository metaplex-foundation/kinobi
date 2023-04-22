import type * as nodes from '../nodes';
import { Visitor } from './Visitor';

export abstract class BaseDelegateVisitor<T, U> implements Visitor<U> {
  constructor(readonly visitor: Visitor<T>) {}

  abstract map(value: T): U;

  visitRoot(root: nodes.RootNode): U {
    return this.map(visit(root, this.visitor));
  }

  visitProgram(program: nodes.ProgramNode): U {
    return this.map(visit(program, this.visitor));
  }

  visitAccount(account: nodes.AccountNode): U {
    return this.map(visit(account, this.visitor));
  }

  visitInstruction(instruction: nodes.InstructionNode): U {
    return this.map(visit(instruction, this.visitor));
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): U {
    return this.map(visit(definedType, this.visitor));
  }

  visitError(error: nodes.ErrorNode): U {
    return this.map(visit(error, this.visitor));
  }

  visitTypeArray(typeArray: nodes.ArrayTypeNode): U {
    return this.map(visit(typeArray, this.visitor));
  }

  visitTypeDefinedLink(typeDefinedLink: nodes.LinkTypeNode): U {
    return this.map(visit(typeDefinedLink, this.visitor));
  }

  visitTypeEnum(typeEnum: nodes.EnumTypeNode): U {
    return this.map(visit(typeEnum, this.visitor));
  }

  visitTypeEnumEmptyVariant(
    typeEnumEmptyVariant: nodes.EnumEmptyVariantTypeNode
  ): U {
    return this.map(visit(typeEnumEmptyVariant, this.visitor));
  }

  visitTypeEnumStructVariant(
    typeEnumStructVariant: nodes.EnumStructVariantTypeNode
  ): U {
    return this.map(visit(typeEnumStructVariant, this.visitor));
  }

  visitTypeEnumTupleVariant(
    typeEnumTupleVariant: nodes.EnumTupleVariantTypeNode
  ): U {
    return this.map(visit(typeEnumTupleVariant, this.visitor));
  }

  visitTypeMap(typeMap: nodes.MapTypeNode): U {
    return this.map(visit(typeMap, this.visitor));
  }

  visitTypeOption(typeOption: nodes.OptionTypeNode): U {
    return this.map(visit(typeOption, this.visitor));
  }

  visitTypeSet(typeSet: nodes.SetTypeNode): U {
    return this.map(visit(typeSet, this.visitor));
  }

  visitTypeStruct(typeStruct: nodes.StructTypeNode): U {
    return this.map(visit(typeStruct, this.visitor));
  }

  visitTypeStructField(typeStructField: nodes.StructFieldTypeNode): U {
    return this.map(visit(typeStructField, this.visitor));
  }

  visitTypeTuple(typeTuple: nodes.TupleTypeNode): U {
    return this.map(visit(typeTuple, this.visitor));
  }

  visitTypeBool(typeBool: nodes.BoolTypeNode): U {
    return this.map(visit(typeBool, this.visitor));
  }

  visitTypeBytes(typeBytes: nodes.BytesTypeNode): U {
    return this.map(visit(typeBytes, this.visitor));
  }

  visitTypeNumber(typeNumber: nodes.NumberTypeNode): U {
    return this.map(visit(typeNumber, this.visitor));
  }

  visitTypeNumberWrapper(typeNumberWrapper: nodes.NumberWrapperTypeNode): U {
    return this.map(visit(typeNumberWrapper, this.visitor));
  }

  visitTypePublicKey(typePublicKey: nodes.PublicKeyTypeNode): U {
    return this.map(visit(typePublicKey, this.visitor));
  }

  visitTypeString(typeString: nodes.StringTypeNode): U {
    return this.map(visit(typeString, this.visitor));
  }
}
