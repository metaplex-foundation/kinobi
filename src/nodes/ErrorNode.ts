import { pascalCase } from '../utils';
import type { IdlError } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';

export type ErrorNodeMetadata = {
  name: string;
  idlName: string;
  docs: string[];
};

export class ErrorNode implements Visitable {
  readonly nodeClass = 'ErrorNode' as const;

  constructor(
    readonly metadata: ErrorNodeMetadata,
    readonly code: number,
    readonly message: string
  ) {}

  static fromIdl(idl: Partial<IdlError>): ErrorNode {
    const idlName = idl.name ?? '';
    const name = pascalCase(idlName);
    const code = idl.code ?? -1;
    const message = idl.msg ?? '';
    const defaultDocs = [`${name}: '${message}'`];
    const docs = idl.docs ?? defaultDocs;
    return new ErrorNode({ name, idlName, docs }, code, message);
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
