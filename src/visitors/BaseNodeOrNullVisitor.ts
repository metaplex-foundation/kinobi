import type { Visitor } from './Visitor';
import * as nodes from '../nodes';

export class BaseNodeOrNullVisitor implements Visitor<nodes.Node | null> {
  visitRoot(root: nodes.RootNode): nodes.Node | null {
    return new nodes.RootNode(
      root.programs
        .map((program) => program.accept(this))
        .filter(nodes.removeNullAndAssertNodeFilter(nodes.assertProgramNode))
    );
  }

  visitProgram(program: nodes.ProgramNode): nodes.Node | null {
    return new nodes.ProgramNode(
      program.metadata,
      program.accounts
        .map((account) => account.accept(this))
        .filter(nodes.removeNullAndAssertNodeFilter(nodes.assertAccountNode)),
      program.instructions
        .map((instruction) => instruction.accept(this))
        .filter(
          nodes.removeNullAndAssertNodeFilter(nodes.assertInstructionNode)
        ),
      program.definedTypes
        .map((type) => type.accept(this))
        .filter(
          nodes.removeNullAndAssertNodeFilter(nodes.assertDefinedTypeNode)
        ),
      program.errors
        .map((error) => error.accept(this))
        .filter(nodes.removeNullAndAssertNodeFilter(nodes.assertErrorNode))
    );
  }

  visitAccount(account: nodes.AccountNode): nodes.Node | null {
    const accountType = account.type.accept(this);
    if (accountType === null) return null;
    nodes.assertTypeStructOrDefinedLinkNode(accountType);
    return new nodes.AccountNode(account.metadata, accountType);
  }

  visitInstruction(instruction: nodes.InstructionNode): nodes.Node | null {
    const args = instruction.args.accept(this);
    if (args === null) return null;
    nodes.assertTypeStructOrDefinedLinkNode(args);
    return new nodes.InstructionNode(
      instruction.metadata,
      instruction.accounts,
      args,
      instruction.subInstructions
        .map((ix) => ix.accept(this))
        .filter(
          nodes.removeNullAndAssertNodeFilter(nodes.assertInstructionNode)
        )
    );
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): nodes.Node | null {
    const type = definedType.type.accept(this);
    if (type === null) return null;
    nodes.assertTypeNode(type);
    return new nodes.DefinedTypeNode(definedType.metadata, type);
  }

  visitError(error: nodes.ErrorNode): nodes.Node | null {
    return error;
  }

  visitTypeArray(typeArray: nodes.TypeArrayNode): nodes.Node | null {
    const item = typeArray.item.accept(this);
    if (item === null) return null;
    nodes.assertTypeNode(item);
    return new nodes.TypeArrayNode(item, { ...typeArray });
  }

  visitTypeDefinedLink(
    typeDefinedLink: nodes.TypeDefinedLinkNode
  ): nodes.Node | null {
    return typeDefinedLink;
  }

  visitTypeEnum(typeEnum: nodes.TypeEnumNode): nodes.Node | null {
    const variants = typeEnum.variants
      .map((variant): nodes.TypeEnumVariantNode | null => {
        const newVariant = variant.accept(this);
        if (newVariant === null) return null;
        nodes.assertTypeEnumVariantNode(newVariant);
        return newVariant;
      })
      .filter((v): v is nodes.TypeEnumVariantNode => v !== null);

    return new nodes.TypeEnumNode(typeEnum.name, variants);
  }

  visitTypeEnumEmptyVariant(
    typeEnumEmptyVariant: nodes.TypeEnumEmptyVariantNode
  ): nodes.Node | null {
    return typeEnumEmptyVariant;
  }

  visitTypeEnumStructVariant(
    typeEnumStructVariant: nodes.TypeEnumStructVariantNode
  ): nodes.Node | null {
    const newStruct = typeEnumStructVariant.struct.accept(this);
    if (!newStruct) return null;
    nodes.assertTypeStructNode(newStruct);
    return new nodes.TypeEnumStructVariantNode(
      typeEnumStructVariant.name,
      newStruct
    );
  }

  visitTypeEnumTupleVariant(
    typeEnumTupleVariant: nodes.TypeEnumTupleVariantNode
  ): nodes.Node | null {
    const newTuple = typeEnumTupleVariant.tuple.accept(this);
    if (!newTuple) return null;
    nodes.assertTypeTupleNode(newTuple);
    return new nodes.TypeEnumTupleVariantNode(
      typeEnumTupleVariant.name,
      newTuple
    );
  }

  visitTypeMap(typeMap: nodes.TypeMapNode): nodes.Node | null {
    const key = typeMap.key.accept(this);
    const value = typeMap.value.accept(this);
    if (key === null || value === null) return null;
    nodes.assertTypeNode(key);
    nodes.assertTypeNode(value);
    return new nodes.TypeMapNode(key, value, { ...typeMap });
  }

  visitTypeOption(typeOption: nodes.TypeOptionNode): nodes.Node | null {
    const item = typeOption.item.accept(this);
    if (item === null) return null;
    nodes.assertTypeNode(item);
    return new nodes.TypeOptionNode(item, { ...typeOption });
  }

  visitTypeSet(typeSet: nodes.TypeSetNode): nodes.Node | null {
    const item = typeSet.item.accept(this);
    if (item === null) return null;
    nodes.assertTypeNode(item);
    return new nodes.TypeSetNode(item, { ...typeSet });
  }

  visitTypeStruct(typeStruct: nodes.TypeStructNode): nodes.Node | null {
    const fields = typeStruct.fields
      .map((field): nodes.TypeStructFieldNode | null => {
        const newField = field.accept(this);
        if (newField === null) return null;
        nodes.assertTypeStructFieldNode(newField);
        return newField;
      })
      .filter((field): field is nodes.TypeStructFieldNode => field !== null);

    return new nodes.TypeStructNode(typeStruct.name, fields);
  }

  visitTypeStructField(
    typeStructField: nodes.TypeStructFieldNode
  ): nodes.Node | null {
    const newType = typeStructField.type.accept(this);
    if (newType === null) return null;
    nodes.assertTypeNode(newType);
    return new nodes.TypeStructFieldNode(typeStructField.metadata, newType);
  }

  visitTypeTuple(typeTuple: nodes.TypeTupleNode): nodes.Node | null {
    const items = typeTuple.items
      .map((item) => {
        const newItem = item.accept(this);
        if (newItem === null) return null;
        nodes.assertTypeNode(newItem);
        return newItem;
      })
      .filter((type): type is nodes.TypeNode => type !== null);

    return new nodes.TypeTupleNode(items);
  }

  visitTypeBool(typeBool: nodes.TypeBoolNode): nodes.Node | null {
    return typeBool;
  }

  visitTypeBytes(typeBytes: nodes.TypeBytesNode): nodes.Node | null {
    return typeBytes;
  }

  visitTypeNumber(typeNumber: nodes.TypeNumberNode): nodes.Node | null {
    return typeNumber;
  }

  visitTypeNumberWrapper(
    typeNumberWrapper: nodes.TypeNumberWrapperNode
  ): nodes.Node | null {
    const item = typeNumberWrapper.item.accept(this);
    if (item === null) return null;
    nodes.assertTypeNumberNode(item);
    return new nodes.TypeNumberWrapperNode(item, typeNumberWrapper.wrapper);
  }

  visitTypePublicKey(
    typePublicKey: nodes.TypePublicKeyNode
  ): nodes.Node | null {
    return typePublicKey;
  }

  visitTypeString(typeString: nodes.TypeStringNode): nodes.Node | null {
    return typeString;
  }
}
