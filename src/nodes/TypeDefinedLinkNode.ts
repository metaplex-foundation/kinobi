import { mainCase } from '../utils';
import type { Dependency, Visitable, Visitor } from '../visitors';
import type { Node } from './Node';

export class TypeDefinedLinkNode implements Visitable {
  readonly nodeClass = 'TypeDefinedLinkNode' as const;

  readonly definedType: string;

  readonly dependency: Dependency | null;

  constructor(definedType: string, dependency: Dependency | null = null) {
    this.definedType = mainCase(definedType);
    this.dependency = dependency;
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeDefinedLink(this);
  }

  get name(): string {
    return this.definedType;
  }
}

export function isTypeDefinedLinkNode(
  node: Node | null
): node is TypeDefinedLinkNode {
  return !!node && node.nodeClass === 'TypeDefinedLinkNode';
}

export function assertTypeDefinedLinkNode(
  node: Node | null
): asserts node is TypeDefinedLinkNode {
  if (!isTypeDefinedLinkNode(node)) {
    throw new Error(
      `Expected TypeDefinedLinkNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
