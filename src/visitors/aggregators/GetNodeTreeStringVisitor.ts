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
    const children = root.programs.map((program) => program.accept(this));
    this.indent -= 1;
    return [this.indented('[RootNode]'), ...children].join('\n');
  }

  visitProgram(program: nodes.ProgramNode): string {
    this.indent += 1;
    const children = [
      ...program.accounts.map((account) => account.accept(this)),
      ...program.instructionsWithSubs.map((ix) => ix.accept(this)),
      ...program.definedTypes.map((type) => type.accept(this)),
      ...program.errors.map((type) => type.accept(this)),
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
          const type = seed.type.accept(this);
          this.indent -= 1;
          return [
            this.indented(`${seed.name} (${seed.description})`),
            type,
          ].join('\n');
        })
      );
      this.indent -= 1;
    }
    children.push(account.type.accept(this));
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
        if (account.defaultsTo.kind !== 'none')
          tags.push(`defaults to ${account.defaultsTo.kind}`);
        const tagsAsString = tags.length > 0 ? ` (${tags.join(', ')})` : '';
        return this.indented(account.name + tagsAsString);
      })
    );
    this.indent -= 1;
    children.push(this.indented('arguments:'));
    this.indent += 1;
    children.push(instruction.args.accept(this));
    this.indent -= 1;
    this.indent -= 1;
    return children.join('\n');
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): string {
    this.indent += 1;
    const child = definedType.type.accept(this);
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

  visitTypeArray(typeArray: nodes.TypeArrayNode): string {
    this.indent += 1;
    const item = typeArray.item.accept(this);
    this.indent -= 1;
    const size = this.displayArrayLikeSize(typeArray.size);
    return [this.indented(`[TypeArrayNode] size: ${size}`), item].join('\n');
  }

  visitTypeDefinedLink(typeDefinedLink: nodes.TypeDefinedLinkNode): string {
    return this.indented(
      `[TypeDefinedLinkNode] ${typeDefinedLink.name}, ` +
        `dependency: ${typeDefinedLink.dependency}`
    );
  }

  visitTypeEnum(typeEnum: nodes.TypeEnumNode): string {
    this.indent += 1;
    const children = typeEnum.variants.map((variant) => variant.accept(this));
    this.indent -= 1;
    return [
      this.indented(
        `[TypeEnumNode]${typeEnum.name ? ` ${typeEnum.name}` : ''}`
      ),
      ...children,
    ].join('\n');
  }

  visitTypeEnumEmptyVariant(
    typeEnumEmptyVariant: nodes.TypeEnumEmptyVariantNode
  ): string {
    return this.indented(
      `[TypeEnumEmptyVariantNode] ${typeEnumEmptyVariant.name}`
    );
  }

  visitTypeEnumStructVariant(
    typeEnumStructVariant: nodes.TypeEnumStructVariantNode
  ): string {
    this.indent += 1;
    const child = typeEnumStructVariant.struct.accept(this);
    this.indent -= 1;
    return [
      this.indented(
        `[TypeEnumStructVariantNode] ${typeEnumStructVariant.name}`
      ),
      child,
    ].join('\n');
  }

  visitTypeEnumTupleVariant(
    typeEnumTupleVariant: nodes.TypeEnumTupleVariantNode
  ): string {
    this.indent += 1;
    const child = typeEnumTupleVariant.tuple.accept(this);
    this.indent -= 1;
    return [
      this.indented(`[TypeEnumTupleVariantNode] ${typeEnumTupleVariant.name}`),
      child,
    ].join('\n');
  }

  visitTypeMap(typeMap: nodes.TypeMapNode): string {
    const result: string[] = [];
    const size = this.displayArrayLikeSize(typeMap.size);
    result.push(
      this.indented(`[TypeMapNode] size: ${size}, ${typeMap.idlType}`)
    );
    this.indent += 1;
    result.push(this.indented('keys:'));
    this.indent += 1;
    result.push(typeMap.key.accept(this));
    this.indent -= 1;
    result.push(this.indented('values:'));
    this.indent += 1;
    result.push(typeMap.value.accept(this));
    this.indent -= 1;
    this.indent -= 1;
    return result.join('\n');
  }

  visitTypeOption(typeOption: nodes.TypeOptionNode): string {
    this.indent += 1;
    const item = typeOption.item.accept(this);
    this.indent -= 1;
    const prefix = typeOption.prefix.accept(this);
    const fixed = typeOption.fixed ? ', fixed' : '';
    return [
      this.indented(`[TypeOptionNode] prefix: ${prefix}${fixed}`),
      item,
    ].join('\n');
  }

  visitTypeSet(typeSet: nodes.TypeSetNode): string {
    this.indent += 1;
    const item = typeSet.item.accept(this);
    this.indent -= 1;
    const size = this.displayArrayLikeSize(typeSet.size);
    return [this.indented(`[TypeSetNode] size: ${size}`), item].join('\n');
  }

  visitTypeStruct(typeStruct: nodes.TypeStructNode): string {
    this.indent += 1;
    const children = typeStruct.fields.map((field) => field.accept(this));
    this.indent -= 1;
    return [
      this.indented(`[TypeStructNode] ${typeStruct.name}`),
      ...children,
    ].join('\n');
  }

  visitTypeStructField(typeStructField: nodes.TypeStructFieldNode): string {
    this.indent += 1;
    const child = typeStructField.type.accept(this);
    this.indent -= 1;
    return [
      this.indented(`[TypeStructFieldNode] ${typeStructField.name}`),
      child,
    ].join('\n');
  }

  visitTypeTuple(typeTuple: nodes.TypeTupleNode): string {
    this.indent += 1;
    const items = typeTuple.items.map((item) => item.accept(this));
    this.indent -= 1;
    return [this.indented('[TypeTupleNode]'), ...items].join('\n');
  }

  visitTypeBool(typeBool: nodes.TypeBoolNode): string {
    return this.indented(`[TypeBoolNode] ${typeBool.size.toString()}`);
  }

  visitTypeBytes(): string {
    return this.indented('[TypeBytesNode]');
  }

  visitTypeNumber(typeNumber: nodes.TypeNumberNode): string {
    return this.indented(`[TypeNumberNode] ${typeNumber.toString()}`);
  }

  visitTypeNumberWrapper(
    typeNumberWrapper: nodes.TypeNumberWrapperNode
  ): string {
    this.indent += 1;
    const item = typeNumberWrapper.item.accept(this);
    this.indent -= 1;
    const { wrapper } = typeNumberWrapper;
    const base = `[TypeNumberWrapperNode] ${wrapper.kind}`;
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

  visitTypePublicKey(): string {
    return this.indented('[TypePublicKeyNode]');
  }

  visitTypeString(typeString: nodes.TypeStringNode): string {
    return this.indented(
      `[TypeStringNode] ` +
        `encoding: ${typeString.encoding}, ` +
        `size: ${typeString.getSizeAsString()}`
    );
  }

  indented(text: string) {
    return this.separator.repeat(this.indent) + text;
  }

  displayArrayLikeSize(size: nodes.TypeArrayNode['size']): string {
    if (size.kind === 'fixed') return `${size.size}`;
    if (size.kind === 'prefixed') return size.prefix.toString();
    return 'remainder';
  }
}
