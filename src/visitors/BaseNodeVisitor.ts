import type { Visitor } from './Visitor';
import * as nodes from '../nodes';

export class BaseNodeVisitor implements Visitor<nodes.Node> {
  visitRoot(root: nodes.RootNode): nodes.Node {
    return new nodes.RootNode(
      root.programs
        .map((program) => program.accept(this))
        .filter(nodes.assertNodeFilter(nodes.assertProgramNode))
    );
  }

  visitProgram(program: nodes.ProgramNode): nodes.Node {
    return new nodes.ProgramNode(
      program.metadata,
      program.accounts
        .map((account) => account.accept(this))
        .filter(nodes.assertNodeFilter(nodes.assertAccountNode)),
      program.instructions
        .map((instruction) => instruction.accept(this))
        .filter(nodes.assertNodeFilter(nodes.assertInstructionNode)),
      program.definedTypes
        .map((type) => type.accept(this))
        .filter(nodes.assertNodeFilter(nodes.assertDefinedTypeNode)),
      program.errors
        .map((error) => error.accept(this))
        .filter(nodes.assertNodeFilter(nodes.assertErrorNode))
    );
  }

  visitAccount(account: nodes.AccountNode): nodes.Node {
    const accountType = account.type.accept(this);
    nodes.assertTypeStructNode(accountType);
    return new nodes.AccountNode(account.metadata, accountType);
  }

  visitInstruction(instruction: nodes.InstructionNode): nodes.Node {
    const args = instruction.args.accept(this);
    nodes.assertTypeStructNode(args);
    return new nodes.InstructionNode(
      instruction.metadata,
      instruction.accounts,
      args
    );
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): nodes.Node {
    const type = definedType.type.accept(this);
    nodes.assertTypeStructOrEnumNode(type);
    return new nodes.DefinedTypeNode(definedType.metadata, type);
  }

  visitError(error: nodes.ErrorNode): nodes.Node {
    return error;
  }

  visitTypeArray(typeArray: nodes.TypeArrayNode): nodes.Node {
    const type = typeArray.itemType.accept(this);
    nodes.assertTypeNode(type);
    return new nodes.TypeArrayNode(type, typeArray.size);
  }

  visitTypeDefinedLink(typeDefinedLink: nodes.TypeDefinedLinkNode): nodes.Node {
    return typeDefinedLink;
  }

  visitTypeEnum(typeEnum: nodes.TypeEnumNode): nodes.Node {
    return new nodes.TypeEnumNode(
      typeEnum.name,
      typeEnum.variants.map((variant) => {
        const newVariant = variant.accept(this);
        nodes.assertTypeEnumVariantNode(newVariant);
        return newVariant;
      })
    );
  }

  visitTypeEnumEmptyVariant(
    typeEnumEmptyVariant: nodes.TypeEnumEmptyVariantNode
  ): nodes.Node {
    return typeEnumEmptyVariant;
  }

  visitTypeEnumStructVariant(
    typeEnumStructVariant: nodes.TypeEnumStructVariantNode
  ): nodes.Node {
    const newStruct = typeEnumStructVariant.struct.accept(this);
    nodes.assertTypeStructNode(newStruct);
    return new nodes.TypeEnumStructVariantNode(
      typeEnumStructVariant.name,
      newStruct
    );
  }

  visitTypeEnumTupleVariant(
    typeEnumTupleVariant: nodes.TypeEnumTupleVariantNode
  ): nodes.Node {
    const newTuple = typeEnumTupleVariant.tuple.accept(this);
    nodes.assertTypeTupleNode(newTuple);
    return new nodes.TypeEnumTupleVariantNode(
      typeEnumTupleVariant.name,
      newTuple
    );
  }

  visitTypeLeaf(typeLeaf: nodes.TypeLeafNode): nodes.Node {
    return typeLeaf;
  }

  visitTypeLeafWrapper(typeLeafWrapper: nodes.TypeLeafWrapperNode): nodes.Node {
    const leaf = typeLeafWrapper.leaf.accept(this);
    nodes.assertTypeLeafNode(leaf);
    return new nodes.TypeLeafWrapperNode(typeLeafWrapper.wrapper, leaf);
  }

  visitTypeMap(typeMap: nodes.TypeMapNode): nodes.Node {
    const keyType = typeMap.keyType.accept(this);
    nodes.assertTypeNode(keyType);
    const valueType = typeMap.valueType.accept(this);
    nodes.assertTypeNode(valueType);
    return new nodes.TypeMapNode(typeMap.mapType, keyType, valueType);
  }

  visitTypeOption(typeOption: nodes.TypeOptionNode): nodes.Node {
    const type = typeOption.type.accept(this);
    nodes.assertTypeNode(type);
    return new nodes.TypeOptionNode(typeOption.optionType, type);
  }

  visitTypeSet(typeSet: nodes.TypeSetNode): nodes.Node {
    const type = typeSet.type.accept(this);
    nodes.assertTypeNode(type);
    return new nodes.TypeSetNode(typeSet.setType, type);
  }

  visitTypeStruct(typeStruct: nodes.TypeStructNode): nodes.Node {
    return new nodes.TypeStructNode(
      typeStruct.name,
      typeStruct.fields.map((field): nodes.TypeStructFieldNode => {
        const newField = field.accept(this);
        nodes.assertTypeStructFieldNode(newField);
        return newField;
      })
    );
  }

  visitTypeStructField(typeStructField: nodes.TypeStructFieldNode): nodes.Node {
    const newType = typeStructField.type.accept(this);
    nodes.assertTypeNode(newType);
    return new nodes.TypeStructFieldNode(typeStructField.metadata, newType);
  }

  visitTypeTuple(typeTuple: nodes.TypeTupleNode): nodes.Node {
    return new nodes.TypeTupleNode(
      typeTuple.itemTypes.map((type) => {
        const newType = type.accept(this);
        nodes.assertTypeNode(newType);
        return newType;
      })
    );
  }

  visitTypeVec(typeVec: nodes.TypeVecNode): nodes.Node {
    const type = typeVec.itemType.accept(this);
    nodes.assertTypeNode(type);
    return new nodes.TypeVecNode(type);
  }
}
