import { Visitor, visit } from './Visitor';
import * as nodes from '../nodes';

export class BaseNodeOrNullVisitor implements Visitor<nodes.Node | null> {
  visitRoot(root: nodes.RootNode): nodes.Node | null {
    return new nodes.rootNode(
      root.programs
        .map((program) => visit(program, this))
        .filter(nodes.removeNullAndAssertNodeFilter(nodes.assertProgramNode))
    );
  }

  visitProgram(program: nodes.ProgramNode): nodes.Node | null {
    return new nodes.programNode(
      program.metadata,
      program.accounts
        .map((account) => visit(account, this))
        .filter(nodes.removeNullAndAssertNodeFilter(nodes.assertAccountNode)),
      program.instructions
        .map((instruction) => visit(instruction, this))
        .filter(
          nodes.removeNullAndAssertNodeFilter(nodes.assertInstructionNode)
        ),
      program.definedTypes
        .map((type) => visit(type, this))
        .filter(
          nodes.removeNullAndAssertNodeFilter(nodes.assertDefinedTypeNode)
        ),
      program.errors
        .map((error) => visit(error, this))
        .filter(nodes.removeNullAndAssertNodeFilter(nodes.assertErrorNode))
    );
  }

  visitAccount(account: nodes.AccountNode): nodes.Node | null {
    const accountType = visit(account.type, this);
    if (accountType === null) return null;
    nodes.assertStructOrLinkTypeNode(accountType);
    const seeds = account.metadata.seeds
      .map((seed) => {
        if (seed.kind !== 'variable') return seed;
        const newType = visit(seed.type, this);
        if (newType === null) return null;
        nodes.assertTypeNode(newType);
        return { ...seed, type: newType };
      })
      .filter((s): s is nodes.AccountNodeSeed => s !== null);
    const gpaFields = account.metadata.gpaFields
      .map((gpaField) => {
        const newType = visit(gpaField.type, this);
        if (newType === null) return null;
        nodes.assertTypeNode(newType);
        return { ...gpaField, type: newType };
      })
      .filter((f): f is nodes.AccountNodeGpaField => f !== null);
    return new nodes.accountNode(
      { ...account.metadata, seeds, gpaFields },
      accountType
    );
  }

  visitInstruction(instruction: nodes.InstructionNode): nodes.Node | null {
    const args = visit(instruction.args, this);
    nodes.assertStructOrLinkTypeNode(args);
    const extraArgs = visit(instruction.extraArgs, this);
    nodes.assertStructOrLinkTypeNode(extraArgs);
    return new nodes.instructionNode(
      instruction.metadata,
      instruction.accounts,
      args,
      extraArgs,
      instruction.subInstructions
        .map((ix) => visit(ix, this))
        .filter(
          nodes.removeNullAndAssertNodeFilter(nodes.assertInstructionNode)
        )
    );
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): nodes.Node | null {
    const type = visit(definedType.type, this);
    if (type === null) return null;
    nodes.assertTypeNode(type);
    return new nodes.definedTypeNode(definedType.metadata, type);
  }

  visitError(error: nodes.ErrorNode): nodes.Node | null {
    return error;
  }

  visitTypeArray(typeArray: nodes.ArrayTypeNode): nodes.Node | null {
    const item = visit(typeArray.item, this);
    if (item === null) return null;
    nodes.assertTypeNode(item);
    return new nodes.arrayTypeNode(item, { ...typeArray });
  }

  visitTypeDefinedLink(typeDefinedLink: nodes.LinkTypeNode): nodes.Node | null {
    return typeDefinedLink;
  }

  visitTypeEnum(typeEnum: nodes.EnumTypeNode): nodes.Node | null {
    const variants = typeEnum.variants
      .map((variant): nodes.EnumVariantTypeNode | null => {
        const newVariant = visit(variant, this);
        if (newVariant === null) return null;
        nodes.assertEnumVariantTypeNode(newVariant);
        return newVariant;
      })
      .filter((v): v is nodes.EnumVariantTypeNode => v !== null);

    return new nodes.enumTypeNode(typeEnum.name, variants);
  }

  visitTypeEnumEmptyVariant(
    typeEnumEmptyVariant: nodes.EnumEmptyVariantTypeNode
  ): nodes.Node | null {
    return typeEnumEmptyVariant;
  }

  visitTypeEnumStructVariant(
    typeEnumStructVariant: nodes.EnumStructVariantTypeNode
  ): nodes.Node | null {
    const newStruct = visit(typeEnumStructVariant.struct, this);
    if (!newStruct) return null;
    nodes.assertStructTypeNode(newStruct);
    return new nodes.enumStructVariantTypeNode(
      typeEnumStructVariant.name,
      newStruct
    );
  }

  visitTypeEnumTupleVariant(
    typeEnumTupleVariant: nodes.EnumTupleVariantTypeNode
  ): nodes.Node | null {
    const newTuple = visit(typeEnumTupleVariant.tuple, this);
    if (!newTuple) return null;
    nodes.assertTupleTypeNode(newTuple);
    return new nodes.enumTupleVariantTypeNode(
      typeEnumTupleVariant.name,
      newTuple
    );
  }

  visitTypeMap(typeMap: nodes.MapTypeNode): nodes.Node | null {
    const key = visit(typeMap.key, this);
    const value = visit(typeMap.value, this);
    if (key === null || value === null) return null;
    nodes.assertTypeNode(key);
    nodes.assertTypeNode(value);
    return new nodes.mapTypeNode(key, value, { ...typeMap });
  }

  visitTypeOption(typeOption: nodes.OptionTypeNode): nodes.Node | null {
    const item = visit(typeOption.item, this);
    if (item === null) return null;
    nodes.assertTypeNode(item);
    return new nodes.optionTypeNode(item, { ...typeOption });
  }

  visitTypeSet(typeSet: nodes.SetTypeNode): nodes.Node | null {
    const item = visit(typeSet.item, this);
    if (item === null) return null;
    nodes.assertTypeNode(item);
    return new nodes.setTypeNode(item, { ...typeSet });
  }

  visitTypeStruct(typeStruct: nodes.StructTypeNode): nodes.Node | null {
    const fields = typeStruct.fields
      .map((field): nodes.StructFieldTypeNode | null => {
        const newField = visit(field, this);
        if (newField === null) return null;
        nodes.assertStructFieldTypeNode(newField);
        return newField;
      })
      .filter((field): field is nodes.StructFieldTypeNode => field !== null);

    return new nodes.structTypeNode(typeStruct.name, fields);
  }

  visitTypeStructField(
    typeStructField: nodes.StructFieldTypeNode
  ): nodes.Node | null {
    const newType = visit(typeStructField.type, this);
    if (newType === null) return null;
    nodes.assertTypeNode(newType);
    return new nodes.structFieldTypeNode(typeStructField.metadata, newType);
  }

  visitTypeTuple(typeTuple: nodes.TupleTypeNode): nodes.Node | null {
    const items = typeTuple.items
      .map((item) => {
        const newItem = visit(item, this);
        if (newItem === null) return null;
        nodes.assertTypeNode(newItem);
        return newItem;
      })
      .filter((type): type is nodes.TypeNode => type !== null);

    return new nodes.tupleTypeNode(items);
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
    const item = visit(typeNumberWrapper.item, this);
    if (item === null) return null;
    nodes.assertNumberTypeNode(item);
    return new nodes.numberWrapperTypeNode(item, typeNumberWrapper.wrapper);
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
