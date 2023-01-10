import * as nodes from '../nodes';

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
        case 'TypeArrayNode':
          return 'Array';
        case 'TypeDefinedLinkNode':
          return 'Defined Link';
        case 'TypeEnumNode':
          return node.name ? `Enum: ${node.name}` : 'Enum';
        case 'TypeLeafNode':
          return 'Leaf';
        case 'TypeMapNode':
          return 'Map';
        case 'TypeOptionNode':
          return 'Option';
        case 'TypeSetNode':
          return 'Set';
        case 'TypeStructNode':
          return node.name ? `Struct: ${node.name}` : 'Struct';
        case 'TypeTupleNode':
          return 'Tuple';
        case 'TypeVecNode':
          return 'Vec';
        default:
          // @ts-ignore
          throw new Error(`Unknown node type: ${node.nodeClass}`);
      }
    });
  }

  public matchesWithNames(names: string[]): boolean {
    const remainingNames = [...names];
    this.stack.forEach((node) => {
      const nodeName = (node as { name?: string }).name;
      if (
        nodeName &&
        remainingNames.length > 0 &&
        remainingNames[0] === nodeName
      ) {
        remainingNames.shift();
      }
    });

    return remainingNames.length === 0;
  }
}
