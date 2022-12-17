/* eslint-disable no-console */
import type * as nodes from '../nodes';
import { BaseVisitor } from './BaseVisitor';

export class PrintVisitor extends BaseVisitor {
  indent = 0;

  readonly separator: string;

  constructor(separator = '|   ') {
    super();
    this.separator = separator;
  }

  visitRoot(root: nodes.RootNode) {
    this.printIndentedText('[RootNode]');
    this.indent += 1;
    root.visitChildren(this);
    this.indent -= 1;
  }

  visitAccount(account: nodes.AccountNode): void {
    this.printIndentedText(`[AccountNode] ${account.name}`);
    this.indent += 1;
    account.visitChildren(this);
    this.indent -= 1;
  }

  visitTypeArray(typeArray: nodes.TypeArrayNode): void {
    this.printIndentedText(`[TypeArrayNode] Size: ${typeArray.size}`);
    typeArray.visitChildren(this);
  }

  visitTypeDefinedLink(typeDefinedLink: nodes.TypeDefinedLinkNode): void {
    this.printIndentedText(
      `[TypeDefinedLinkNode] ${typeDefinedLink.definedType}`,
    );
  }

  visitTypeEnum(typeEnum: nodes.TypeEnumNode): void {
    this.printIndentedText(`[TypeEnumNode] ${typeEnum.name}`);
    // typeEnum.variants.forEach((variant) => {
    //   (variant.fields ?? []).forEach((field) => {
    //     this.indent += 1;
    //     field.type.visit(this);
    //     this.indent -= 1;
    //   });
    // });
  }

  visitTypeLeaf(typeLeaf: nodes.TypeLeafNode): void {
    this.printIndentedText(`[TypeLeafNode] ${typeLeaf.type}`);
  }

  visitTypeMap(typeMap: nodes.TypeMapNode): void {
    this.printIndentedText(`[TypeMapNode] ${typeMap.mapType}`);
    this.indent += 1;
    this.printIndentedText('keys:');
    this.indent += 1;
    typeMap.keyType.visit(this);
    this.indent -= 1;
    this.printIndentedText('values:');
    this.indent += 1;
    typeMap.valueType.visit(this);
    this.indent -= 1;
    this.indent -= 1;
  }

  visitTypeStruct(typeStruct: nodes.TypeStructNode): void {
    this.printIndentedText('[TypeStructNode]');
    this.indent += 1;
    typeStruct.fields.forEach((field) => {
      this.printIndentedText(`${field.name}:`);
      this.indent += 1;
      field.type.visit(this);
      this.indent -= 1;
    });
    this.indent -= 1;
  }

  getIndentedText(text: string) {
    return this.separator.repeat(this.indent) + text;
  }

  printIndentedText(text: string) {
    console.log(this.getIndentedText(text));
  }
}
