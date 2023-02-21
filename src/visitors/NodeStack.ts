import * as nodes from '../nodes';
import { mainCase, titleCase } from '../utils';

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
      switch (node.nodeClass) {
        case 'RootNode':
          return 'Root';
        case 'ProgramNode':
          return node.name ? `Program: ${node.name}` : 'Unnamed Program';
        case 'AccountNode':
          return node.name ? `Account: ${node.name}` : 'Unnamed Account';
        case 'InstructionNode':
          return node.name
            ? `Instruction: ${node.name}`
            : 'Unnamed Instruction';
        case 'DefinedTypeNode':
          return node.name
            ? `Defined Type: ${node.name}`
            : 'Unnamed Defined Type';
        case 'ErrorNode':
          return node.name ? `Error: ${node.name}` : 'Unnamed Error';
        case 'TypeEnumNode':
          return node.name ? `Enum: ${node.name}` : 'Enum';
        case 'TypeEnumEmptyVariantNode':
        case 'TypeEnumStructVariantNode':
        case 'TypeEnumTupleVariantNode':
          return node.name ? `Variant: ${node.name}` : 'Variant';
        case 'TypeNumberWrapperNode':
          return `Number Wrapper: ${node.wrapper.kind}`;
        case 'TypeStructNode':
          return node.name ? `Struct: ${node.name}` : 'Struct';
        case 'TypeStructFieldNode':
          return node.name ? `Field: ${node.name}` : 'Field';
        default:
          return titleCase(
            node.nodeClass.replace(/Node$/, '').replace(/^Type/, '')
          );
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
