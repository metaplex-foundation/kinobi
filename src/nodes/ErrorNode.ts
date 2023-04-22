import type { IdlError } from '../idl';
import { mainCase } from '../utils';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';

export type ErrorNodeMetadata = {
  name: string;
  idlName: string;
  docs: string[];
};

export type ErrorNode = {
  readonly __errorNode: unique symbol;
  readonly nodeClass: 'ErrorNode';
};

export type ErrorNodeInput = {
  // ...
};

export function errorNode(input: ErrorNodeInput): ErrorNode {
  return { ...input, nodeClass: 'ErrorNode' } as ErrorNode;
}

export function errorNodeFromIdl(idl: ErrorNodeIdl): ErrorNode {
  return errorNode(idl);
}

export class ErrorNode implements Visitable {
  readonly nodeClass = 'ErrorNode' as const;

  readonly metadata: ErrorNodeMetadata;

  readonly code: number;

  readonly message: string;

  constructor(metadata: ErrorNodeMetadata, code: number, message: string) {
    this.metadata = { ...metadata, name: mainCase(metadata.name) };
    this.code = code;
    this.message = message;
  }

  static fromIdl(idl: Partial<IdlError>): ErrorNode {
    const name = idl.name ?? '';
    const code = idl.code ?? -1;
    const message = idl.msg ?? '';
    const defaultDocs = [`${name}: '${message}'`];
    const docs = idl.docs ?? defaultDocs;
    return new ErrorNode({ name, idlName: name, docs }, code, message);
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitError(this);
  }

  get name(): string {
    return this.metadata.name;
  }

  get docs(): string[] {
    return this.metadata.docs;
  }
}

export function isErrorNode(node: Node | null): node is ErrorNode {
  return !!node && node.nodeClass === 'ErrorNode';
}

export function assertErrorNode(node: Node | null): asserts node is ErrorNode {
  if (!isErrorNode(node)) {
    throw new Error(`Expected ErrorNode, got ${node?.nodeClass ?? 'null'}.`);
  }
}
