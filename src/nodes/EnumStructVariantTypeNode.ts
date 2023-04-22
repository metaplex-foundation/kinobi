import type { IdlTypeEnumField, IdlTypeEnumVariant } from '../idl';
import { InvalidKinobiTreeError, mainCase } from '../shared';
import type { Node } from './Node';
import { StructTypeNode, structTypeNodeFromIdl } from './StructTypeNode';

export type EnumStructVariantTypeNode = {
  readonly __enumStructVariantTypeNode: unique symbol;
  readonly nodeClass: 'EnumStructVariantTypeNode';
  readonly name: string;
  readonly struct: StructTypeNode;
};

export function enumStructVariantTypeNode(
  name: string,
  struct: StructTypeNode
): EnumStructVariantTypeNode {
  if (!name) {
    throw new InvalidKinobiTreeError(
      'EnumStructVariantTypeNode must have a name.'
    );
  }
  return {
    nodeClass: 'EnumStructVariantTypeNode',
    name: mainCase(name),
    struct,
  } as EnumStructVariantTypeNode;
}

export function enumStructVariantTypeNodeFromIdl(
  idl: IdlTypeEnumVariant
): EnumStructVariantTypeNode {
  const name = idl.name ?? '';
  return enumStructVariantTypeNode(
    name,
    structTypeNodeFromIdl({
      kind: 'struct',
      name,
      fields: idl.fields as IdlTypeEnumField[],
    })
  );
}

export function isEnumStructVariantTypeNode(
  node: Node | null
): node is EnumStructVariantTypeNode {
  return !!node && node.nodeClass === 'EnumStructVariantTypeNode';
}

export function assertEnumStructVariantTypeNode(
  node: Node | null
): asserts node is EnumStructVariantTypeNode {
  if (!isEnumStructVariantTypeNode(node)) {
    throw new Error(
      `Expected EnumStructVariantTypeNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
