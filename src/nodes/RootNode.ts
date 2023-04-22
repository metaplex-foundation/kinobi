import type { Idl } from '../idl';
import { readJson } from '../shared';
import type { Node } from './Node';
import { ProgramNode, programNodeFromIdl } from './ProgramNode';

export type ProgramInput = string | Partial<Idl>;
export type ProgramInputs = ProgramInput | ProgramInput[];

export type RootNode = {
  readonly __rootNode: unique symbol;
  readonly nodeClass: 'rootNode';
  readonly programs: ProgramNode[];
};

export function rootNode(programs: ProgramNode[]): RootNode {
  return { nodeClass: 'rootNode', programs } as RootNode;
}

export function rootNodeFromIdls(idls: Partial<Idl>[]): RootNode {
  const programs = idls.map((idl) => programNodeFromIdl(idl));
  return rootNode(programs);
}

export function rootNodeFromProgramInputs(inputs: ProgramInputs): RootNode {
  const inputArray = Array.isArray(inputs) ? inputs : [inputs];
  const idlArray = inputArray.map((program) =>
    typeof program === 'string' ? readJson<Partial<Idl>>(program) : program
  );
  return rootNodeFromIdls(idlArray);
}

export function isRootNode(node: Node | null): node is RootNode {
  return !!node && node.nodeClass === 'rootNode';
}

export function assertRootNode(node: Node | null): asserts node is RootNode {
  if (!isRootNode(node)) {
    throw new Error(`Expected RootNode, got ${node?.nodeClass ?? 'null'}.`);
  }
}
