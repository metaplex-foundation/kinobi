import { AccountSeed } from '../shared';
import { Visitor, visit } from './Visitor';
import * as nodes from '../nodes';

export class BaseNodeOrNullVisitor implements Visitor<nodes.Node | null> {
  visitRoot(
    this: Visitor<nodes.Node | null>,
    root: nodes.RootNode
  ): nodes.Node | null {
    return nodes.rootNode(
      root.programs
        .map((program) => visit(program, this))
        .filter(nodes.removeNullAndAssertNodeFilter(nodes.assertProgramNode))
    );
  }

  visitProgram(
    this: Visitor<nodes.Node | null>,
    program: nodes.ProgramNode
  ): nodes.Node | null {
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

  visitAccount(
    this: Visitor<nodes.Node | null>,
    account: nodes.AccountNode
  ): nodes.Node | null {
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

  visitAccountData(
    this: Visitor<nodes.Node | null>,
    accountData: nodes.AccountDataNode
  ): nodes.Node | null {
    const struct = visit(accountData.struct, this);
    if (struct === null) return null;
    nodes.assertStructTypeNode(struct);
    const link = accountData.link ? visit(accountData.link, this) : undefined;
    if (link !== undefined) nodes.assertLinkTypeNode(link);
    return nodes.accountDataNode({ ...accountData, struct, link });
  }

  visitInstruction(
    this: Visitor<nodes.Node | null>,
    instruction: nodes.InstructionNode
  ): nodes.Node | null {
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
    this: Visitor<nodes.Node | null>,
    instructionAccount: nodes.InstructionAccountNode
  ): nodes.Node | null {
    return instructionAccount;
  }

  visitInstructionDataArgs(
    this: Visitor<nodes.Node | null>,
    instructionDataArgs: nodes.InstructionDataArgsNode
  ): nodes.Node | null {
    const struct = visit(instructionDataArgs.struct, this);
    if (struct === null) return null;
    nodes.assertStructTypeNode(struct);
    const link = instructionDataArgs.link
      ? visit(instructionDataArgs.link, this)
      : undefined;
    if (link !== undefined) nodes.assertLinkTypeNode(link);
    return nodes.instructionDataArgsNode({
      ...instructionDataArgs,
      struct,
      link,
    });
  }

  visitInstructionExtraArgs(
    this: Visitor<nodes.Node | null>,
    instructionExtraArgs: nodes.InstructionExtraArgsNode
  ): nodes.Node | null {
    const struct = visit(instructionExtraArgs.struct, this);
    if (struct === null) return null;
    nodes.assertStructTypeNode(struct);
    const link = instructionExtraArgs.link
      ? visit(instructionExtraArgs.link, this)
      : undefined;
    if (link !== undefined) nodes.assertLinkTypeNode(link);
    return nodes.instructionExtraArgsNode({
      ...instructionExtraArgs,
      struct,
      link,
    });
  }

  visitDefinedType(
    this: Visitor<nodes.Node | null>,
    definedType: nodes.DefinedTypeNode
  ): nodes.Node | null {
    const data = visit(definedType.data, this);
    if (data === null) return null;
    nodes.assertTypeNode(data);
    return nodes.definedTypeNode({ ...definedType, data });
  }

  visitError(
    this: Visitor<nodes.Node | null>,
    error: nodes.ErrorNode
  ): nodes.Node | null {
    return error;
  }

  visitArrayType(
    this: Visitor<nodes.Node | null>,
    arrayType: nodes.ArrayTypeNode
  ): nodes.Node | null {
    const child = visit(arrayType.child, this);
    if (child === null) return null;
    nodes.assertTypeNode(child);
    return nodes.arrayTypeNode(child, { ...arrayType });
  }

  visitLinkType(
    this: Visitor<nodes.Node | null>,
    linkType: nodes.LinkTypeNode
  ): nodes.Node | null {
    return linkType;
  }

  visitEnumType(
    this: Visitor<nodes.Node | null>,
    enumType: nodes.EnumTypeNode
  ): nodes.Node | null {
    return nodes.enumTypeNode(
      enumType.variants
        .map((variant) => visit(variant, this))
        .filter(
          nodes.removeNullAndAssertNodeFilter(nodes.assertEnumVariantTypeNode)
        ),
      { ...enumType }
    );
  }

  visitEnumEmptyVariantType(
    this: Visitor<nodes.Node | null>,
    enumEmptyVariantType: nodes.EnumEmptyVariantTypeNode
  ): nodes.Node | null {
    return enumEmptyVariantType;
  }

  visitEnumStructVariantType(
    this: Visitor<nodes.Node | null>,
    enumStructVariantType: nodes.EnumStructVariantTypeNode
  ): nodes.Node | null {
    const newStruct = visit(enumStructVariantType.struct, this);
    if (!newStruct) return null;
    nodes.assertStructTypeNode(newStruct);
    return nodes.enumStructVariantTypeNode(
      enumStructVariantType.name,
      newStruct
    );
  }

  visitEnumTupleVariantType(
    this: Visitor<nodes.Node | null>,
    enumTupleVariantType: nodes.EnumTupleVariantTypeNode
  ): nodes.Node | null {
    const newTuple = visit(enumTupleVariantType.tuple, this);
    if (!newTuple) return null;
    nodes.assertTupleTypeNode(newTuple);
    return nodes.enumTupleVariantTypeNode(enumTupleVariantType.name, newTuple);
  }

  visitMapType(
    this: Visitor<nodes.Node | null>,
    mapType: nodes.MapTypeNode
  ): nodes.Node | null {
    const key = visit(mapType.key, this);
    const value = visit(mapType.value, this);
    if (key === null || value === null) return null;
    nodes.assertTypeNode(key);
    nodes.assertTypeNode(value);
    return nodes.mapTypeNode(key, value, { ...mapType });
  }

  visitOptionType(
    this: Visitor<nodes.Node | null>,
    optionType: nodes.OptionTypeNode
  ): nodes.Node | null {
    const child = visit(optionType.child, this);
    if (child === null) return null;
    nodes.assertTypeNode(child);
    return nodes.optionTypeNode(child, { ...optionType });
  }

  visitSetType(
    this: Visitor<nodes.Node | null>,
    setType: nodes.SetTypeNode
  ): nodes.Node | null {
    const child = visit(setType.child, this);
    if (child === null) return null;
    nodes.assertTypeNode(child);
    return nodes.setTypeNode(child, { ...setType });
  }

  visitStructType(
    this: Visitor<nodes.Node | null>,
    structType: nodes.StructTypeNode
  ): nodes.Node | null {
    return nodes.structTypeNode(
      structType.fields
        .map((field) => visit(field, this))
        .filter(
          nodes.removeNullAndAssertNodeFilter(nodes.assertStructFieldTypeNode)
        )
    );
  }

  visitStructFieldType(
    this: Visitor<nodes.Node | null>,
    structFieldType: nodes.StructFieldTypeNode
  ): nodes.Node | null {
    const child = visit(structFieldType.child, this);
    if (child === null) return null;
    nodes.assertTypeNode(child);
    return nodes.structFieldTypeNode({ ...structFieldType, child });
  }

  visitTupleType(
    this: Visitor<nodes.Node | null>,
    tupleType: nodes.TupleTypeNode
  ): nodes.Node | null {
    return nodes.tupleTypeNode(
      tupleType.children
        .map((child) => visit(child, this))
        .filter(nodes.removeNullAndAssertNodeFilter(nodes.assertTypeNode))
    );
  }

  visitBoolType(
    this: Visitor<nodes.Node | null>,
    boolType: nodes.BoolTypeNode
  ): nodes.Node | null {
    return boolType;
  }

  visitBytesType(
    this: Visitor<nodes.Node | null>,
    bytesType: nodes.BytesTypeNode
  ): nodes.Node | null {
    return bytesType;
  }

  visitNumberType(
    this: Visitor<nodes.Node | null>,
    numberType: nodes.NumberTypeNode
  ): nodes.Node | null {
    return numberType;
  }

  visitAmountType(
    this: Visitor<nodes.Node | null>,
    amountType: nodes.AmountTypeNode
  ): nodes.Node | null {
    const number = visit(amountType.number, this);
    if (number === null) return null;
    nodes.assertNumberTypeNode(number);
    return nodes.amountTypeNode(
      number,
      amountType.identifier,
      amountType.decimals
    );
  }

  visitDateTimeType(
    this: Visitor<nodes.Node | null>,
    numberWrapperType: nodes.DateTimeTypeNode
  ): nodes.Node | null {
    const number = visit(numberWrapperType.number, this);
    if (number === null) return null;
    nodes.assertNumberTypeNode(number);
    return nodes.dateTimeTypeNode(number);
  }

  visitSolAmountType(
    this: Visitor<nodes.Node | null>,
    solAmountType: nodes.SolAmountTypeNode
  ): nodes.Node | null {
    const number = visit(solAmountType.number, this);
    if (number === null) return null;
    nodes.assertNumberTypeNode(number);
    return nodes.solAmountTypeNode(number);
  }

  visitPublicKeyType(
    this: Visitor<nodes.Node | null>,
    publicKeyType: nodes.PublicKeyTypeNode
  ): nodes.Node | null {
    return publicKeyType;
  }

  visitStringType(
    this: Visitor<nodes.Node | null>,
    stringType: nodes.StringTypeNode
  ): nodes.Node | null {
    return stringType;
  }
}
