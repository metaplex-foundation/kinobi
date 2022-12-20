import type { Visitor } from './Visitor';
import * as nodes from '../nodes';

export class BaseNodeVisitor implements Visitor<nodes.Node> {
  visitRoot(root: nodes.RootNode): nodes.Node {
    return new nodes.RootNode(
      root.idl,
      root.name,
      root.address,
      root.accounts.map((account) => {
        const child = account.accept(this);
        nodes.assertAccountNode(child);
        return child;
      }),
      root.instructions.map((instruction) => {
        const child = instruction.accept(this);
        nodes.assertInstructionNode(child);
        return child;
      }),
      root.definedTypes.map((definedType) => {
        const child = definedType.accept(this);
        nodes.assertDefinedTypeNode(child);
        return child;
      }),
      root.origin,
    );
  }

  visitAccount(account: nodes.AccountNode): nodes.Node {
    const accountType = account.type.accept(this);
    nodes.assertTypeStructNode(accountType);
    return new nodes.AccountNode(account.name, accountType, account.docs);
  }

  visitInstruction(instruction: nodes.InstructionNode): nodes.Node {
    const args = instruction.args.accept(this);
    nodes.assertTypeStructNode(args);
    let discriminator: nodes.InstructionNodeDiscriminator | null = null;
    if (instruction.discriminator) {
      const discriminatorType = instruction.discriminator.type.accept(this);
      nodes.assertTypeLeafNode(discriminatorType);
      discriminator = {
        type: discriminatorType,
        value: instruction.discriminator.value,
      };
    }
    return new nodes.InstructionNode(
      instruction.name,
      instruction.accounts,
      args,
      discriminator,
      instruction.defaultOptionalAccounts,
    );
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): nodes.Node {
    const type = definedType.type.accept(this);
    nodes.assertTypeStructOrEnumNode(type);
    return new nodes.DefinedTypeNode(definedType.name, type, definedType.docs);
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
    const variants = typeEnum.variants.map(
      (variant): nodes.TypeEnumNodeVariant => {
        if (variant.kind === 'struct') {
          const newType = variant.type.accept(this);
          nodes.assertTypeStructNode(newType);
          return { ...variant, type: newType };
        }
        if (variant.kind === 'tuple') {
          const newType = variant.type.accept(this);
          nodes.assertTypeTupleNode(newType);
          return { ...variant, type: newType };
        }
        return variant;
      },
    );
    return new nodes.TypeEnumNode(typeEnum.name, variants);
  }

  visitTypeLeaf(typeLeaf: nodes.TypeLeafNode): nodes.Node {
    return typeLeaf;
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
      typeStruct.fields.map((field): nodes.TypeStructNodeField => {
        const fieldType = field.type.accept(this);
        nodes.assertTypeNode(fieldType);
        return { ...field, type: fieldType };
      }),
    );
  }

  visitTypeTuple(typeTuple: nodes.TypeTupleNode): nodes.Node {
    return new nodes.TypeTupleNode(
      typeTuple.itemTypes.map((type) => {
        const newType = type.accept(this);
        nodes.assertTypeNode(newType);
        return newType;
      }),
    );
  }

  visitTypeVec(typeVec: nodes.TypeVecNode): nodes.Node {
    const type = typeVec.itemType.accept(this);
    nodes.assertTypeNode(type);
    return new nodes.TypeVecNode(type);
  }
}
