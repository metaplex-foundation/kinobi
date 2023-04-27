import { displaySizeStrategy } from '../../shared';
import * as nodes from '../../nodes';
import { Visitor, visit } from '../Visitor';

export class GetNodeTreeStringVisitor implements Visitor<string> {
  indent = 0;

  readonly separator: string;

  constructor(separator = '|   ') {
    this.separator = separator;
  }

  visitRoot(root: nodes.RootNode): string {
    this.indent += 1;
    const children = root.programs.map((program) => visit(program, this));
    this.indent -= 1;
    return [this.indented('[RootNode]'), ...children].join('\n');
  }

  visitProgram(program: nodes.ProgramNode): string {
    this.indent += 1;
    const children = [
      ...program.accounts.map((account) => visit(account, this)),
      ...nodes.getAllInstructionsWithSubs(program).map((ix) => visit(ix, this)),
      ...program.definedTypes.map((type) => visit(type, this)),
      ...program.errors.map((type) => visit(type, this)),
    ];
    this.indent -= 1;
    const tags = [];
    if (program.publicKey) tags.push(`publicKey: ${program.publicKey}`);
    if (program.version) tags.push(`version: ${program.version}`);
    if (program.origin) tags.push(`origin: ${program.origin}`);
    const tagsStr = tags.length > 0 ? ` (${tags.join(', ')})` : '';
    return [
      this.indented(`[ProgramNode] ${program.name}${tagsStr}`),
      ...children,
    ].join('\n');
  }

  visitAccount(account: nodes.AccountNode): string {
    const children: string[] = [];
    children.push(this.indented(`[AccountNode] ${account.name}`));
    this.indent += 1;
    if (account.size !== undefined) {
      children.push(this.indented(`size: ${account.size}`));
    }
    if (account.seeds.length > 0) {
      children.push(this.indented('seeds:'));
      this.indent += 1;
      children.push(
        ...account.seeds.map((seed) => {
          if (seed.kind === 'programId') return this.indented('programId');
          if (seed.kind === 'constant') {
            if (seed.value.kind === 'string') {
              return this.indented(`"${seed.value.value}"`);
            }
            if (seed.value.kind === 'number' || seed.value.kind === 'boolean') {
              return this.indented(`${seed.value.value}`);
            }
            return this.indented(`[${seed.value.kind}]`);
          }
          this.indent += 1;
          const type = visit(seed.type, this);
          this.indent -= 1;
          return [
            this.indented(`${seed.name} (${seed.docs.join(' ')})`),
            type,
          ].join('\n');
        })
      );
      this.indent -= 1;
    }
    children.push(visit(account.data, this));
    this.indent -= 1;
    return children.join('\n');
  }

  visitAccountData(accountData: nodes.AccountDataNode): string {
    const children: string[] = [];
    this.indent += 1;
    children.push(visit(accountData.struct, this));
    if (accountData.link) {
      children.push(visit(accountData.link, this));
    }
    this.indent -= 1;
    return [this.indented('[AccountDataNode]'), ...children].join('\n');
  }

  visitInstruction(instruction: nodes.InstructionNode): string {
    const children: string[] = [];
    children.push(this.indented(`[InstructionNode] ${instruction.name}`));
    this.indent += 1;
    children.push(this.indented('accounts:'));
    this.indent += 1;
    children.push(
      ...instruction.accounts.map((account) => visit(account, this))
    );
    this.indent -= 1;
    children.push(visit(instruction.dataArgs, this));
    children.push(visit(instruction.extraArgs, this));
    this.indent -= 1;
    return children.join('\n');
  }

  visitInstructionAccount(
    instructionAccount: nodes.InstructionAccountNode
  ): string {
    const tags = [];
    if (instructionAccount.isWritable) tags.push('writable');
    if (instructionAccount.isSigner) tags.push('signer');
    if (instructionAccount.isOptional) tags.push('optional');
    if (instructionAccount.defaultsTo)
      tags.push(`defaults to ${instructionAccount.defaultsTo.kind}`);
    const tagsAsString = tags.length > 0 ? ` (${tags.join(', ')})` : '';
    return this.indented(instructionAccount.name + tagsAsString);
  }

  visitInstructionDataArgs(
    instructionDataArgs: nodes.InstructionDataArgsNode
  ): string {
    const children: string[] = [];
    this.indent += 1;
    children.push(visit(instructionDataArgs.struct, this));
    if (instructionDataArgs.link) {
      children.push(visit(instructionDataArgs.link, this));
    }
    this.indent -= 1;
    return [this.indented('[InstructionDataArgsNode]'), ...children].join('\n');
  }

  visitInstructionExtraArgs(
    instructionExtraArgs: nodes.InstructionExtraArgsNode
  ): string {
    const children: string[] = [];
    this.indent += 1;
    children.push(visit(instructionExtraArgs.struct, this));
    if (instructionExtraArgs.link) {
      children.push(visit(instructionExtraArgs.link, this));
    }
    this.indent -= 1;
    return [this.indented('[InstructionExtraArgsNode]'), ...children].join(
      '\n'
    );
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): string {
    this.indent += 1;
    const data = visit(definedType.data, this);
    this.indent -= 1;
    return [this.indented(`[DefinedTypeNode] ${definedType.name}`), data].join(
      '\n'
    );
  }

  visitError(error: nodes.ErrorNode): string {
    return this.indented(
      `[ErrorNode] ${error.name} (${error.code}): ${error.message}`
    );
  }

  visitArrayType(arrayType: nodes.ArrayTypeNode): string {
    this.indent += 1;
    const child = visit(arrayType.child, this);
    this.indent -= 1;
    const size = displaySizeStrategy(arrayType.size);
    return [this.indented(`[ArrayTypeNode] size: ${size}`), child].join('\n');
  }

  visitLinkType(linkType: nodes.LinkTypeNode): string {
    return this.indented(
      `[LinkTypeNode] ${linkType.name}, importFrom: ${linkType.importFrom}`
    );
  }

  visitEnumType(enumType: nodes.EnumTypeNode): string {
    this.indent += 1;
    const children = enumType.variants.map((variant) => visit(variant, this));
    this.indent -= 1;
    return [this.indented('[EnumTypeNode]'), ...children].join('\n');
  }

  visitEnumEmptyVariantType(
    enumEmptyVariantType: nodes.EnumEmptyVariantTypeNode
  ): string {
    return this.indented(
      `[EnumEmptyVariantTypeNode] ${enumEmptyVariantType.name}`
    );
  }

  visitEnumStructVariantType(
    enumStructVariantType: nodes.EnumStructVariantTypeNode
  ): string {
    this.indent += 1;
    const child = visit(enumStructVariantType.struct, this);
    this.indent -= 1;
    return [
      this.indented(
        `[EnumStructVariantTypeNode] ${enumStructVariantType.name}`
      ),
      child,
    ].join('\n');
  }

  visitEnumTupleVariantType(
    enumTupleVariantType: nodes.EnumTupleVariantTypeNode
  ): string {
    this.indent += 1;
    const child = visit(enumTupleVariantType.tuple, this);
    this.indent -= 1;
    return [
      this.indented(`[EnumTupleVariantTypeNode] ${enumTupleVariantType.name}`),
      child,
    ].join('\n');
  }

  visitMapType(mapType: nodes.MapTypeNode): string {
    const result: string[] = [];
    const size = displaySizeStrategy(mapType.size);
    result.push(
      this.indented(`[MapTypeNode] size: ${size}, ${mapType.idlMap}`)
    );
    this.indent += 1;
    result.push(this.indented('keys:'));
    this.indent += 1;
    result.push(visit(mapType.key, this));
    this.indent -= 1;
    result.push(this.indented('values:'));
    this.indent += 1;
    result.push(visit(mapType.value, this));
    this.indent -= 1;
    this.indent -= 1;
    return result.join('\n');
  }

  visitOptionType(optionType: nodes.OptionTypeNode): string {
    this.indent += 1;
    const child = visit(optionType.child, this);
    this.indent -= 1;
    const prefix = optionType.prefix.toString();
    const fixed = optionType.fixed ? ', fixed' : '';
    return [
      this.indented(`[OptionTypeNode] prefix: ${prefix}${fixed}`),
      child,
    ].join('\n');
  }

  visitSetType(setType: nodes.SetTypeNode): string {
    this.indent += 1;
    const child = visit(setType.child, this);
    this.indent -= 1;
    const size = displaySizeStrategy(setType.size);
    return [this.indented(`[SetTypeNode] size: ${size}`), child].join('\n');
  }

  visitStructType(structType: nodes.StructTypeNode): string {
    this.indent += 1;
    const children = structType.fields.map((field) => visit(field, this));
    this.indent -= 1;
    return [this.indented('[StructTypeNode]'), ...children].join('\n');
  }

  visitStructFieldType(structFieldType: nodes.StructFieldTypeNode): string {
    this.indent += 1;
    const child = visit(structFieldType.child, this);
    this.indent -= 1;
    return [
      this.indented(`[StructFieldTypeNode] ${structFieldType.name}`),
      child,
    ].join('\n');
  }

  visitTupleType(tupleType: nodes.TupleTypeNode): string {
    this.indent += 1;
    const children = tupleType.children.map((child) => visit(child, this));
    this.indent -= 1;
    return [this.indented('[TupleTypeNode]'), ...children].join('\n');
  }

  visitBoolType(boolType: nodes.BoolTypeNode): string {
    return this.indented(`[BoolTypeNode] ${boolType.size.toString()}`);
  }

  visitBytesType(bytesType: nodes.BytesTypeNode): string {
    return this.indented(
      `[BytesTypeNode] size: ${displaySizeStrategy(bytesType.size)}`
    );
  }

  visitNumberType(numberType: nodes.NumberTypeNode): string {
    return this.indented(`[NumberTypeNode] ${numberType.toString()}`);
  }

  visitNumberWrapperType(
    numberWrapperType: nodes.NumberWrapperTypeNode
  ): string {
    this.indent += 1;
    const item = visit(numberWrapperType.number, this);
    this.indent -= 1;
    const { wrapper } = numberWrapperType;
    const base = `[NumberWrapperTypeNode] ${wrapper.kind}`;
    switch (wrapper.kind) {
      case 'Amount':
        return [
          this.indented(
            `${base} ` +
              `identifier: ${wrapper.identifier}, ` +
              `decimals: ${wrapper.decimals}`
          ),
          item,
        ].join('\n');
      default:
        return [this.indented(`${base}`), item].join('\n');
    }
  }

  visitPublicKeyType(): string {
    return this.indented('[PublicKeyTypeNode]');
  }

  visitStringType(stringType: nodes.StringTypeNode): string {
    return this.indented(
      `[StringTypeNode] ` +
        `encoding: ${stringType.encoding}, ` +
        `size: ${displaySizeStrategy(stringType.size)}`
    );
  }

  indented(text: string) {
    return this.separator.repeat(this.indent) + text;
  }
}
