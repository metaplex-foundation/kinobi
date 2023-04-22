/* eslint-disable @typescript-eslint/no-unused-vars */
import * as nodes from '../nodes';
import { KinobiError } from '../shared';
import type { Visitor } from './Visitor';

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
    throw new KinobiError('This visitor does not support TypeArray nodes.');
  }

  visitLinkType(definedLinkType: nodes.LinkTypeNode): T {
    throw new KinobiError(
      'This visitor does not support TypeDefinedLink nodes.'
    );
  }

  visitEnumType(enumType: nodes.EnumTypeNode): T {
    throw new KinobiError('This visitor does not support TypeEnum nodes.');
  }

  visitEnumEmptyVariantType(
    enumEmptyVariantType: nodes.EnumEmptyVariantTypeNode
  ): T {
    throw new KinobiError(
      'This visitor does not support TypeEnumEmptyVariant nodes.'
    );
  }

  visitEnumStructVariantType(
    enumStructVariantType: nodes.EnumStructVariantTypeNode
  ): T {
    throw new KinobiError(
      'This visitor does not support TypeEnumStructVariant nodes.'
    );
  }

  visitEnumTupleVariantType(
    enumTupleVariantType: nodes.EnumTupleVariantTypeNode
  ): T {
    throw new KinobiError(
      'This visitor does not support TypeEnumTupleVariant nodes.'
    );
  }

  visitMapType(mapType: nodes.MapTypeNode): T {
    throw new KinobiError('This visitor does not support TypeMap nodes.');
  }

  visitOptionType(optionType: nodes.OptionTypeNode): T {
    throw new KinobiError('This visitor does not support TypeOption nodes.');
  }

  visitSetType(setType: nodes.SetTypeNode): T {
    throw new KinobiError('This visitor does not support TypeSet nodes.');
  }

  visitStructType(structType: nodes.StructTypeNode): T {
    throw new KinobiError('This visitor does not support TypeStruct nodes.');
  }

  visitStructFieldType(structFieldType: nodes.StructFieldTypeNode): T {
    throw new KinobiError(
      'This visitor does not support TypeStructField nodes.'
    );
  }

  visitTupleType(tupleType: nodes.TupleTypeNode): T {
    throw new KinobiError('This visitor does not support TypeTuple nodes.');
  }

  visitBoolType(boolType: nodes.BoolTypeNode): T {
    throw new KinobiError('This visitor does not support TypeBool nodes.');
  }

  visitBytesType(bytesType: nodes.BytesTypeNode): T {
    throw new KinobiError('This visitor does not support TypeBytes nodes.');
  }

  visitNumberType(numberType: nodes.NumberTypeNode): T {
    throw new KinobiError('This visitor does not support TypeNumber nodes.');
  }

  visitNumberWrapperType(numberWrapperType: nodes.NumberWrapperTypeNode): T {
    throw new KinobiError(
      'This visitor does not support TypeNumberWrapper nodes.'
    );
  }

  visitPublicKeyType(publicKeyType: nodes.PublicKeyTypeNode): T {
    throw new KinobiError('This visitor does not support TypePublicKey nodes.');
  }

  visitStringType(stringType: nodes.StringTypeNode): T {
    throw new KinobiError('This visitor does not support TypeString nodes.');
  }
}
