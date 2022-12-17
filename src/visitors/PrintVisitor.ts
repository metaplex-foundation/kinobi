/* eslint-disable no-console */
import type {
  AccountNode,
  RootNode,
  TypeLeafNode,
  TypeStructNode,
} from 'src/nodes';
import { BaseVisitor } from './BaseVisitor';

export class PrintVisitor extends BaseVisitor {
  indent = 0;

  readonly separator: string;

  constructor(separator = '|   ') {
    super();
    this.separator = separator;
  }

  visitRoot(root: RootNode) {
    this.printIndentedText('[RootNode]');
    this.indent += 1;
    root.visitChildren(this);
    this.indent -= 1;
  }

  visitAccount(account: AccountNode): void {
    this.printIndentedText(`[AccountNode] ${account.name}`);
    this.indent += 1;
    account.visitChildren(this);
    this.indent -= 1;
  }

  visitTypeLeaf(typeLeaf: TypeLeafNode): void {
    this.printIndentedText(`[TypeLeafNode] ${typeLeaf.type}`);
  }

  visitTypeStruct(typeStruct: TypeStructNode): void {
    this.printIndentedText('[TypeStructNode]');
    this.indent += 1;
    typeStruct.visitChildren(this);
    this.indent -= 1;
  }

  getIndentedText(text: string) {
    return this.separator.repeat(this.indent) + text;
  }

  printIndentedText(text: string) {
    console.log(this.getIndentedText(text));
  }
}
