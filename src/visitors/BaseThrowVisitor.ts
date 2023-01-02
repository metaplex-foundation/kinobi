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

  visitTypeLeaf(typeLeaf: nodes.TypeLeafNode): T {
    throw new Error('This visitor does not support TypeLeaf nodes.');
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

  visitTypeTuple(typeTuple: nodes.TypeTupleNode): T {
    throw new Error('This visitor does not support TypeTuple nodes.');
  }

  visitTypeVec(typeVec: nodes.TypeVecNode): T {
    throw new Error('This visitor does not support TypeVec nodes.');
  }
}
