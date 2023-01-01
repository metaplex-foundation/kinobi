import type * as nodes from '../../nodes';
import { Visitor } from '../Visitor';

const ROOT_PREFIX = 'R';
const PROGRAM_PREFIX = 'P';
const ACCOUNT_PREFIX = 'A';
const INSTRUCTION_PREFIX = 'I';
const TYPE_PREFIX = 'T';
const ERROR_PREFIX = 'E';

export class GetNodeInlineStringVisitor implements Visitor<string> {
  visitRoot(root: nodes.RootNode): string {
    const children = root.programs.map((program) => program.accept(this));
    return `${ROOT_PREFIX}(${children.join(',')})`;
  }

  visitProgram(program: nodes.ProgramNode): string {
    const children = [
      ...program.accounts.map((account) => account.accept(this)),
      ...program.instructions.map((instruction) => instruction.accept(this)),
      ...program.definedTypes.map((type) => type.accept(this)),
      ...program.errors.map((type) => type.accept(this)),
    ];
    return `${PROGRAM_PREFIX}[${program.name}](${children.join(',')})`;
  }

  visitAccount(account: nodes.AccountNode): string {
    const child = account.type.accept(this);
    return `${ACCOUNT_PREFIX}[${account.name}](${child})`;
  }

  visitInstruction(instruction: nodes.InstructionNode): string {
    const accounts = instruction.accounts.map((account) => account.name);
    const args = instruction.args.accept(this);
    return (
      `${INSTRUCTION_PREFIX}[${instruction.name}](` +
      `accounts:(${accounts.join(',')}),` +
      `args:(${args})` +
      `)`
    );
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): string {
    const child = definedType.type.accept(this);
    return `${TYPE_PREFIX}[${definedType.name}](${child})`;
  }

  visitError(error: nodes.ErrorNode): string {
    return `${ERROR_PREFIX}[${error.name}]`;
  }

  visitTypeArray(typeArray: nodes.TypeArrayNode): string {
    const child = typeArray.itemType.accept(this);
    return `array(${typeArray.size};${child})`;
  }

  visitTypeDefinedLink(typeDefinedLink: nodes.TypeDefinedLinkNode): string {
    return `link(${typeDefinedLink.definedType})`;
  }

  visitTypeEnum(typeEnum: nodes.TypeEnumNode): string {
    const children = typeEnum.variants.map((variant) => {
      if (variant.kind === 'empty') return variant.name;
      const child = variant.type.accept(this);
      return `${variant.name}:${child}`;
    });
    return `enum[${typeEnum.name}](${children.join(',')})`;
  }

  visitTypeLeaf(typeLeaf: nodes.TypeLeafNode): string {
    return typeLeaf.type;
  }

  visitTypeMap(typeMap: nodes.TypeMapNode): string {
    const key = typeMap.keyType.accept(this);
    const value = typeMap.valueType.accept(this);
    return `map(${key},${value})`;
  }

  visitTypeOption(typeOption: nodes.TypeOptionNode): string {
    const child = typeOption.type.accept(this);
    return `option(${child})`;
  }

  visitTypeSet(typeSet: nodes.TypeSetNode): string {
    const child = typeSet.type.accept(this);
    return `set(${child})`;
  }

  visitTypeStruct(typeStruct: nodes.TypeStructNode): string {
    const children = typeStruct.fields.map((field) => {
      const child = field.type.accept(this);
      return `${field.name}:${child}`;
    });
    return `struct[${typeStruct.name}](${children.join(',')})`;
  }

  visitTypeTuple(typeTuple: nodes.TypeTupleNode): string {
    const children = typeTuple.itemTypes.map((itemType) =>
      itemType.accept(this)
    );
    return `tuple(${children.join(',')})`;
  }

  visitTypeVec(typeVec: nodes.TypeVecNode): string {
    const child = typeVec.itemType.accept(this);
    return `vec(${child})`;
  }
}
