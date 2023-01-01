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

  static fromIdls(idls: Partial<Idl>[]): RootNode {
    const programs = idls.map((idl) => ProgramNode.fromIdl(idl));
    return new RootNode(programs);
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

export function isRootNode(node: Node | null): node is RootNode {
  return !!node && node.nodeClass === 'RootNode';
}

export function assertRootNode(node: Node | null): asserts node is RootNode {
  if (!isRootNode(node)) {
    throw new Error(`Expected RootNode, got ${node?.nodeClass ?? 'null'}.`);
  }
}
