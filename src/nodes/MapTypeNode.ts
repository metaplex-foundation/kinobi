import type { IdlTypeMap } from '../idl';
import type { Visitable, Visitor } from '../visitors';
import type { Node } from './Node';
import { createTypeNodeFromIdl, TypeNode } from './TypeNode';
import { NumberTypeNode } from './NumberTypeNode';

export type MapTypeNode = {
  readonly __mapTypeNode: unique symbol;
  readonly nodeClass: 'MapTypeNode';
};

export type MapTypeNodeInput = {
  // ...
};

export function mapTypeNode(input: MapTypeNodeInput): MapTypeNode {
  return { ...input, nodeClass: 'MapTypeNode' } as MapTypeNode;
}

export function mapTypeNodeFromIdl(idl: MapTypeNodeIdl): MapTypeNode {
  return mapTypeNode(idl);
}

export class MapTypeNode implements Visitable {
  readonly nodeClass = 'MapTypeNode' as const;

  readonly key: TypeNode;

  readonly value: TypeNode;

  readonly size:
    | { kind: 'fixed'; size: number }
    | { kind: 'prefixed'; prefix: NumberTypeNode }
    | { kind: 'remainder' };

  readonly idlType: 'hashMap' | 'bTreeMap';

  constructor(
    key: TypeNode,
    value: TypeNode,
    options: {
      size?: MapTypeNode['size'];
      idlType?: 'hashMap' | 'bTreeMap';
    } = {}
  ) {
    this.key = key;
    this.value = value;
    this.size = options.size ?? {
      kind: 'prefixed',
      prefix: new NumberTypeNode('u32'),
    };
    this.idlType = options.idlType ?? 'hashMap';
  }

  static fromIdl(idl: IdlTypeMap): MapTypeNode {
    const idlType = 'hashMap' in idl ? 'hashMap' : 'bTreeMap';
    const [key, value] = 'hashMap' in idl ? idl.hashMap : idl.bTreeMap;
    let size: MapTypeNode['size'] | undefined;
    if (idl.size === 'remainder') {
      size = { kind: 'remainder' };
    } else if (typeof idl.size === 'number') {
      size = { kind: 'fixed', size: idl.size };
    } else if (idl.size) {
      size = { kind: 'prefixed', prefix: new NumberTypeNode(idl.size) };
    }
    return new MapTypeNode(
      createTypeNodeFromIdl(key),
      createTypeNodeFromIdl(value),
      { idlType, size }
    );
  }

  accept<T>(visitor: Visitor<T>): T {
    return visitor.visitTypeMap(this);
  }
}

export function isMapTypeNode(node: Node | null): node is MapTypeNode {
  return !!node && node.nodeClass === 'MapTypeNode';
}

export function assertMapTypeNode(
  node: Node | null
): asserts node is MapTypeNode {
  if (!isMapTypeNode(node)) {
    throw new Error(`Expected MapTypeNode, got ${node?.nodeClass ?? 'null'}.`);
  }
}
