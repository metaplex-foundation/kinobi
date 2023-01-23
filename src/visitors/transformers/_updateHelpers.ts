import * as nodes from '../../nodes';
import { NodeStack } from '../NodeStack';
import { NodeTransformer } from './TransformNodesVisitor';

export type StructUpdates =
  | NodeTransformer<nodes.TypeStructNode>
  | {
      name?: string;
      fields?: Record<string, nodes.TypeStructFieldNodeMetadata>;
    };

export function updateStructNode(
  updates: StructUpdates,
  node: nodes.TypeStructNode,
  stack: NodeStack,
  program: nodes.ProgramNode | null
): nodes.TypeStructNode {
  if (typeof updates === 'function') {
    const newNode = updates(node, stack, program);
    nodes.assertTypeStructNode(newNode);
    return newNode;
  }
  return new nodes.TypeStructNode(
    updates.name ?? node.name,
    node.fields.map((field) =>
      updates.fields?.[field.name]
        ? new nodes.TypeStructFieldNode(
            { ...field.metadata, ...updates.fields[field.name] },
            field.type
          )
        : field
    )
  );
}

export type EnumUpdates =
  | NodeTransformer<nodes.TypeEnumNode>
  | {
      name?: string;
      variants?: Record<string, string>;
    };

export function updateEnumNode(
  updates: EnumUpdates,
  node: nodes.TypeEnumNode,
  stack: NodeStack,
  program: nodes.ProgramNode | null
): nodes.TypeEnumNode {
  if (typeof updates === 'function') {
    const newNode = updates(node, stack, program);
    nodes.assertTypeEnumNode(newNode);
    return newNode;
  }
  return new nodes.TypeEnumNode(
    updates.name ?? node.name,
    node.variants.map((variant) =>
      updates.variants?.[variant.name]
        ? renameEnumVariant(variant, updates.variants[variant.name])
        : variant
    )
  );
}

function renameEnumVariant(
  variant: nodes.TypeEnumVariantNode,
  newName: string
) {
  if (nodes.isTypeEnumStructVariantNode(variant)) {
    return new nodes.TypeEnumStructVariantNode(newName, variant.struct);
  }
  if (nodes.isTypeEnumTupleVariantNode(variant)) {
    return new nodes.TypeEnumTupleVariantNode(newName, variant.tuple);
  }
  return new nodes.TypeEnumEmptyVariantNode(newName);
}
