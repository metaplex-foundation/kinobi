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
    const children = root.programs.map((program) => visit(program, this));
    return `${ROOT_PREFIX}(${children.join(',')})`;
  }

  visitProgram(program: nodes.ProgramNode): string {
    const children = [
      ...program.accounts.map((account) => visit(account, this)),
      ...program.instructionsWithSubs.map((ix) => visit(ix, this)),
      ...program.definedTypes.map((type) => visit(type, this)),
      ...program.errors.map((type) => visit(type, this)),
    ];
    return `${PROGRAM_PREFIX}[${program.name}](${children.join(',')})`;
  }

  visitAccount(account: nodes.AccountNode): string {
    const child = visit(account.type, this);
    return `${ACCOUNT_PREFIX}[${account.name}](${child})`;
  }

  visitInstruction(instruction: nodes.InstructionNode): string {
    const accounts = instruction.accounts.map((account) => account.name);
    const args = visit(instruction.args, this);
    const extraArgs = instruction.extraArgs?.accept(this);
    const extraArgsString = extraArgs ? `,extraArgs:(${extraArgs})` : '';
    return (
      `${INSTRUCTION_PREFIX}[${instruction.name}](` +
      `accounts:(${accounts.join(',')}),` +
      `args:(${args})${extraArgsString})`
    );
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): string {
    const child = visit(definedType.type, this);
    return `${TYPE_PREFIX}[${definedType.name}](${child})`;
  }

  visitError(error: nodes.ErrorNode): string {
    return `${ERROR_PREFIX}[${error.name}]`;
  }

  visitTypeArray(typeArray: nodes.ArrayTypeNode): string {
    const item = visit(typeArray.item, this);
    const size = this.displayArrayLikeSize(typeArray.size);
    return `array(${item};${size})`;
  }

  visitTypeDefinedLink(typeDefinedLink: nodes.LinkTypeNode): string {
    return `link(${typeDefinedLink.name};${typeDefinedLink.importFrom})`;
  }

  visitTypeEnum(typeEnum: nodes.EnumTypeNode): string {
    const children = typeEnum.variants.map((variant) => visit(variant, this));
    return `enum[${typeEnum.name}](${children.join(',')})`;
  }

  visitTypeEnumEmptyVariant(
    typeEnumEmptyVariant: nodes.EnumEmptyVariantTypeNode
  ): string {
    return typeEnumEmptyVariant.name;
  }

  visitTypeEnumStructVariant(
    typeEnumStructVariant: nodes.EnumStructVariantTypeNode
  ): string {
    const child = visit(typeEnumStructVariant.struct, this);
    return `${typeEnumStructVariant.name}:${child}`;
  }

  visitTypeEnumTupleVariant(
    typeEnumTupleVariant: nodes.EnumTupleVariantTypeNode
  ): string {
    const child = visit(typeEnumTupleVariant.tuple, this);
    return `${typeEnumTupleVariant.name}:${child}`;
  }

  visitTypeMap(typeMap: nodes.MapTypeNode): string {
    const key = visit(typeMap.key, this);
    const value = visit(typeMap.value, this);
    const size = this.displayArrayLikeSize(typeMap.size);
    return `map(${key},${value};${size})`;
  }

  visitTypeOption(typeOption: nodes.OptionTypeNode): string {
    const item = visit(typeOption.item, this);
    const prefix = visit(typeOption.prefix, this);
    const fixed = typeOption.fixed ? ';fixed' : '';
    return `option(${item};${prefix + fixed})`;
  }

  visitTypeSet(typeSet: nodes.SetTypeNode): string {
    const item = visit(typeSet.item, this);
    const size = this.displayArrayLikeSize(typeSet.size);
    return `set(${item};${size})`;
  }

  visitTypeStruct(typeStruct: nodes.StructTypeNode): string {
    const children = typeStruct.fields.map((field) => visit(field, this));
    return `struct[${typeStruct.name}](${children.join(',')})`;
  }

  visitTypeStructField(typeStructField: nodes.StructFieldTypeNode): string {
    const child = visit(typeStructField.type, this);
    return `${typeStructField.name}:${child}`;
  }

  visitTypeTuple(typeTuple: nodes.TupleTypeNode): string {
    const children = typeTuple.items.map((item) => visit(item, this));
    return `tuple(${children.join(',')})`;
  }

  visitTypeBool(typeBool: nodes.BoolTypeNode): string {
    return typeBool.toString();
  }

  visitTypeBytes(typeBytes: nodes.BytesTypeNode): string {
    return typeBytes.toString();
  }

  visitTypeNumber(typeNumber: nodes.NumberTypeNode): string {
    return typeNumber.toString();
  }

  visitTypeNumberWrapper(
    typeNumberWrapper: nodes.NumberWrapperTypeNode
  ): string {
    const item = visit(typeNumberWrapper.item, this);
    const { wrapper } = typeNumberWrapper;
    switch (wrapper.kind) {
      case 'DateTime':
        return `DateTime(${item})`;
      case 'Amount':
        return `Amount(${item},${wrapper.identifier},${wrapper.decimals})`;
      case 'SolAmount':
        return `SolAmount(${item})`;
      default:
        return item;
    }
  }

  visitTypePublicKey(): string {
    return 'publicKey';
  }

  visitTypeString(typeString: nodes.StringTypeNode): string {
    return typeString.toString();
  }

  displayArrayLikeSize(size: nodes.ArrayTypeNode['size']): string {
    if (size.kind === 'fixed') return `${size.size}`;
    if (size.kind === 'prefixed') return visit(size.prefix, this);
    return 'remainder';
  }
}
