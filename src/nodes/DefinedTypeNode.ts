import type { IdlDefinedType } from '../idl';
import { mainCase } from '../utils';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { createTypeNodeFromIdl, TypeNode } from './TypeNode';

export type DefinedTypeNodeMetadata = {
  name: string;
  idlName: string;
  docs: string[];
  internal: boolean;
};

export class DefinedTypeNode implements Visitable {
  readonly nodeClass = 'DefinedTypeNode' as const;

  readonly metadata: DefinedTypeNodeMetadata;

  readonly type: TypeNode;

  constructor(metadata: DefinedTypeNodeMetadata, type: TypeNode) {
    this.metadata = { ...metadata, name: mainCase(metadata.name) };
    this.type = type;
  }

  static fromIdl(idl: Partial<IdlDefinedType>): DefinedTypeNode {
    const name = idl.name ?? '';
    const docs = idl.docs ?? [];
    const idlType = idl.type ?? { kind: 'struct', fields: [] };
    const type = createTypeNodeFromIdl({ name, ...idlType });
    return new DefinedTypeNode(
      { name, idlName: name, docs, internal: false },
      type
    );
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitDefinedType(this);
  }

  get name(): string {
    return this.metadata.name;
  }

  get docs(): string[] {
    return this.metadata.docs;
  }
}

export function isDefinedTypeNode(node: Node | null): node is DefinedTypeNode {
  return !!node && node.nodeClass === 'DefinedTypeNode';
}

export function assertDefinedTypeNode(
  node: Node | null
): asserts node is DefinedTypeNode {
  if (!isDefinedTypeNode(node)) {
    throw new Error(
      `Expected DefinedTypeNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
