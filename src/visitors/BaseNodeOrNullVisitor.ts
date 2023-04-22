import { AccountSeed } from '../shared';
import { Visitor, visit } from './Visitor';
import * as nodes from '../nodes';

export class BaseNodeOrNullVisitor implements Visitor<nodes.Node | null> {
  visitRoot(root: nodes.RootNode): nodes.Node | null {
    return nodes.rootNode(
      root.programs
        .map((program) => visit(program, this))
        .filter(nodes.removeNullAndAssertNodeFilter(nodes.assertProgramNode))
    );
  }

  visitProgram(program: nodes.ProgramNode): nodes.Node | null {
    return nodes.programNode({
      ...program,
      accounts: program.accounts
        .map((account) => visit(account, this))
        .filter(nodes.removeNullAndAssertNodeFilter(nodes.assertAccountNode)),
      instructions: program.instructions
        .map((instruction) => visit(instruction, this))
        .filter(
          nodes.removeNullAndAssertNodeFilter(nodes.assertInstructionNode)
        ),
      definedTypes: program.definedTypes
        .map((type) => visit(type, this))
        .filter(
          nodes.removeNullAndAssertNodeFilter(nodes.assertDefinedTypeNode)
        ),
      errors: program.errors
        .map((error) => visit(error, this))
        .filter(nodes.removeNullAndAssertNodeFilter(nodes.assertErrorNode)),
    });
  }

  visitAccount(account: nodes.AccountNode): nodes.Node | null {
    const data = visit(account.data, this);
    if (data === null) return null;
    nodes.assertAccountDataNode(data);
    const seeds = account.seeds
      .map((seed) => {
        if (seed.kind !== 'variable') return seed;
        const newType = visit(seed.type, this);
        if (newType === null) return null;
        nodes.assertTypeNode(newType);
        return { ...seed, type: newType };
      })
      .filter((s): s is AccountSeed => s !== null);
    return nodes.accountNode({ ...account, data, seeds });
  }

  visitAccountData(accountData: nodes.AccountDataNode): nodes.Node | null {
    const struct = visit(accountData.struct, this);
    if (struct === null) return null;
    nodes.assertStructTypeNode(struct);
    const link = accountData.link ? visit(accountData.link, this) : null;
    if (link !== null) nodes.assertLinkTypeNode(link);
    return nodes.accountDataNode(struct, link ?? undefined);
  }

  visitInstruction(instruction: nodes.InstructionNode): nodes.Node | null {
    const dataArgs = visit(instruction.dataArgs, this);
    nodes.assertInstructionDataArgsNode(dataArgs);
    const extraArgs = visit(instruction.extraArgs, this);
    nodes.assertInstructionExtraArgsNode(extraArgs);
    return nodes.instructionNode({
      ...instruction,
      dataArgs,
      extraArgs,
      accounts: instruction.accounts
        .map((account) => visit(account, this))
        .filter(
          nodes.removeNullAndAssertNodeFilter(
            nodes.assertInstructionAccountNode
          )
        ),
      subInstructions: instruction.subInstructions
        .map((ix) => visit(ix, this))
        .filter(
          nodes.removeNullAndAssertNodeFilter(nodes.assertInstructionNode)
        ),
    });
  }

  visitInstructionAccount(
    instructionAccount: nodes.InstructionAccountNode
  ): nodes.Node | null {
    return instructionAccount;
  }

  visitInstructionDataArgs(
    instructionDataArgs: nodes.InstructionDataArgsNode
  ): nodes.Node | null {
    const struct = visit(instructionDataArgs.struct, this);
    if (struct === null) return null;
    nodes.assertStructTypeNode(struct);
    const link = instructionDataArgs.link
      ? visit(instructionDataArgs.link, this)
      : null;
    if (link !== null) nodes.assertLinkTypeNode(link);
    return nodes.accountDataNode(struct, link ?? undefined);
  }

  visitInstructionExtraArgs(
    instructionExtraArgs: nodes.InstructionExtraArgsNode
  ): nodes.Node | null {
    const struct = visit(instructionExtraArgs.struct, this);
    if (struct === null) return null;
    nodes.assertStructTypeNode(struct);
    const link = instructionExtraArgs.link
      ? visit(instructionExtraArgs.link, this)
      : null;
    if (link !== null) nodes.assertLinkTypeNode(link);
    return nodes.accountDataNode(struct, link ?? undefined);
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): nodes.Node | null {
    const data = visit(definedType.data, this);
    if (data === null) return null;
    nodes.assertTypeNode(data);
    return nodes.definedTypeNode({ ...definedType, data });
  }

  visitError(error: nodes.ErrorNode): nodes.Node | null {
    return error;
  }

  visitTypeArray(typeArray: nodes.ArrayTypeNode): nodes.Node | null {
    const child = visit(typeArray.child, this);
    if (child === null) return null;
    nodes.assertTypeNode(child);
    return nodes.arrayTypeNode(child, { ...typeArray });
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

    return nodes.enumTypeNode(typeEnum.name, variants);
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
    return nodes.enumStructVariantTypeNode(
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
    return nodes.enumTupleVariantTypeNode(typeEnumTupleVariant.name, newTuple);
  }

  visitTypeMap(typeMap: nodes.MapTypeNode): nodes.Node | null {
    const key = visit(typeMap.key, this);
    const value = visit(typeMap.value, this);
    if (key === null || value === null) return null;
    nodes.assertTypeNode(key);
    nodes.assertTypeNode(value);
    return nodes.mapTypeNode(key, value, { ...typeMap });
  }

  visitTypeOption(typeOption: nodes.OptionTypeNode): nodes.Node | null {
    const item = visit(typeOption.item, this);
    if (item === null) return null;
    nodes.assertTypeNode(item);
    return nodes.optionTypeNode(item, { ...typeOption });
  }

  visitTypeSet(typeSet: nodes.SetTypeNode): nodes.Node | null {
    const item = visit(typeSet.item, this);
    if (item === null) return null;
    nodes.assertTypeNode(item);
    return nodes.setTypeNode(item, { ...typeSet });
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

    return nodes.structTypeNode(typeStruct.name, fields);
  }

  visitTypeStructField(
    typeStructField: nodes.StructFieldTypeNode
  ): nodes.Node | null {
    const newType = visit(typeStructField.type, this);
    if (newType === null) return null;
    nodes.assertTypeNode(newType);
    return nodes.structFieldTypeNode(typeStructField.metadata, newType);
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

    return nodes.tupleTypeNode(items);
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
    return nodes.numberWrapperTypeNode(item, typeNumberWrapper.wrapper);
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
