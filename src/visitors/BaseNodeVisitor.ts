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
    nodes.assertTypeStructOrDefinedLinkNode(accountType);
    const seeds = account.metadata.seeds.map((seed) => {
      if (seed.kind !== 'variable') return seed;
      const newType = seed.type.accept(this);
      nodes.assertTypeNode(newType);
      return { ...seed, type: newType };
    });
    const gpaFields = account.metadata.gpaFields.map((gpaField) => {
      const newType = gpaField.type.accept(this);
      nodes.assertTypeNode(newType);
      return { ...gpaField, type: newType };
    });
    return new nodes.AccountNode(
      { ...account.metadata, seeds, gpaFields },
      accountType
    );
  }

  visitInstruction(instruction: nodes.InstructionNode): nodes.Node {
    const args = instruction.args.accept(this);
    nodes.assertTypeStructOrDefinedLinkNode(args);
    const extraArgs = instruction.extraArgs?.accept(this) ?? null;
    if (extraArgs !== null) {
      nodes.assertTypeStructOrDefinedLinkNode(args);
    }
    return new nodes.InstructionNode(
      instruction.metadata,
      instruction.accounts,
      args,
      extraArgs as nodes.TypeStructNode | nodes.TypeDefinedLinkNode | null,
      instruction.subInstructions
        .map((ix) => ix.accept(this))
        .filter(
          nodes.removeNullAndAssertNodeFilter(nodes.assertInstructionNode)
        )
    );
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): nodes.Node {
    const type = definedType.type.accept(this);
    nodes.assertTypeNode(type);
    return new nodes.DefinedTypeNode(definedType.metadata, type);
  }

  visitError(error: nodes.ErrorNode): nodes.Node {
    return error;
  }

  visitTypeArray(typeArray: nodes.TypeArrayNode): nodes.Node {
    const item = typeArray.item.accept(this);
    nodes.assertTypeNode(item);
    return new nodes.TypeArrayNode(item, { ...typeArray });
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

  visitTypeMap(typeMap: nodes.TypeMapNode): nodes.Node {
    const key = typeMap.key.accept(this);
    nodes.assertTypeNode(key);
    const value = typeMap.value.accept(this);
    nodes.assertTypeNode(value);
    return new nodes.TypeMapNode(key, value, { ...typeMap });
  }

  visitTypeOption(typeOption: nodes.TypeOptionNode): nodes.Node {
    const item = typeOption.item.accept(this);
    nodes.assertTypeNode(item);
    return new nodes.TypeOptionNode(item, { ...typeOption });
  }

  visitTypeSet(typeSet: nodes.TypeSetNode): nodes.Node {
    const item = typeSet.item.accept(this);
    nodes.assertTypeNode(item);
    return new nodes.TypeSetNode(item, { ...typeSet });
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
      typeTuple.items.map((item) => {
        const newItem = item.accept(this);
        nodes.assertTypeNode(newItem);
        return newItem;
      })
    );
  }

  visitTypeBool(typeBool: nodes.TypeBoolNode): nodes.Node {
    return typeBool;
  }

  visitTypeBytes(typeBytes: nodes.TypeBytesNode): nodes.Node {
    return typeBytes;
  }

  visitTypeNumber(typeNumber: nodes.TypeNumberNode): nodes.Node {
    return typeNumber;
  }

  visitTypeNumberWrapper(
    typeNumberWrapper: nodes.TypeNumberWrapperNode
  ): nodes.Node {
    const item = typeNumberWrapper.item.accept(this);
    nodes.assertTypeNumberNode(item);
    return new nodes.TypeNumberWrapperNode(item, typeNumberWrapper.wrapper);
  }

  visitTypePublicKey(typePublicKey: nodes.TypePublicKeyNode): nodes.Node {
    return typePublicKey;
  }

  visitTypeString(typeString: nodes.TypeStringNode): nodes.Node {
    return typeString;
  }
}
