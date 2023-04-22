import * as nodes from '../../nodes';
import { Visitor, visit } from '../Visitor';

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
      ...nodes.getAllInstructionsWithSubs(program).map((ix) => visit(ix, this)),
      ...program.definedTypes.map((type) => visit(type, this)),
      ...program.errors.map((type) => visit(type, this)),
    ];
    return `${PROGRAM_PREFIX}[${program.name}](${children.join(',')})`;
  }

  visitAccount(account: nodes.AccountNode): string {
    const data = visit(account.data, this);
    return `${ACCOUNT_PREFIX}[${account.name}](${data})`;
  }

  visitAccountData(accountData: nodes.AccountDataNode): string {
    const struct = visit(accountData.struct, this);
    const link = accountData.link ? `;${visit(accountData.link, this)}` : '';
    return struct + link;
  }

  visitInstruction(instruction: nodes.InstructionNode): string {
    const accounts = instruction.accounts.map((account) =>
      visit(account, this)
    );
    const dataArgs = visit(instruction.dataArgs, this);
    const extraArgs = visit(instruction.extraArgs, this);
    return (
      `${INSTRUCTION_PREFIX}[${instruction.name}](` +
      `accounts(${accounts.join(',')}),${dataArgs},${extraArgs}` +
      `)`
    );
  }

  visitInstructionAccount(
    instructionAccount: nodes.InstructionAccountNode
  ): string {
    return instructionAccount.name;
  }

  visitInstructionDataArgs(
    instructionDataArgs: nodes.InstructionDataArgsNode
  ): string {
    const struct = visit(instructionDataArgs.struct, this);
    const link = instructionDataArgs.link
      ? `;${visit(instructionDataArgs.link, this)}`
      : '';
    return `dataArgs(${struct + link})`;
  }

  visitInstructionExtraArgs(
    instructionExtraArgs: nodes.InstructionExtraArgsNode
  ): string {
    const struct = visit(instructionExtraArgs.struct, this);
    const link = instructionExtraArgs.link
      ? `;${visit(instructionExtraArgs.link, this)}`
      : '';
    return `extraArgs(${struct + link})`;
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): string {
    const data = visit(definedType.data, this);
    return `${TYPE_PREFIX}[${definedType.name}](${data})`;
  }

  visitError(error: nodes.ErrorNode): string {
    return `${ERROR_PREFIX}[${error.name}]`;
  }

  visitArrayType(arrayType: nodes.ArrayTypeNode): string {
    const child = visit(arrayType.child, this);
    const size = this.displayArrayLikeSize(arrayType.size);
    return `array(${child};${size})`;
  }

  visitLinkType(definedLinkType: nodes.LinkTypeNode): string {
    return `link(${definedLinkType.name};${definedLinkType.importFrom})`;
  }

  visitEnumType(enumType: nodes.EnumTypeNode): string {
    const children = enumType.variants.map((variant) => visit(variant, this));
    return `enum[${enumType.name}](${children.join(',')})`;
  }

  visitEnumEmptyVariantType(
    enumEmptyVariantType: nodes.EnumEmptyVariantTypeNode
  ): string {
    return enumEmptyVariantType.name;
  }

  visitEnumStructVariantType(
    enumStructVariantType: nodes.EnumStructVariantTypeNode
  ): string {
    const child = visit(enumStructVariantType.struct, this);
    return `${enumStructVariantType.name}:${child}`;
  }

  visitEnumTupleVariantType(
    enumTupleVariantType: nodes.EnumTupleVariantTypeNode
  ): string {
    const child = visit(enumTupleVariantType.tuple, this);
    return `${enumTupleVariantType.name}:${child}`;
  }

  visitMapType(mapType: nodes.MapTypeNode): string {
    const key = visit(mapType.key, this);
    const value = visit(mapType.value, this);
    const size = this.displayArrayLikeSize(mapType.size);
    return `map(${key},${value};${size})`;
  }

  visitOptionType(optionType: nodes.OptionTypeNode): string {
    const child = visit(optionType.child, this);
    const prefix = visit(optionType.prefix, this);
    const fixed = optionType.fixed ? ';fixed' : '';
    return `option(${child};${prefix + fixed})`;
  }

  visitSetType(setType: nodes.SetTypeNode): string {
    const child = visit(setType.child, this);
    const size = this.displayArrayLikeSize(setType.size);
    return `set(${child};${size})`;
  }

  visitStructType(structType: nodes.StructTypeNode): string {
    const children = structType.fields.map((field) => visit(field, this));
    return `struct[${structType.name}](${children.join(',')})`;
  }

  visitStructFieldType(structFieldType: nodes.StructFieldTypeNode): string {
    const child = visit(structFieldType.child, this);
    return `${structFieldType.name}:${child}`;
  }

  visitTupleType(tupleType: nodes.TupleTypeNode): string {
    const children = tupleType.children.map((child) => visit(child, this));
    return `tuple(${children.join(',')})`;
  }

  visitBoolType(boolType: nodes.BoolTypeNode): string {
    return boolType.toString();
  }

  visitBytesType(bytesType: nodes.BytesTypeNode): string {
    return bytesType.toString();
  }

  visitNumberType(numberType: nodes.NumberTypeNode): string {
    return numberType.toString();
  }

  visitNumberWrapperType(
    numberWrapperType: nodes.NumberWrapperTypeNode
  ): string {
    const item = visit(numberWrapperType.number, this);
    const { wrapper } = numberWrapperType;
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

  visitPublicKeyType(): string {
    return 'publicKey';
  }

  visitStringType(stringType: nodes.StringTypeNode): string {
    return stringType.toString();
  }

  displayArrayLikeSize(size: nodes.ArrayTypeNode['size']): string {
    if (size.kind === 'fixed') return `${size.value}`;
    if (size.kind === 'prefixed') return visit(size.prefix, this);
    return 'remainder';
  }
}
