import type { IdlTypeOption } from '../idl';
import type { Node } from './Node';
import { NumberTypeNode, numberTypeNode } from './NumberTypeNode';
import { TypeNode, createTypeNodeFromIdl } from './TypeNode';

export type OptionTypeNode = {
  readonly __optionTypeNode: unique symbol;
  readonly nodeClass: 'OptionTypeNode';
  readonly childNode: TypeNode;
  readonly prefixNode: NumberTypeNode;
  readonly fixed: boolean;
  readonly idlOption: 'option' | 'coption';
};

export function optionTypeNode(
  childNode: TypeNode,
  options: {
    readonly prefixNode?: NumberTypeNode;
    readonly fixed?: boolean;
    readonly idlOption?: OptionTypeNode['idlOption'];
  } = {}
): OptionTypeNode {
  return {
    nodeClass: 'OptionTypeNode',
    childNode,
    prefixNode: options.prefixNode ?? numberTypeNode('u8'),
    fixed: options.fixed ?? false,
    idlOption: options.idlOption ?? 'option',
  } as OptionTypeNode;
}

export function optionTypeNodeFromIdl(idl: IdlTypeOption): OptionTypeNode {
  const childNode = 'option' in idl ? idl.option : idl.coption;
  const defaultPrefix = numberTypeNode('option' in idl ? 'u8' : 'u32');
  const defaultFixed = !('option' in idl);
  return optionTypeNode(createTypeNodeFromIdl(childNode), {
    prefixNode: idl.prefix ? numberTypeNode(idl.prefix) : defaultPrefix,
    fixed: idl.fixed !== undefined ? idl.fixed : defaultFixed,
    idlOption: 'option' in idl ? 'option' : 'coption',
  });
}

export function isOptionTypeNode(node: Node | null): node is OptionTypeNode {
  return !!node && node.nodeClass === 'OptionTypeNode';
}

export function assertOptionTypeNode(
  node: Node | null
): asserts node is OptionTypeNode {
  if (!isOptionTypeNode(node)) {
    throw new Error(
      `Expected OptionTypeNode, got ${node?.nodeClass ?? 'null'}.`
    );
  }
}
