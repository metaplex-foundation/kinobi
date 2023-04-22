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

  visitTypeArray(typeArray: nodes.ArrayTypeNode): T {
    throw new KinobiError('This visitor does not support TypeArray nodes.');
  }

  visitTypeDefinedLink(typeDefinedLink: nodes.LinkTypeNode): T {
    throw new KinobiError(
      'This visitor does not support TypeDefinedLink nodes.'
    );
  }

  visitTypeEnum(typeEnum: nodes.EnumTypeNode): T {
    throw new KinobiError('This visitor does not support TypeEnum nodes.');
  }

  visitTypeEnumEmptyVariant(
    typeEnumEmptyVariant: nodes.EnumEmptyVariantTypeNode
  ): T {
    throw new KinobiError(
      'This visitor does not support TypeEnumEmptyVariant nodes.'
    );
  }

  visitTypeEnumStructVariant(
    typeEnumStructVariant: nodes.EnumStructVariantTypeNode
  ): T {
    throw new KinobiError(
      'This visitor does not support TypeEnumStructVariant nodes.'
    );
  }

  visitTypeEnumTupleVariant(
    typeEnumTupleVariant: nodes.EnumTupleVariantTypeNode
  ): T {
    throw new KinobiError(
      'This visitor does not support TypeEnumTupleVariant nodes.'
    );
  }

  visitTypeMap(typeMap: nodes.MapTypeNode): T {
    throw new KinobiError('This visitor does not support TypeMap nodes.');
  }

  visitTypeOption(typeOption: nodes.OptionTypeNode): T {
    throw new KinobiError('This visitor does not support TypeOption nodes.');
  }

  visitTypeSet(typeSet: nodes.SetTypeNode): T {
    throw new KinobiError('This visitor does not support TypeSet nodes.');
  }

  visitTypeStruct(typeStruct: nodes.StructTypeNode): T {
    throw new KinobiError('This visitor does not support TypeStruct nodes.');
  }

  visitTypeStructField(typeStructField: nodes.StructFieldTypeNode): T {
    throw new KinobiError(
      'This visitor does not support TypeStructField nodes.'
    );
  }

  visitTypeTuple(typeTuple: nodes.TupleTypeNode): T {
    throw new KinobiError('This visitor does not support TypeTuple nodes.');
  }

  visitTypeBool(typeBool: nodes.BoolTypeNode): T {
    throw new KinobiError('This visitor does not support TypeBool nodes.');
  }

  visitTypeBytes(typeBytes: nodes.BytesTypeNode): T {
    throw new KinobiError('This visitor does not support TypeBytes nodes.');
  }

  visitTypeNumber(typeNumber: nodes.NumberTypeNode): T {
    throw new KinobiError('This visitor does not support TypeNumber nodes.');
  }

  visitTypeNumberWrapper(typeNumberWrapper: nodes.NumberWrapperTypeNode): T {
    throw new KinobiError(
      'This visitor does not support TypeNumberWrapper nodes.'
    );
  }

  visitTypePublicKey(typePublicKey: nodes.PublicKeyTypeNode): T {
    throw new KinobiError('This visitor does not support TypePublicKey nodes.');
  }

  visitTypeString(typeString: nodes.StringTypeNode): T {
    throw new KinobiError('This visitor does not support TypeString nodes.');
  }
}
