/* eslint-disable no-console */
import type * as nodes from '../nodes';
import { BaseVoidVisitor } from './BaseVoidVisitor';

export class PrintVisitor extends BaseVoidVisitor {
  indent = 0;

  readonly separator: string;

  constructor(separator = '|   ') {
    super();
    this.separator = separator;
  }

  visitRoot(root: nodes.RootNode) {
    const origin = root.origin ? `, origin: ${root.origin}` : '';
    this.printIndentedText(
      `[RootNode] ${root.name} (address: ${root.address}${origin})`,
    );
    this.indent += 1;
    super.visitRoot(root);
    this.indent -= 1;
  }

  visitAccount(account: nodes.AccountNode): void {
    this.printIndentedText(`[AccountNode] ${account.name}`);
    this.indent += 1;
    super.visitAccount(account);
    this.indent -= 1;
  }

  visitInstruction(instruction: nodes.InstructionNode): void {
    const discriminator =
      instruction.discriminator?.value !== undefined
        ? ` (discriminator: ${instruction.discriminator?.value})`
        : '';
    this.printIndentedText(
      `[InstructionNode] ${instruction.name}${discriminator}`,
    );
    this.indent += 1;
    this.printIndentedText('accounts:');
    this.indent += 1;
    instruction.accounts.forEach((account) => {
      const tags = [];
      if (account.isMutable) tags.push('mutable');
      if (account.isSigner) tags.push('signer');
      if (account.isOptional) tags.push('optional');
      const tagsAsString = tags.length > 0 ? ` (${tags.join(', ')})` : '';
      this.printIndentedText(account.name + tagsAsString);
    });
    this.indent -= 1;
    this.printIndentedText('arguments:');
    this.indent += 1;
    instruction.args.accept(this);
    this.indent -= 1;
    this.indent -= 1;
  }

  visitDefinedType(definedType: nodes.DefinedTypeNode): void {
    this.printIndentedText(`[DefinedTypeNode] ${definedType.name}`);
    this.indent += 1;
    super.visitDefinedType(definedType);
    this.indent -= 1;
  }

  visitTypeArray(typeArray: nodes.TypeArrayNode): void {
    this.printIndentedText(`[TypeArrayNode] Size: ${typeArray.size}`);
    this.indent += 1;
    super.visitTypeArray(typeArray);
    this.indent -= 1;
  }

  visitTypeDefinedLink(typeDefinedLink: nodes.TypeDefinedLinkNode): void {
    this.printIndentedText(
      `[TypeDefinedLinkNode] ${typeDefinedLink.definedType}`,
    );
  }

  visitTypeEnum(typeEnum: nodes.TypeEnumNode): void {
    this.printIndentedText(
      `[TypeEnumNode]${typeEnum.name ? ` ${typeEnum.name}` : ''}`,
    );
    typeEnum.variants.forEach((variant) => {
      this.indent += 1;
      const variantSuffix =
        variant.kind === 'empty' ? '' : ` (${variant.kind}):`;
      this.printIndentedText(`${variant.name}${variantSuffix}`);
      if (variant.kind === 'struct') {
        this.indent += 1;
        variant.type.accept(this);
        this.indent -= 1;
      } else if (variant.kind === 'tuple') {
        this.indent += 1;
        variant.type.accept(this);
        this.indent -= 1;
      }
      this.indent -= 1;
    });
  }

  visitTypeLeaf(typeLeaf: nodes.TypeLeafNode): void {
    this.printIndentedText(`[TypeLeafNode] ${typeLeaf.type}`);
  }

  visitTypeMap(typeMap: nodes.TypeMapNode): void {
    this.printIndentedText(`[TypeMapNode] ${typeMap.mapType}`);
    this.indent += 1;
    this.printIndentedText('keys:');
    this.indent += 1;
    typeMap.keyType.accept(this);
    this.indent -= 1;
    this.printIndentedText('values:');
    this.indent += 1;
    typeMap.valueType.accept(this);
    this.indent -= 1;
    this.indent -= 1;
  }

  visitTypeOption(typeOption: nodes.TypeOptionNode): void {
    this.printIndentedText('[TypeOptionNode]');
    this.indent += 1;
    super.visitTypeOption(typeOption);
    this.indent -= 1;
  }

  visitTypeSet(typeSet: nodes.TypeSetNode): void {
    this.printIndentedText(`[TypeSetNode] ${typeSet.setType}`);
    this.indent += 1;
    super.visitTypeSet(typeSet);
    this.indent -= 1;
  }

  visitTypeStruct(typeStruct: nodes.TypeStructNode): void {
    this.printIndentedText('[TypeStructNode]');
    this.indent += 1;
    typeStruct.fields.forEach((field) => {
      this.printIndentedText(`${field.name}:`);
      this.indent += 1;
      field.type.accept(this);
      this.indent -= 1;
    });
    this.indent -= 1;
  }

  visitTypeTuple(typeTuple: nodes.TypeTupleNode): void {
    this.printIndentedText('[TypeTupleNode]');
    this.indent += 1;
    super.visitTypeTuple(typeTuple);
    this.indent -= 1;
  }

  visitTypeVec(typeVec: nodes.TypeVecNode): void {
    this.printIndentedText('[TypeVecNode]');
    this.indent += 1;
    super.visitTypeVec(typeVec);
    this.indent -= 1;
  }

  getIndentedText(text: string) {
    return this.separator.repeat(this.indent) + text;
  }

  printIndentedText(text: string) {
    console.log(this.getIndentedText(text));
  }
}
