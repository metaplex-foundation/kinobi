/* eslint-disable no-console */
import type { AccountNode, RootNode } from 'src/nodes';
import { BaseVisitor } from './BaseVisitor';

export class PrintVisitor extends BaseVisitor {
  indent = 0;

  readonly separator: string;

  constructor(separator = '|   ') {
    super();
    this.separator = separator;
  }

  visitRoot(rootNode: RootNode) {
    this.printIndentedText('[RootNode]');
    this.indent += 1;
    rootNode.visitChildren(this);
    this.indent -= 1;
  }

  visitAccount(account: AccountNode): void {
    this.printIndentedText(`[AccountNode] ${account.name}`);
  }

  getIndentedText(text: string) {
    return this.separator.repeat(this.indent) + text;
  }

  printIndentedText(text: string) {
    console.log(this.getIndentedText(text));
  }
}
