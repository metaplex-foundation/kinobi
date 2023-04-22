/* eslint-disable @typescript-eslint/no-unused-vars */
import * as nodes from '../nodes';
import type { Visitor } from './Visitor';

export class BaseThrowVisitor<T> implements Visitor<T> {
  visitRoot(root: nodes.RootNode): T {
    throw new Error('This visitor does not support Root nodes.');
  }

  visitProgram(program: nodes.ProgramNode): T {
    throw new Error('This visitor does not support Program nodes.');
  }

  visitAccount(account: nodes.AccountNode): T {
    throw new Error('This visitor does not support Account nodes.');
  }

  visitInstruction(instruction: nodes.InstructionNode): T {
    throw new Error('This visitor does not support Instruction nodes.');
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): T {
    throw new Error('This visitor does not support DefinedType nodes.');
  }

  visitError(error: nodes.ErrorNode): T {
    throw new Error('This visitor does not support Error nodes.');
  }

  visitTypeArray(typeArray: nodes.ArrayTypeNode): T {
    throw new Error('This visitor does not support TypeArray nodes.');
  }

  visitTypeDefinedLink(typeDefinedLink: nodes.LinkTypeNode): T {
    throw new Error('This visitor does not support TypeDefinedLink nodes.');
  }

  visitTypeEnum(typeEnum: nodes.EnumTypeNode): T {
    throw new Error('This visitor does not support TypeEnum nodes.');
  }

  visitTypeEnumEmptyVariant(
    typeEnumEmptyVariant: nodes.EnumEmptyVariantTypeNode
  ): T {
    throw new Error(
      'This visitor does not support TypeEnumEmptyVariant nodes.'
    );
  }

  visitTypeEnumStructVariant(
    typeEnumStructVariant: nodes.EnumStructVariantTypeNode
  ): T {
    throw new Error(
      'This visitor does not support TypeEnumStructVariant nodes.'
    );
  }

  visitTypeEnumTupleVariant(
    typeEnumTupleVariant: nodes.EnumTupleVariantTypeNode
  ): T {
    throw new Error(
      'This visitor does not support TypeEnumTupleVariant nodes.'
    );
  }

  visitTypeMap(typeMap: nodes.MapTypeNode): T {
    throw new Error('This visitor does not support TypeMap nodes.');
  }

  visitTypeOption(typeOption: nodes.OptionTypeNode): T {
    throw new Error('This visitor does not support TypeOption nodes.');
  }

  visitTypeSet(typeSet: nodes.SetTypeNode): T {
    throw new Error('This visitor does not support TypeSet nodes.');
  }

  visitTypeStruct(typeStruct: nodes.StructTypeNode): T {
    throw new Error('This visitor does not support TypeStruct nodes.');
  }

  visitTypeStructField(typeStructField: nodes.StructFieldTypeNode): T {
    throw new Error('This visitor does not support TypeStructField nodes.');
  }

  visitTypeTuple(typeTuple: nodes.TupleTypeNode): T {
    throw new Error('This visitor does not support TypeTuple nodes.');
  }

  visitTypeBool(typeBool: nodes.BoolTypeNode): T {
    throw new Error('This visitor does not support TypeBool nodes.');
  }

  visitTypeBytes(typeBytes: nodes.BytesTypeNode): T {
    throw new Error('This visitor does not support TypeBytes nodes.');
  }

  visitTypeNumber(typeNumber: nodes.NumberTypeNode): T {
    throw new Error('This visitor does not support TypeNumber nodes.');
  }

  visitTypeNumberWrapper(typeNumberWrapper: nodes.NumberWrapperTypeNode): T {
    throw new Error('This visitor does not support TypeNumberWrapper nodes.');
  }

  visitTypePublicKey(typePublicKey: nodes.PublicKeyTypeNode): T {
    throw new Error('This visitor does not support TypePublicKey nodes.');
  }

  visitTypeString(typeString: nodes.StringTypeNode): T {
    throw new Error('This visitor does not support TypeString nodes.');
  }
}
