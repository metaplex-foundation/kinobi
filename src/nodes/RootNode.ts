import type { Idl } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { AccountNode } from './AccountNode';
import type { DefinedTypeNode } from './DefinedTypeNode';
import type { InstructionNode } from './InstructionNode';
import type { Node } from './Node';
import { ProgramNode } from './ProgramNode';

export class RootNode implements Visitable {
  readonly nodeClass = 'RootNode' as const;

  constructor(readonly programs: ProgramNode[]) {}

  static fromIdl(idl: Partial<Idl>): RootNode {
    return new RootNode([ProgramNode.fromIdl(idl)]);
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitRoot(this);
  }

  get allAccounts(): AccountNode[] {
    return this.programs.flatMap((program) => program.accounts);
  }

  get allInstructions(): InstructionNode[] {
    return this.programs.flatMap((program) => program.instructions);
  }

  get allDefinedTypes(): DefinedTypeNode[] {
    return this.programs.flatMap((program) => program.definedTypes);
  }
}

export function isRootNode(node: Node): node is RootNode {
  return node.nodeClass === 'RootNode';
}

export function assertRootNode(node: Node): asserts node is RootNode {
  if (!isRootNode(node)) {
    throw new Error(`Expected RootNode, got ${node.nodeClass}.`);
  }
}
