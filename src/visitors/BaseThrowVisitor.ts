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

  visitTypeArray(typeArray: nodes.TypeArrayNode): T {
    throw new Error('This visitor does not support TypeArray nodes.');
  }

  visitTypeDefinedLink(typeDefinedLink: nodes.TypeDefinedLinkNode): T {
    throw new Error('This visitor does not support TypeDefinedLink nodes.');
  }

  visitTypeEnum(typeEnum: nodes.TypeEnumNode): T {
    throw new Error('This visitor does not support TypeEnum nodes.');
  }

  visitTypeEnumEmptyVariant(
    typeEnumEmptyVariant: nodes.TypeEnumEmptyVariantNode
  ): T {
    throw new Error(
      'This visitor does not support TypeEnumEmptyVariant nodes.'
    );
  }

  visitTypeEnumStructVariant(
    typeEnumStructVariant: nodes.TypeEnumStructVariantNode
  ): T {
    throw new Error(
      'This visitor does not support TypeEnumStructVariant nodes.'
    );
  }

  visitTypeEnumTupleVariant(
    typeEnumTupleVariant: nodes.TypeEnumTupleVariantNode
  ): T {
    throw new Error(
      'This visitor does not support TypeEnumTupleVariant nodes.'
    );
  }

  visitTypeMap(typeMap: nodes.TypeMapNode): T {
    throw new Error('This visitor does not support TypeMap nodes.');
  }

  visitTypeOption(typeOption: nodes.TypeOptionNode): T {
    throw new Error('This visitor does not support TypeOption nodes.');
  }

  visitTypeSet(typeSet: nodes.TypeSetNode): T {
    throw new Error('This visitor does not support TypeSet nodes.');
  }

  visitTypeStruct(typeStruct: nodes.TypeStructNode): T {
    throw new Error('This visitor does not support TypeStruct nodes.');
  }

  visitTypeStructField(typeStructField: nodes.TypeStructFieldNode): T {
    throw new Error('This visitor does not support TypeStructField nodes.');
  }

  visitTypeTuple(typeTuple: nodes.TypeTupleNode): T {
    throw new Error('This visitor does not support TypeTuple nodes.');
  }

  visitTypeBool(typeBool: nodes.TypeBoolNode): T {
    throw new Error('This visitor does not support TypeBool nodes.');
  }

  visitTypeBytes(typeBytes: nodes.TypeBytesNode): T {
    throw new Error('This visitor does not support TypeBytes nodes.');
  }

  visitTypeNumber(typeNumber: nodes.TypeNumberNode): T {
    throw new Error('This visitor does not support TypeNumber nodes.');
  }

  visitTypeNumberWrapper(typeNumberWrapper: nodes.TypeNumberWrapperNode): T {
    throw new Error('This visitor does not support TypeNumberWrapper nodes.');
  }

  visitTypePublicKey(typePublicKey: nodes.TypePublicKeyNode): T {
    throw new Error('This visitor does not support TypePublicKey nodes.');
  }

  visitTypeString(typeString: nodes.TypeStringNode): T {
    throw new Error('This visitor does not support TypeString nodes.');
  }
}
