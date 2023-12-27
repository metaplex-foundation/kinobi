/* eslint-disable @typescript-eslint/no-unused-vars */
import * as nodes from '../nodes';
import { KinobiError } from '../shared';
import type { Visitor } from './visitor2';

export class BaseThrowVisitor<T> implements Visitor<T> {
  visitRoot(root: nodes.RootNode): T {
    throw new KinobiError('This visitor does not support Root nodes.');
  }

  visitProgram(program: nodes.ProgramNode): T {
    throw new KinobiError('This visitor does not support Program nodes.');
  }

  visitAccount(account: nodes.AccountNode): T {
    throw new KinobiError('This visitor does not support Account nodes.');
  }

  visitAccountData(accountData: nodes.AccountDataNode): T {
    throw new KinobiError(
      'This visitor does not support AccountDataNode nodes.'
    );
  }

  visitInstruction(instruction: nodes.InstructionNode): T {
    throw new KinobiError('This visitor does not support Instruction nodes.');
  }

  visitInstructionAccount(instructionAccount: nodes.InstructionAccountNode): T {
    throw new KinobiError(
      'This visitor does not support InstructionAccountNode nodes.'
    );
  }

  visitInstructionDataArgs(
    instructionDataArgs: nodes.InstructionDataArgsNode
  ): T {
    throw new KinobiError(
      'This visitor does not support InstructionDataArgsNode nodes.'
    );
  }

  visitInstructionExtraArgs(
    instructionExtraArgs: nodes.InstructionExtraArgsNode
  ): T {
    throw new KinobiError(
      'This visitor does not support InstructionExtraArgsNode nodes.'
    );
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): T {
    throw new KinobiError('This visitor does not support DefinedType nodes.');
  }

  visitError(error: nodes.ErrorNode): T {
    throw new KinobiError('This visitor does not support Error nodes.');
  }

  visitArrayType(arrayType: nodes.ArrayTypeNode): T {
    throw new KinobiError('This visitor does not support ArrayType nodes.');
  }

  visitLinkType(linkType: nodes.LinkTypeNode): T {
    throw new KinobiError('This visitor does not support LinkType nodes.');
  }

  visitEnumType(enumType: nodes.EnumTypeNode): T {
    throw new KinobiError('This visitor does not support EnumType nodes.');
  }

  visitEnumEmptyVariantType(
    enumEmptyVariantType: nodes.EnumEmptyVariantTypeNode
  ): T {
    throw new KinobiError(
      'This visitor does not support EnumEmptyVariantType nodes.'
    );
  }

  visitEnumStructVariantType(
    enumStructVariantType: nodes.EnumStructVariantTypeNode
  ): T {
    throw new KinobiError(
      'This visitor does not support EnumStructVariantType nodes.'
    );
  }

  visitEnumTupleVariantType(
    enumTupleVariantType: nodes.EnumTupleVariantTypeNode
  ): T {
    throw new KinobiError(
      'This visitor does not support EnumTupleVariantType nodes.'
    );
  }

  visitMapType(mapType: nodes.MapTypeNode): T {
    throw new KinobiError('This visitor does not support MapType nodes.');
  }

  visitOptionType(optionType: nodes.OptionTypeNode): T {
    throw new KinobiError('This visitor does not support OptionType nodes.');
  }

  visitSetType(setType: nodes.SetTypeNode): T {
    throw new KinobiError('This visitor does not support SetType nodes.');
  }

  visitStructType(structType: nodes.StructTypeNode): T {
    throw new KinobiError('This visitor does not support StructType nodes.');
  }

  visitStructFieldType(structFieldType: nodes.StructFieldTypeNode): T {
    throw new KinobiError(
      'This visitor does not support StructFieldType nodes.'
    );
  }

  visitTupleType(tupleType: nodes.TupleTypeNode): T {
    throw new KinobiError('This visitor does not support TupleType nodes.');
  }

  visitBoolType(boolType: nodes.BoolTypeNode): T {
    throw new KinobiError('This visitor does not support BoolType nodes.');
  }

  visitBytesType(bytesType: nodes.BytesTypeNode): T {
    throw new KinobiError('This visitor does not support BytesType nodes.');
  }

  visitNumberType(numberType: nodes.NumberTypeNode): T {
    throw new KinobiError('This visitor does not support NumberType nodes.');
  }

  visitAmountType(amountType: nodes.AmountTypeNode): T {
    throw new KinobiError('This visitor does not support AmountType nodes.');
  }

  visitDateTimeType(numberWrapperType: nodes.DateTimeTypeNode): T {
    throw new KinobiError('This visitor does not support DateTimeType nodes.');
  }

  visitSolAmountType(solAmountType: nodes.SolAmountTypeNode): T {
    throw new KinobiError('This visitor does not support SolAmountType nodes.');
  }

  visitPublicKeyType(publicKeyType: nodes.PublicKeyTypeNode): T {
    throw new KinobiError('This visitor does not support PublicKeyType nodes.');
  }

  visitStringType(stringType: nodes.StringTypeNode): T {
    throw new KinobiError('This visitor does not support StringType nodes.');
  }
}
