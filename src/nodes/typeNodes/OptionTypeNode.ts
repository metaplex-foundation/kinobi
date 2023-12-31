import type { IdlTypeOption } from '../../idl';
import { NumberTypeNode, numberTypeNode } from './NumberTypeNode';
import { TypeNode, createTypeNodeFromIdl } from './TypeNode';

export type OptionTypeNode = {
  readonly kind: 'optionTypeNode';
  readonly child: TypeNode;
  readonly prefix: NumberTypeNode;
  readonly fixed: boolean;
  readonly idlOption: 'option' | 'coption';
};

export function optionTypeNode(
  child: TypeNode,
  options: {
    readonly prefix?: NumberTypeNode;
    readonly fixed?: boolean;
    readonly idlOption?: OptionTypeNode['idlOption'];
  } = {}
): OptionTypeNode {
  return {
    kind: 'optionTypeNode',
    child,
    prefix: options.prefix ?? numberTypeNode('u8'),
    fixed: options.fixed ?? false,
    idlOption: options.idlOption ?? 'option',
  };
}

export function optionTypeNodeFromIdl(idl: IdlTypeOption): OptionTypeNode {
  const child = 'option' in idl ? idl.option : idl.coption;
  const defaultPrefix = numberTypeNode('option' in idl ? 'u8' : 'u32');
  const defaultFixed = !('option' in idl);
  return optionTypeNode(createTypeNodeFromIdl(child), {
    prefix: idl.prefix ? numberTypeNode(idl.prefix) : defaultPrefix,
    fixed: idl.fixed !== undefined ? idl.fixed : defaultFixed,
    idlOption: 'option' in idl ? 'option' : 'coption',
  });
}
