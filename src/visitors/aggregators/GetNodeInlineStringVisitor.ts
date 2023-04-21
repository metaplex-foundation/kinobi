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
      ...program.instructionsWithSubs.map((ix) => ix.accept(this)),
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
    const extraArgs = instruction.extraArgs?.accept(this);
    const extraArgsString = extraArgs ? `,extraArgs:(${extraArgs})` : '';
    return (
      `${INSTRUCTION_PREFIX}[${instruction.name}](` +
      `accounts:(${accounts.join(',')}),` +
      `args:(${args})${extraArgsString})`
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
    const item = typeArray.item.accept(this);
    const size = this.displayArrayLikeSize(typeArray.size);
    return `array(${item};${size})`;
  }

  visitTypeDefinedLink(typeDefinedLink: nodes.TypeDefinedLinkNode): string {
    return `link(${typeDefinedLink.name};${typeDefinedLink.importFrom})`;
  }

  visitTypeEnum(typeEnum: nodes.TypeEnumNode): string {
    const children = typeEnum.variants.map((variant) => variant.accept(this));
    return `enum[${typeEnum.name}](${children.join(',')})`;
  }

  visitTypeEnumEmptyVariant(
    typeEnumEmptyVariant: nodes.TypeEnumEmptyVariantNode
  ): string {
    return typeEnumEmptyVariant.name;
  }

  visitTypeEnumStructVariant(
    typeEnumStructVariant: nodes.TypeEnumStructVariantNode
  ): string {
    const child = typeEnumStructVariant.struct.accept(this);
    return `${typeEnumStructVariant.name}:${child}`;
  }

  visitTypeEnumTupleVariant(
    typeEnumTupleVariant: nodes.TypeEnumTupleVariantNode
  ): string {
    const child = typeEnumTupleVariant.tuple.accept(this);
    return `${typeEnumTupleVariant.name}:${child}`;
  }

  visitTypeMap(typeMap: nodes.TypeMapNode): string {
    const key = typeMap.key.accept(this);
    const value = typeMap.value.accept(this);
    const size = this.displayArrayLikeSize(typeMap.size);
    return `map(${key},${value};${size})`;
  }

  visitTypeOption(typeOption: nodes.TypeOptionNode): string {
    const item = typeOption.item.accept(this);
    const prefix = typeOption.prefix.accept(this);
    const fixed = typeOption.fixed ? ';fixed' : '';
    return `option(${item};${prefix + fixed})`;
  }

  visitTypeSet(typeSet: nodes.TypeSetNode): string {
    const item = typeSet.item.accept(this);
    const size = this.displayArrayLikeSize(typeSet.size);
    return `set(${item};${size})`;
  }

  visitTypeStruct(typeStruct: nodes.TypeStructNode): string {
    const children = typeStruct.fields.map((field) => field.accept(this));
    return `struct[${typeStruct.name}](${children.join(',')})`;
  }

  visitTypeStructField(typeStructField: nodes.TypeStructFieldNode): string {
    const child = typeStructField.type.accept(this);
    return `${typeStructField.name}:${child}`;
  }

  visitTypeTuple(typeTuple: nodes.TypeTupleNode): string {
    const children = typeTuple.items.map((item) => item.accept(this));
    return `tuple(${children.join(',')})`;
  }

  visitTypeBool(typeBool: nodes.TypeBoolNode): string {
    return typeBool.toString();
  }

  visitTypeBytes(typeBytes: nodes.TypeBytesNode): string {
    return typeBytes.toString();
  }

  visitTypeNumber(typeNumber: nodes.TypeNumberNode): string {
    return typeNumber.toString();
  }

  visitTypeNumberWrapper(
    typeNumberWrapper: nodes.TypeNumberWrapperNode
  ): string {
    const item = typeNumberWrapper.item.accept(this);
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

  visitTypeString(typeString: nodes.TypeStringNode): string {
    return typeString.toString();
  }

  displayArrayLikeSize(size: nodes.TypeArrayNode['size']): string {
    if (size.kind === 'fixed') return `${size.size}`;
    if (size.kind === 'prefixed') return size.prefix.accept(this);
    return 'remainder';
  }
}
