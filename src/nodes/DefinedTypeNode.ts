import { pascalCase } from '../utils';
import type { IdlDefinedType } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import type { TypeEnumNode } from './TypeEnumNode';
import { assertTypeStructOrEnumNode, createTypeNodeFromIdl } from './TypeNode';
import type { TypeStructNode } from './TypeStructNode';

export type DefinedTypeNodeMetadata = {
  name: string;
  idlName: string;
  docs: string[];
};

export class DefinedTypeNode implements Visitable {
  readonly nodeClass = 'DefinedTypeNode' as const;

  constructor(
    readonly metadata: DefinedTypeNodeMetadata,
    readonly type: TypeStructNode | TypeEnumNode
  ) {}

  static fromIdl(idl: Partial<IdlDefinedType>): DefinedTypeNode {
    const idlName = idl.name ?? '';
    const name = pascalCase(idlName);
    const docs = idl.docs ?? [];
    const idlType = idl.type ?? { kind: 'struct', fields: [] };
    const type = createTypeNodeFromIdl({ name, ...idlType });
    assertTypeStructOrEnumNode(type);
    return new DefinedTypeNode({ name, idlName, docs }, type);
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
