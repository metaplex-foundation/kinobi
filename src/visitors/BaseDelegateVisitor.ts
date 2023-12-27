import type * as nodes from '../nodes';
import { Visitor, visit } from './visitor';

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

  visitAccountData(accountData: nodes.AccountDataNode): U {
    return this.map(visit(accountData, this.visitor));
  }

  visitInstruction(instruction: nodes.InstructionNode): U {
    return this.map(visit(instruction, this.visitor));
  }

  visitInstructionAccount(instructionAccount: nodes.InstructionAccountNode): U {
    return this.map(visit(instructionAccount, this.visitor));
  }

  visitInstructionDataArgs(
    instructionDataArgs: nodes.InstructionDataArgsNode
  ): U {
    return this.map(visit(instructionDataArgs, this.visitor));
  }

  visitInstructionExtraArgs(
    instructionExtraArgs: nodes.InstructionExtraArgsNode
  ): U {
    return this.map(visit(instructionExtraArgs, this.visitor));
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): U {
    return this.map(visit(definedType, this.visitor));
  }

  visitError(error: nodes.ErrorNode): U {
    return this.map(visit(error, this.visitor));
  }

  visitArrayType(arrayType: nodes.ArrayTypeNode): U {
    return this.map(visit(arrayType, this.visitor));
  }

  visitLinkType(linkType: nodes.LinkTypeNode): U {
    return this.map(visit(linkType, this.visitor));
  }

  visitEnumType(enumType: nodes.EnumTypeNode): U {
    return this.map(visit(enumType, this.visitor));
  }

  visitEnumEmptyVariantType(
    enumEmptyVariantType: nodes.EnumEmptyVariantTypeNode
  ): U {
    return this.map(visit(enumEmptyVariantType, this.visitor));
  }

  visitEnumStructVariantType(
    enumStructVariantType: nodes.EnumStructVariantTypeNode
  ): U {
    return this.map(visit(enumStructVariantType, this.visitor));
  }

  visitEnumTupleVariantType(
    enumTupleVariantType: nodes.EnumTupleVariantTypeNode
  ): U {
    return this.map(visit(enumTupleVariantType, this.visitor));
  }

  visitMapType(mapType: nodes.MapTypeNode): U {
    return this.map(visit(mapType, this.visitor));
  }

  visitOptionType(optionType: nodes.OptionTypeNode): U {
    return this.map(visit(optionType, this.visitor));
  }

  visitSetType(setType: nodes.SetTypeNode): U {
    return this.map(visit(setType, this.visitor));
  }

  visitStructType(structType: nodes.StructTypeNode): U {
    return this.map(visit(structType, this.visitor));
  }

  visitStructFieldType(structFieldType: nodes.StructFieldTypeNode): U {
    return this.map(visit(structFieldType, this.visitor));
  }

  visitTupleType(tupleType: nodes.TupleTypeNode): U {
    return this.map(visit(tupleType, this.visitor));
  }

  visitBoolType(boolType: nodes.BoolTypeNode): U {
    return this.map(visit(boolType, this.visitor));
  }

  visitBytesType(bytesType: nodes.BytesTypeNode): U {
    return this.map(visit(bytesType, this.visitor));
  }

  visitNumberType(numberType: nodes.NumberTypeNode): U {
    return this.map(visit(numberType, this.visitor));
  }

  visitAmountType(amountTypeNode: nodes.AmountTypeNode): U {
    return this.map(visit(amountTypeNode, this.visitor));
  }

  visitDateTimeType(numberWrapperType: nodes.DateTimeTypeNode): U {
    return this.map(visit(numberWrapperType, this.visitor));
  }

  visitSolAmountType(solAmountTypeNode: nodes.SolAmountTypeNode): U {
    return this.map(visit(solAmountTypeNode, this.visitor));
  }

  visitPublicKeyType(publicKeyType: nodes.PublicKeyTypeNode): U {
    return this.map(visit(publicKeyType, this.visitor));
  }

  visitStringType(stringType: nodes.StringTypeNode): U {
    return this.map(visit(stringType, this.visitor));
  }
}
