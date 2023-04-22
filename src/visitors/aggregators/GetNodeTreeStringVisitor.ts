import type * as nodes from '../../nodes';
import { Visitor } from '../Visitor';

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
      ...program.instructionsWithSubs.map((ix) => visit(ix, this)),
      ...program.definedTypes.map((type) => visit(type, this)),
      ...program.errors.map((type) => visit(type, this)),
    ];
    this.indent -= 1;
    const data = program.metadata;
    const tags = [];
    if (data.publicKey) tags.push(`publicKey: ${data.publicKey}`);
    if (data.version) tags.push(`version: ${data.version}`);
    if (data.origin) tags.push(`origin: ${data.origin}`);
    const tagsStr = tags.length > 0 ? ` (${tags.join(', ')})` : '';
    return [
      this.indented(`[ProgramNode] ${data.name}${tagsStr}`),
      ...children,
    ].join('\n');
  }

  visitAccount(account: nodes.AccountNode): string {
    const children: string[] = [];
    children.push(this.indented(`[AccountNode] ${account.name}`));
    this.indent += 1;
    if (account.metadata.size !== null) {
      children.push(this.indented(`size: ${account.metadata.size}`));
    }
    if (account.metadata.seeds.length > 0) {
      children.push(this.indented('seeds:'));
      this.indent += 1;
      children.push(
        ...account.metadata.seeds.map((seed) => {
          if (seed.kind === 'programId') return this.indented('programId');
          if (seed.kind === 'literal') return this.indented(`"${seed.value}"`);
          this.indent += 1;
          const type = visit(seed.type, this);
          this.indent -= 1;
          return [
            this.indented(`${seed.name} (${seed.description})`),
            type,
          ].join('\n');
        })
      );
      this.indent -= 1;
    }
    children.push(visit(account.type, this));
    this.indent -= 1;
    return children.join('\n');
  }

  visitInstruction(instruction: nodes.InstructionNode): string {
    const children: string[] = [];
    children.push(this.indented(`[InstructionNode] ${instruction.name}`));
    this.indent += 1;
    children.push(this.indented('accounts:'));
    this.indent += 1;
    children.push(
      ...instruction.accounts.map((account) => {
        const tags = [];
        if (account.isWritable) tags.push('writable');
        if (account.isSigner) tags.push('signer');
        if (account.isOptional) tags.push('optional');
        if (account.defaultsTo)
          tags.push(`defaults to ${account.defaultsTo.kind}`);
        const tagsAsString = tags.length > 0 ? ` (${tags.join(', ')})` : '';
        return this.indented(account.name + tagsAsString);
      })
    );
    this.indent -= 1;
    children.push(this.indented('arguments:'));
    this.indent += 1;
    children.push(visit(instruction.args, this));
    this.indent -= 1;
    if (instruction.extraArgs) {
      children.push(this.indented('extra arguments:'));
      this.indent += 1;
      children.push(visit(instruction.extraArgs, this));
      this.indent -= 1;
    }
    this.indent -= 1;
    return children.join('\n');
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): string {
    this.indent += 1;
    const child = visit(definedType.type, this);
    this.indent -= 1;
    return [this.indented(`[DefinedTypeNode] ${definedType.name}`), child].join(
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
    const item = visit(arrayType.item, this);
    this.indent -= 1;
    const size = this.displayArrayLikeSize(arrayType.size);
    return [this.indented(`[ArrayTypeNode] size: ${size}`), item].join('\n');
  }

  visitDefinedLinkType(definedLinkType: nodes.LinkTypeNode): string {
    return this.indented(
      `[LinkTypeNode] ${definedLinkType.name}, ` +
        `importFrom: ${definedLinkType.importFrom}`
    );
  }

  visitEnumType(enumType: nodes.EnumTypeNode): string {
    this.indent += 1;
    const children = enumType.variants.map((variant) => visit(variant, this));
    this.indent -= 1;
    return [
      this.indented(
        `[EnumTypeNode]${enumType.name ? ` ${enumType.name}` : ''}`
      ),
      ...children,
    ].join('\n');
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
    const size = this.displayArrayLikeSize(mapType.size);
    result.push(
      this.indented(`[MapTypeNode] size: ${size}, ${mapType.idlType}`)
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
    const item = visit(optionType.item, this);
    this.indent -= 1;
    const prefix = optionType.prefix.toString();
    const fixed = optionType.fixed ? ', fixed' : '';
    return [
      this.indented(`[OptionTypeNode] prefix: ${prefix}${fixed}`),
      item,
    ].join('\n');
  }

  visitSetType(setType: nodes.SetTypeNode): string {
    this.indent += 1;
    const item = visit(setType.item, this);
    this.indent -= 1;
    const size = this.displayArrayLikeSize(setType.size);
    return [this.indented(`[SetTypeNode] size: ${size}`), item].join('\n');
  }

  visitStructType(structType: nodes.StructTypeNode): string {
    this.indent += 1;
    const children = structType.fields.map((field) => visit(field, this));
    this.indent -= 1;
    return [
      this.indented(`[StructTypeNode] ${structType.name}`),
      ...children,
    ].join('\n');
  }

  visitStructFieldType(structFieldType: nodes.StructFieldTypeNode): string {
    this.indent += 1;
    const child = visit(structFieldType.type, this);
    this.indent -= 1;
    return [
      this.indented(`[StructFieldTypeNode] ${structFieldType.name}`),
      child,
    ].join('\n');
  }

  visitTupleType(tupleType: nodes.TupleTypeNode): string {
    this.indent += 1;
    const items = tupleType.items.map((item) => visit(item, this));
    this.indent -= 1;
    return [this.indented('[TupleTypeNode]'), ...items].join('\n');
  }

  visitBoolType(boolType: nodes.BoolTypeNode): string {
    return this.indented(`[BoolTypeNode] ${boolType.size.toString()}`);
  }

  visitBytesType(bytesType: nodes.BytesTypeNode): string {
    return this.indented(
      `[BytesTypeNode] size: ${bytesType.getSizeAsString()}`
    );
  }

  visitNumberType(numberType: nodes.NumberTypeNode): string {
    return this.indented(`[NumberTypeNode] ${numberType.toString()}`);
  }

  visitNumberWrapperType(
    numberWrapperType: nodes.NumberWrapperTypeNode
  ): string {
    this.indent += 1;
    const item = visit(numberWrapperType.item, this);
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
        `size: ${stringType.getSizeAsString()}`
    );
  }

  indented(text: string) {
    return this.separator.repeat(this.indent) + text;
  }

  displayArrayLikeSize(size: nodes.ArrayTypeNode['size']): string {
    if (size.kind === 'fixed') return `${size.size}`;
    if (size.kind === 'prefixed') return size.prefix.toString();
    return 'remainder';
  }
}
