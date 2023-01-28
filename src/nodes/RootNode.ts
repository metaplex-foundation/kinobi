import type { Idl } from '../idl';
import { readJson } from '../utils';
import type { Visitable, Visitor } from '../visitors';
import type { AccountNode } from './AccountNode';
import type { DefinedTypeNode } from './DefinedTypeNode';
import type { InstructionNode } from './InstructionNode';
import type { Node } from './Node';
import { ProgramNode } from './ProgramNode';

export type ProgramInput = string | Partial<Idl>;
export type ProgramInputs = ProgramInput | ProgramInput[];

export class RootNode implements Visitable {
  readonly nodeClass = 'RootNode' as const;

  readonly programs: ProgramNode[];

  constructor(programs: ProgramNode[]) {
    this.programs = programs;
  }

  static fromIdls(idls: Partial<Idl>[]): RootNode {
    const programs = idls.map((idl) => ProgramNode.fromIdl(idl));
    return new RootNode(programs);
  }

  static fromProgramInputs(inputs: ProgramInputs): RootNode {
    const inputArray = Array.isArray(inputs) ? inputs : [inputs];
    const idlArray = inputArray.map((program) =>
      typeof program === 'string' ? readJson<Partial<Idl>>(program) : program
    );
    return RootNode.fromIdls(idlArray);
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

  get allInstructionsWithSubs(): InstructionNode[] {
    return this.programs.flatMap((program) => program.instructionsWithSubs);
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
