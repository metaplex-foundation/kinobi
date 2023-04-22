import type { Visitor } from './Visitor';
import * as nodes from '../nodes';

export class BaseNodeVisitor implements Visitor<nodes.Node> {
  visitRoot(root: nodes.RootNode): nodes.Node {
    return new nodes.rootNode(
      root.programs
        .map((program) => visit(program, this))
        .filter(nodes.assertNodeFilter(nodes.assertProgramNode))
    );
  }

  visitProgram(program: nodes.ProgramNode): nodes.Node {
    return new nodes.programNode(
      program.metadata,
      program.accounts
        .map((account) => visit(account, this))
        .filter(nodes.assertNodeFilter(nodes.assertAccountNode)),
      program.instructions
        .map((instruction) => visit(instruction, this))
        .filter(nodes.assertNodeFilter(nodes.assertInstructionNode)),
      program.definedTypes
        .map((type) => visit(type, this))
        .filter(nodes.assertNodeFilter(nodes.assertDefinedTypeNode)),
      program.errors
        .map((error) => visit(error, this))
        .filter(nodes.assertNodeFilter(nodes.assertErrorNode))
    );
  }

  visitAccount(account: nodes.AccountNode): nodes.Node {
    const accountType = visit(account.type, this);
    nodes.assertStructOrLinkTypeNode(accountType);
    const seeds = account.metadata.seeds.map((seed) => {
      if (seed.kind !== 'variable') return seed;
      const newType = visit(seed.type, this);
      nodes.assertTypeNode(newType);
      return { ...seed, type: newType };
    });
    const gpaFields = account.metadata.gpaFields.map((gpaField) => {
      const newType = visit(gpaField.type, this);
      nodes.assertTypeNode(newType);
      return { ...gpaField, type: newType };
    });
    return new nodes.accountNode(
      { ...account.metadata, seeds, gpaFields },
      accountType
    );
  }

  visitInstruction(instruction: nodes.InstructionNode): nodes.Node {
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

  visitDefinedType(definedType: nodes.DefinedTypeNode): nodes.Node {
    const type = visit(definedType.type, this);
    nodes.assertTypeNode(type);
    return new nodes.definedTypeNode(definedType.metadata, type);
  }

  visitError(error: nodes.ErrorNode): nodes.Node {
    return error;
  }

  visitTypeArray(typeArray: nodes.ArrayTypeNode): nodes.Node {
    const item = visit(typeArray.item, this);
    nodes.assertTypeNode(item);
    return new nodes.arrayTypeNode(item, { ...typeArray });
  }

  visitTypeDefinedLink(typeDefinedLink: nodes.LinkTypeNode): nodes.Node {
    return typeDefinedLink;
  }

  visitTypeEnum(typeEnum: nodes.EnumTypeNode): nodes.Node {
    return new nodes.enumTypeNode(
      typeEnum.name,
      typeEnum.variants.map((variant) => {
        const newVariant = visit(variant, this);
        nodes.assertEnumVariantTypeNode(newVariant);
        return newVariant;
      })
    );
  }

  visitTypeEnumEmptyVariant(
    typeEnumEmptyVariant: nodes.EnumEmptyVariantTypeNode
  ): nodes.Node {
    return typeEnumEmptyVariant;
  }

  visitTypeEnumStructVariant(
    typeEnumStructVariant: nodes.EnumStructVariantTypeNode
  ): nodes.Node {
    const newStruct = visit(typeEnumStructVariant.struct, this);
    nodes.assertStructTypeNode(newStruct);
    return new nodes.enumStructVariantTypeNode(
      typeEnumStructVariant.name,
      newStruct
    );
  }

  visitTypeEnumTupleVariant(
    typeEnumTupleVariant: nodes.EnumTupleVariantTypeNode
  ): nodes.Node {
    const newTuple = visit(typeEnumTupleVariant.tuple, this);
    nodes.assertTupleTypeNode(newTuple);
    return new nodes.enumTupleVariantTypeNode(
      typeEnumTupleVariant.name,
      newTuple
    );
  }

  visitTypeMap(typeMap: nodes.MapTypeNode): nodes.Node {
    const key = visit(typeMap.key, this);
    nodes.assertTypeNode(key);
    const value = visit(typeMap.value, this);
    nodes.assertTypeNode(value);
    return new nodes.mapTypeNode(key, value, { ...typeMap });
  }

  visitTypeOption(typeOption: nodes.OptionTypeNode): nodes.Node {
    const item = visit(typeOption.item, this);
    nodes.assertTypeNode(item);
    return new nodes.optionTypeNode(item, { ...typeOption });
  }

  visitTypeSet(typeSet: nodes.SetTypeNode): nodes.Node {
    const item = visit(typeSet.item, this);
    nodes.assertTypeNode(item);
    return new nodes.setTypeNode(item, { ...typeSet });
  }

  visitTypeStruct(typeStruct: nodes.StructTypeNode): nodes.Node {
    return new nodes.structTypeNode(
      typeStruct.name,
      typeStruct.fields.map((field): nodes.StructFieldTypeNode => {
        const newField = visit(field, this);
        nodes.assertStructFieldTypeNode(newField);
        return newField;
      })
    );
  }

  visitTypeStructField(typeStructField: nodes.StructFieldTypeNode): nodes.Node {
    const newType = visit(typeStructField.type, this);
    nodes.assertTypeNode(newType);
    return new nodes.structFieldTypeNode(typeStructField.metadata, newType);
  }

  visitTypeTuple(typeTuple: nodes.TupleTypeNode): nodes.Node {
    return new nodes.tupleTypeNode(
      typeTuple.items.map((item) => {
        const newItem = visit(item, this);
        nodes.assertTypeNode(newItem);
        return newItem;
      })
    );
  }

  visitTypeBool(typeBool: nodes.BoolTypeNode): nodes.Node {
    return typeBool;
  }

  visitTypeBytes(typeBytes: nodes.BytesTypeNode): nodes.Node {
    return typeBytes;
  }

  visitTypeNumber(typeNumber: nodes.NumberTypeNode): nodes.Node {
    return typeNumber;
  }

  visitTypeNumberWrapper(
    typeNumberWrapper: nodes.NumberWrapperTypeNode
  ): nodes.Node {
    const item = visit(typeNumberWrapper.item, this);
    nodes.assertNumberTypeNode(item);
    return new nodes.numberWrapperTypeNode(item, typeNumberWrapper.wrapper);
  }

  visitTypePublicKey(typePublicKey: nodes.PublicKeyTypeNode): nodes.Node {
    return typePublicKey;
  }

  visitTypeString(typeString: nodes.StringTypeNode): nodes.Node {
    return typeString;
  }
}
