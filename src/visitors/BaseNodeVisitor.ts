import { AccountSeed } from '../shared';
import { Visitor, visit } from './Visitor';
import * as nodes from '../nodes';

export class BaseNodeVisitor implements Visitor<nodes.Node> {
  visitRoot(root: nodes.RootNode): nodes.Node {
    return nodes.rootNode(
      root.programs
        .map((program) => visit(program, this))
        .filter(nodes.assertNodeFilter(nodes.assertProgramNode))
    );
  }

  visitProgram(program: nodes.ProgramNode): nodes.Node {
    return nodes.programNode({
      ...program,
      accounts: program.accounts
        .map((account) => visit(account, this))
        .filter(nodes.assertNodeFilter(nodes.assertAccountNode)),
      instructions: program.instructions
        .map((instruction) => visit(instruction, this))
        .filter(nodes.assertNodeFilter(nodes.assertInstructionNode)),
      definedTypes: program.definedTypes
        .map((type) => visit(type, this))
        .filter(nodes.assertNodeFilter(nodes.assertDefinedTypeNode)),
      errors: program.errors
        .map((error) => visit(error, this))
        .filter(nodes.assertNodeFilter(nodes.assertErrorNode)),
    });
  }

  visitAccount(account: nodes.AccountNode): nodes.Node {
    const data = visit(account.data, this);
    nodes.assertAccountDataNode(data);
    const seeds = account.seeds
      .map((seed) => {
        if (seed.kind !== 'variable') return seed;
        const newType = visit(seed.type, this);
        nodes.assertTypeNode(newType);
        return { ...seed, type: newType };
      })
      .filter((s): s is AccountSeed => s !== null);
    return nodes.accountNode({ ...account, data, seeds });
  }

  visitAccountData(accountData: nodes.AccountDataNode): nodes.Node {
    const struct = visit(accountData.struct, this);
    nodes.assertStructTypeNode(struct);
    const link = accountData.link ? visit(accountData.link, this) : undefined;
    if (link !== undefined) nodes.assertLinkTypeNode(link);
    return nodes.accountDataNode({ ...accountData, struct, link });
  }

  visitInstruction(instruction: nodes.InstructionNode): nodes.Node {
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
        .filter(nodes.assertNodeFilter(nodes.assertInstructionAccountNode)),
      subInstructions: instruction.subInstructions
        .map((ix) => visit(ix, this))
        .filter(nodes.assertNodeFilter(nodes.assertInstructionNode)),
    });
  }

  visitInstructionAccount(
    instructionAccount: nodes.InstructionAccountNode
  ): nodes.Node {
    return instructionAccount;
  }

  visitInstructionDataArgs(
    instructionDataArgs: nodes.InstructionDataArgsNode
  ): nodes.Node {
    const struct = visit(instructionDataArgs.struct, this);
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
    instructionExtraArgs: nodes.InstructionExtraArgsNode
  ): nodes.Node {
    const struct = visit(instructionExtraArgs.struct, this);
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

  visitDefinedType(definedType: nodes.DefinedTypeNode): nodes.Node {
    const data = visit(definedType.data, this);
    nodes.assertTypeNode(data);
    return nodes.definedTypeNode({ ...definedType, data });
  }

  visitError(error: nodes.ErrorNode): nodes.Node {
    return error;
  }

  visitArrayType(arrayType: nodes.ArrayTypeNode): nodes.Node {
    const child = visit(arrayType.child, this);
    nodes.assertTypeNode(child);
    return nodes.arrayTypeNode(child, { ...arrayType });
  }

  visitLinkType(linkType: nodes.LinkTypeNode): nodes.Node {
    return linkType;
  }

  visitEnumType(enumType: nodes.EnumTypeNode): nodes.Node {
    return nodes.enumTypeNode(
      enumType.variants
        .map((variant) => visit(variant, this))
        .filter(nodes.assertNodeFilter(nodes.assertEnumVariantTypeNode)),
      { ...enumType }
    );
  }

  visitEnumEmptyVariantType(
    enumEmptyVariantType: nodes.EnumEmptyVariantTypeNode
  ): nodes.Node {
    return enumEmptyVariantType;
  }

  visitEnumStructVariantType(
    enumStructVariantType: nodes.EnumStructVariantTypeNode
  ): nodes.Node {
    const newStruct = visit(enumStructVariantType.struct, this);
    nodes.assertStructTypeNode(newStruct);
    return nodes.enumStructVariantTypeNode(
      enumStructVariantType.name,
      newStruct
    );
  }

  visitEnumTupleVariantType(
    enumTupleVariantType: nodes.EnumTupleVariantTypeNode
  ): nodes.Node {
    const newTuple = visit(enumTupleVariantType.tuple, this);
    nodes.assertTupleTypeNode(newTuple);
    return nodes.enumTupleVariantTypeNode(enumTupleVariantType.name, newTuple);
  }

  visitMapType(mapType: nodes.MapTypeNode): nodes.Node {
    const key = visit(mapType.key, this);
    const value = visit(mapType.value, this);
    nodes.assertTypeNode(key);
    nodes.assertTypeNode(value);
    return nodes.mapTypeNode(key, value, { ...mapType });
  }

  visitOptionType(optionType: nodes.OptionTypeNode): nodes.Node {
    const child = visit(optionType.child, this);
    nodes.assertTypeNode(child);
    return nodes.optionTypeNode(child, { ...optionType });
  }

  visitSetType(setType: nodes.SetTypeNode): nodes.Node {
    const child = visit(setType.child, this);
    nodes.assertTypeNode(child);
    return nodes.setTypeNode(child, { ...setType });
  }

  visitStructType(structType: nodes.StructTypeNode): nodes.Node {
    return nodes.structTypeNode(
      structType.fields
        .map((field) => visit(field, this))
        .filter(nodes.assertNodeFilter(nodes.assertStructFieldTypeNode))
    );
  }

  visitStructFieldType(structFieldType: nodes.StructFieldTypeNode): nodes.Node {
    const child = visit(structFieldType.child, this);
    nodes.assertTypeNode(child);
    return nodes.structFieldTypeNode({ ...structFieldType, child });
  }

  visitTupleType(tupleType: nodes.TupleTypeNode): nodes.Node {
    return nodes.tupleTypeNode(
      tupleType.children
        .map((child) => visit(child, this))
        .filter(nodes.assertNodeFilter(nodes.assertTypeNode))
    );
  }

  visitBoolType(boolType: nodes.BoolTypeNode): nodes.Node {
    return boolType;
  }

  visitBytesType(bytesType: nodes.BytesTypeNode): nodes.Node {
    return bytesType;
  }

  visitNumberType(numberType: nodes.NumberTypeNode): nodes.Node {
    return numberType;
  }

  visitNumberWrapperType(
    numberWrapperType: nodes.NumberWrapperTypeNode
  ): nodes.Node {
    const number = visit(numberWrapperType.number, this);
    nodes.assertNumberTypeNode(number);
    return nodes.numberWrapperTypeNode(number, numberWrapperType.wrapper);
  }

  visitPublicKeyType(publicKeyType: nodes.PublicKeyTypeNode): nodes.Node {
    return publicKeyType;
  }

  visitStringType(stringType: nodes.StringTypeNode): nodes.Node {
    return stringType;
  }
}
