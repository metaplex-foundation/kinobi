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
    nodes.assertStructOrLinkTypeNode(accountType);
    const seeds = account.metadata.seeds
      .map((seed) => {
        if (seed.kind !== 'variable') return seed;
        const newType = seed.type.accept(this);
        if (newType === null) return null;
        nodes.assertTypeNode(newType);
        return { ...seed, type: newType };
      })
      .filter((s): s is nodes.AccountNodeSeed => s !== null);
    const gpaFields = account.metadata.gpaFields
      .map((gpaField) => {
        const newType = gpaField.type.accept(this);
        if (newType === null) return null;
        nodes.assertTypeNode(newType);
        return { ...gpaField, type: newType };
      })
      .filter((f): f is nodes.AccountNodeGpaField => f !== null);
    return new nodes.AccountNode(
      { ...account.metadata, seeds, gpaFields },
      accountType
    );
  }

  visitInstruction(instruction: nodes.InstructionNode): nodes.Node | null {
    const args = instruction.args.accept(this);
    nodes.assertStructOrLinkTypeNode(args);
    const extraArgs = instruction.extraArgs.accept(this);
    nodes.assertStructOrLinkTypeNode(extraArgs);
    return new nodes.InstructionNode(
      instruction.metadata,
      instruction.accounts,
      args,
      extraArgs,
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

  visitTypeArray(typeArray: nodes.ArrayTypeNode): nodes.Node | null {
    const item = typeArray.item.accept(this);
    if (item === null) return null;
    nodes.assertTypeNode(item);
    return new nodes.ArrayTypeNode(item, { ...typeArray });
  }

  visitTypeDefinedLink(typeDefinedLink: nodes.LinkTypeNode): nodes.Node | null {
    return typeDefinedLink;
  }

  visitTypeEnum(typeEnum: nodes.EnumTypeNode): nodes.Node | null {
    const variants = typeEnum.variants
      .map((variant): nodes.EnumVariantTypeNode | null => {
        const newVariant = variant.accept(this);
        if (newVariant === null) return null;
        nodes.assertEnumVariantTypeNode(newVariant);
        return newVariant;
      })
      .filter((v): v is nodes.EnumVariantTypeNode => v !== null);

    return new nodes.EnumTypeNode(typeEnum.name, variants);
  }

  visitTypeEnumEmptyVariant(
    typeEnumEmptyVariant: nodes.EnumEmptyVariantTypeNode
  ): nodes.Node | null {
    return typeEnumEmptyVariant;
  }

  visitTypeEnumStructVariant(
    typeEnumStructVariant: nodes.EnumStructVariantTypeNode
  ): nodes.Node | null {
    const newStruct = typeEnumStructVariant.struct.accept(this);
    if (!newStruct) return null;
    nodes.assertStructTypeNode(newStruct);
    return new nodes.EnumStructVariantTypeNode(
      typeEnumStructVariant.name,
      newStruct
    );
  }

  visitTypeEnumTupleVariant(
    typeEnumTupleVariant: nodes.EnumTupleVariantTypeNode
  ): nodes.Node | null {
    const newTuple = typeEnumTupleVariant.tuple.accept(this);
    if (!newTuple) return null;
    nodes.assertTupleTypeNode(newTuple);
    return new nodes.EnumTupleVariantTypeNode(
      typeEnumTupleVariant.name,
      newTuple
    );
  }

  visitTypeMap(typeMap: nodes.MapTypeNode): nodes.Node | null {
    const key = typeMap.key.accept(this);
    const value = typeMap.value.accept(this);
    if (key === null || value === null) return null;
    nodes.assertTypeNode(key);
    nodes.assertTypeNode(value);
    return new nodes.MapTypeNode(key, value, { ...typeMap });
  }

  visitTypeOption(typeOption: nodes.OptionTypeNode): nodes.Node | null {
    const item = typeOption.item.accept(this);
    if (item === null) return null;
    nodes.assertTypeNode(item);
    return new nodes.OptionTypeNode(item, { ...typeOption });
  }

  visitTypeSet(typeSet: nodes.SetTypeNode): nodes.Node | null {
    const item = typeSet.item.accept(this);
    if (item === null) return null;
    nodes.assertTypeNode(item);
    return new nodes.SetTypeNode(item, { ...typeSet });
  }

  visitTypeStruct(typeStruct: nodes.StructTypeNode): nodes.Node | null {
    const fields = typeStruct.fields
      .map((field): nodes.StructFieldTypeNode | null => {
        const newField = field.accept(this);
        if (newField === null) return null;
        nodes.assertStructFieldTypeNode(newField);
        return newField;
      })
      .filter((field): field is nodes.StructFieldTypeNode => field !== null);

    return new nodes.StructTypeNode(typeStruct.name, fields);
  }

  visitTypeStructField(
    typeStructField: nodes.StructFieldTypeNode
  ): nodes.Node | null {
    const newType = typeStructField.type.accept(this);
    if (newType === null) return null;
    nodes.assertTypeNode(newType);
    return new nodes.StructFieldTypeNode(typeStructField.metadata, newType);
  }

  visitTypeTuple(typeTuple: nodes.TupleTypeNode): nodes.Node | null {
    const items = typeTuple.items
      .map((item) => {
        const newItem = item.accept(this);
        if (newItem === null) return null;
        nodes.assertTypeNode(newItem);
        return newItem;
      })
      .filter((type): type is nodes.TypeNode => type !== null);

    return new nodes.TupleTypeNode(items);
  }

  visitTypeBool(typeBool: nodes.BoolTypeNode): nodes.Node | null {
    return typeBool;
  }

  visitTypeBytes(typeBytes: nodes.BytesTypeNode): nodes.Node | null {
    return typeBytes;
  }

  visitTypeNumber(typeNumber: nodes.NumberTypeNode): nodes.Node | null {
    return typeNumber;
  }

  visitTypeNumberWrapper(
    typeNumberWrapper: nodes.NumberWrapperTypeNode
  ): nodes.Node | null {
    const item = typeNumberWrapper.item.accept(this);
    if (item === null) return null;
    nodes.assertNumberTypeNode(item);
    return new nodes.NumberWrapperTypeNode(item, typeNumberWrapper.wrapper);
  }

  visitTypePublicKey(
    typePublicKey: nodes.PublicKeyTypeNode
  ): nodes.Node | null {
    return typePublicKey;
  }

  visitTypeString(typeString: nodes.StringTypeNode): nodes.Node | null {
    return typeString;
  }
}
