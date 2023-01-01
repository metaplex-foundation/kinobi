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
    nodes.assertTypeStructNode(accountType);
    return new nodes.AccountNode(account.metadata, accountType);
  }

  visitInstruction(instruction: nodes.InstructionNode): nodes.Node | null {
    const args = instruction.args.accept(this);
    if (args === null) return null;
    nodes.assertTypeStructNode(args);
    return new nodes.InstructionNode(
      instruction.metadata,
      instruction.accounts,
      args
    );
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): nodes.Node | null {
    const type = definedType.type.accept(this);
    if (type === null) return null;
    nodes.assertTypeStructOrEnumNode(type);
    return new nodes.DefinedTypeNode(definedType.metadata, type);
  }

  visitError(error: nodes.ErrorNode): nodes.Node | null {
    return error;
  }

  visitTypeArray(typeArray: nodes.TypeArrayNode): nodes.Node | null {
    const type = typeArray.itemType.accept(this);
    if (type === null) return null;
    nodes.assertTypeNode(type);
    return new nodes.TypeArrayNode(type, typeArray.size);
  }

  visitTypeDefinedLink(
    typeDefinedLink: nodes.TypeDefinedLinkNode
  ): nodes.Node | null {
    return typeDefinedLink;
  }

  visitTypeEnum(typeEnum: nodes.TypeEnumNode): nodes.Node | null {
    const variants = typeEnum.variants
      .map((variant): nodes.TypeEnumNodeVariant | null => {
        if (variant.kind === 'struct') {
          const newType = variant.type.accept(this);
          if (newType === null) return null;
          nodes.assertTypeStructNode(newType);
          return { ...variant, type: newType };
        }
        if (variant.kind === 'tuple') {
          const newType = variant.type.accept(this);
          if (newType === null) return null;
          nodes.assertTypeTupleNode(newType);
          return { ...variant, type: newType };
        }
        return variant;
      })
      .filter((v): v is nodes.TypeEnumNodeVariant => v !== null);

    return new nodes.TypeEnumNode(typeEnum.name, variants);
  }

  visitTypeLeaf(typeLeaf: nodes.TypeLeafNode): nodes.Node | null {
    return typeLeaf;
  }

  visitTypeMap(typeMap: nodes.TypeMapNode): nodes.Node | null {
    const keyType = typeMap.keyType.accept(this);
    const valueType = typeMap.valueType.accept(this);
    if (keyType === null || valueType === null) return null;
    nodes.assertTypeNode(keyType);
    nodes.assertTypeNode(valueType);
    return new nodes.TypeMapNode(typeMap.mapType, keyType, valueType);
  }

  visitTypeOption(typeOption: nodes.TypeOptionNode): nodes.Node | null {
    const type = typeOption.type.accept(this);
    if (type === null) return null;
    nodes.assertTypeNode(type);
    return new nodes.TypeOptionNode(typeOption.optionType, type);
  }

  visitTypeSet(typeSet: nodes.TypeSetNode): nodes.Node | null {
    const type = typeSet.type.accept(this);
    if (type === null) return null;
    nodes.assertTypeNode(type);
    return new nodes.TypeSetNode(typeSet.setType, type);
  }

  visitTypeStruct(typeStruct: nodes.TypeStructNode): nodes.Node | null {
    const fields = typeStruct.fields
      .map((field): nodes.TypeStructNodeField | null => {
        const fieldType = field.type.accept(this);
        if (fieldType === null) return null;
        nodes.assertTypeNode(fieldType);
        return { ...field, type: fieldType };
      })
      .filter((field): field is nodes.TypeStructNodeField => field !== null);

    return new nodes.TypeStructNode(typeStruct.name, fields);
  }

  visitTypeTuple(typeTuple: nodes.TypeTupleNode): nodes.Node | null {
    const items = typeTuple.itemTypes
      .map((type) => {
        const newType = type.accept(this);
        if (newType === null) return null;
        nodes.assertTypeNode(newType);
        return newType;
      })
      .filter((type): type is nodes.TypeNode => type !== null);

    return new nodes.TypeTupleNode(items);
  }

  visitTypeVec(typeVec: nodes.TypeVecNode): nodes.Node | null {
    const type = typeVec.itemType.accept(this);
    if (type === null) return null;
    nodes.assertTypeNode(type);
    return new nodes.TypeVecNode(type);
  }
}
