import { pascalCase } from '../utils';
import type { IdlError } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';

export class ErrorNode implements Visitable {
  readonly nodeClass = 'ErrorNode' as const;

  constructor(
    readonly name: string,
    readonly code: number,
    readonly message: string,
    readonly docs: string[]
  ) {}

  static fromIdl(idl: Partial<IdlError>): ErrorNode {
    const name = pascalCase(idl.name ?? '');
    const code = idl.code ?? -1;
    const message = idl.msg ?? '';
    // TODO(loris): add all category tags within a visitor instead.
    const defaultDocs = [`${name}: '${message}'`, '@category Errors'];
    const docs = idl.docs ?? defaultDocs;
    return new ErrorNode(name, code, message, docs);
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitError(this);
  }
}

export function isErrorNode(node: Node): node is ErrorNode {
  return node.nodeClass === 'ErrorNode';
}

export function assertErrorNode(node: Node): asserts node is ErrorNode {
  if (!isErrorNode(node)) {
    throw new Error(`Expected ErrorNode, got ${node.nodeClass}.`);
  }
}
