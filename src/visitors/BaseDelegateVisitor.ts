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

  visitArrayType(arrayType: nodes.ArrayTypeNode): U {
    return this.map(visit(typeArray, this.visitor));
  }

  visitDefinedLinkType(definedLinkType: nodes.LinkTypeNode): U {
    return this.map(visit(typeDefinedLink, this.visitor));
  }

  visitEnumType(enumType: nodes.EnumTypeNode): U {
    return this.map(visit(typeEnum, this.visitor));
  }

  visitEnumEmptyVariantType(
    enumEmptyVariantType: nodes.EnumEmptyVariantTypeNode
  ): U {
    return this.map(visit(typeEnumEmptyVariant, this.visitor));
  }

  visitEnumStructVariantType(
    enumStructVariantType: nodes.EnumStructVariantTypeNode
  ): U {
    return this.map(visit(typeEnumStructVariant, this.visitor));
  }

  visitEnumTupleVariantType(
    enumTupleVariantType: nodes.EnumTupleVariantTypeNode
  ): U {
    return this.map(visit(typeEnumTupleVariant, this.visitor));
  }

  visitMapType(mapType: nodes.MapTypeNode): U {
    return this.map(visit(typeMap, this.visitor));
  }

  visitOptionType(optionType: nodes.OptionTypeNode): U {
    return this.map(visit(typeOption, this.visitor));
  }

  visitSetType(setType: nodes.SetTypeNode): U {
    return this.map(visit(typeSet, this.visitor));
  }

  visitStructType(structType: nodes.StructTypeNode): U {
    return this.map(visit(typeStruct, this.visitor));
  }

  visitStructFieldType(structFieldType: nodes.StructFieldTypeNode): U {
    return this.map(visit(typeStructField, this.visitor));
  }

  visitTupleType(tupleType: nodes.TupleTypeNode): U {
    return this.map(visit(typeTuple, this.visitor));
  }

  visitBoolType(boolType: nodes.BoolTypeNode): U {
    return this.map(visit(typeBool, this.visitor));
  }

  visitBytesType(bytesType: nodes.BytesTypeNode): U {
    return this.map(visit(typeBytes, this.visitor));
  }

  visitNumberType(numberType: nodes.NumberTypeNode): U {
    return this.map(visit(typeNumber, this.visitor));
  }

  visitNumberWrapperType(numberWrapperType: nodes.NumberWrapperTypeNode): U {
    return this.map(visit(typeNumberWrapper, this.visitor));
  }

  visitPublicKeyType(publicKeyType: nodes.PublicKeyTypeNode): U {
    return this.map(visit(typePublicKey, this.visitor));
  }

  visitStringType(stringType: nodes.StringTypeNode): U {
    return this.map(visit(typeString, this.visitor));
  }
}
