import type { Idl } from '../idl';
import { PartialExcept, mainCase } from '../shared';
import { AccountNode, accountNodeFromIdl } from './AccountNode';
import { DefinedTypeNode, definedTypeNodeFromIdl } from './DefinedTypeNode';
import { ErrorNode, errorNodeFromIdl } from './ErrorNode';
import { InstructionNode, instructionNodeFromIdl } from './InstructionNode';
import type { Node } from './Node';

export type ProgramNode = {
  readonly __programNode: unique symbol;
  readonly nodeClass: 'ProgramNode';
  readonly accountNodes: AccountNode[];
  readonly instructionNodes: InstructionNode[];
  readonly definedTypeNodes: DefinedTypeNode[];
  readonly errorNodes: ErrorNode[];
  readonly name: string;
  readonly prefix: string;
  readonly publicKey: string;
  readonly version: string;
  readonly origin: 'shank' | 'anchor' | null;
  readonly internal: boolean;
};

export type ProgramNodeInput = Omit<
  PartialExcept<
    ProgramNode,
    | 'accountNodes'
    | 'instructionNodes'
    | 'definedTypeNodes'
    | 'errorNodes'
    | 'name'
    | 'publicKey'
    | 'version'
  >,
  '__programNode' | 'nodeClass'
>;

export function programNode(input: ProgramNodeInput): ProgramNode {
  return {
    nodeClass: 'ProgramNode',
    accountNodes: input.accountNodes,
    instructionNodes: input.instructionNodes,
    definedTypeNodes: input.definedTypeNodes,
    errorNodes: input.errorNodes,
    name: mainCase(input.name),
    prefix: mainCase(input.prefix ?? ''),
    publicKey: input.publicKey,
    version: input.version,
    origin: input.origin ?? null,
    internal: input.internal ?? false,
  } as ProgramNode;
}

export function programNodeFromIdl(idl: Partial<Idl>): ProgramNode {
  const origin = idl.metadata?.origin ?? null;
  const accountNodes = (idl.accounts ?? []).map(accountNodeFromIdl);
  const instructionNodes = (idl.instructions ?? []).map((ix) =>
    origin === 'anchor'
      ? instructionNodeFromIdl({
          ...ix,
          defaultOptionalAccounts: ix.defaultOptionalAccounts ?? true,
        })
      : instructionNodeFromIdl(ix)
  );
  return programNode({
    accountNodes,
    instructionNodes,
    definedTypeNodes: (idl.types ?? []).map(definedTypeNodeFromIdl),
    errorNodes: (idl.errors ?? []).map(errorNodeFromIdl),
    name: idl.name ?? '',
    publicKey: idl.metadata?.address ?? '',
    version: idl.version ?? '',
    origin,
  });
}

export function isProgramNode(node: Node | null): node is ProgramNode {
  return !!node && node.nodeClass === 'ProgramNode';
}

export function assertProgramNode(
  node: Node | null
): asserts node is ProgramNode {
  if (!isProgramNode(node)) {
    throw new Error(`Expected ProgramNode, got ${node?.nodeClass ?? 'null'}.`);
  }
}
