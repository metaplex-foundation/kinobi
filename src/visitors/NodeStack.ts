import * as nodes from '../nodes';
import { mainCase, titleCase } from '../shared';

export class NodeStack {
  private readonly stack: nodes.Node[];

  constructor(stack: nodes.Node[] = []) {
    this.stack = [...stack];
  }

  public push(node: nodes.Node): void {
    this.stack.push(node);
  }

  public pop(): nodes.Node | undefined {
    return this.stack.pop();
  }

  public peek(): nodes.Node | undefined {
    return this.isEmpty() ? undefined : this.stack[this.stack.length - 1];
  }

  public getProgram(): nodes.ProgramNode | undefined {
    return this.stack.find(nodes.isProgramNode);
  }

  public all(): nodes.Node[] {
    return [...this.stack];
  }

  public isEmpty(): boolean {
    return this.stack.length === 0;
  }

  public clone(): NodeStack {
    return new NodeStack(this.stack);
  }

  public toString(): string {
    return this.toStringArray().join(' > ');
  }

  public toStringArray(): string[] {
    return this.stack.map((node): string => {
      switch (node.kind) {
        case 'rootNode':
          return 'Root';
        case 'programNode':
          return node.name ? `Program: ${node.name}` : 'Unnamed Program';
        case 'accountNode':
          return node.name ? `Account: ${node.name}` : 'Unnamed Account';
        case 'instructionNode':
          return node.name
            ? `Instruction: ${node.name}`
            : 'Unnamed Instruction';
        case 'instructionAccountNode':
          return node.name
            ? `Instruction Account: ${node.name}`
            : 'Unnamed Instruction Account';
        case 'definedTypeNode':
          return node.name
            ? `Defined Type: ${node.name}`
            : 'Unnamed Defined Type';
        case 'errorNode':
          return node.name ? `Error: ${node.name}` : 'Unnamed Error';
        case 'enumEmptyVariantTypeNode':
        case 'enumStructVariantTypeNode':
        case 'enumTupleVariantTypeNode':
          return node.name ? `Variant: ${node.name}` : 'Variant';
        case 'structFieldTypeNode':
          return node.name ? `Field: ${node.name}` : 'Field';
        default:
          return titleCase(node.kind.replace(/(Type)?Node$/, ''));
      }
    });
  }

  public matchesWithNames(names: string[]): boolean {
    const remainingNames = [...names].map(mainCase);
    this.stack.forEach((node) => {
      const nodeName = (node as { name?: string }).name;
      if (
        nodeName &&
        remainingNames.length > 0 &&
        remainingNames[0] === mainCase(nodeName)
      ) {
        remainingNames.shift();
      }
    });

    return remainingNames.length === 0;
  }
}
