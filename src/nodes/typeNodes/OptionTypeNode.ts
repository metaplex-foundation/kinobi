import type { IdlTypeOption } from '../../idl';
import { NumberTypeNode, numberTypeNode } from './NumberTypeNode';
import {
  ResolveNestedTypeNode,
  TypeNode,
  createTypeNodeFromIdl,
} from './TypeNode';

export interface OptionTypeNode<
  TItem extends TypeNode = TypeNode,
  TPrefix extends
    ResolveNestedTypeNode<NumberTypeNode> = ResolveNestedTypeNode<NumberTypeNode>,
> {
  readonly kind: 'optionTypeNode';

  // Children.
  readonly item: TItem;
  readonly prefix: TPrefix;

  // Data.
  readonly fixed: boolean;
  readonly idlOption: 'option' | 'coption';
}

export function optionTypeNode<
  TItem extends TypeNode,
  TPrefix extends ResolveNestedTypeNode<NumberTypeNode> = NumberTypeNode<'u8'>,
>(
  item: TItem,
  options: {
    readonly prefix?: TPrefix;
    readonly fixed?: boolean;
    readonly idlOption?: OptionTypeNode['idlOption'];
  } = {}
): OptionTypeNode<TItem, TPrefix> {
  return {
    kind: 'optionTypeNode',
    item,
    prefix: (options.prefix ?? numberTypeNode('u8')) as TPrefix,
    fixed: options.fixed ?? false,
    idlOption: options.idlOption ?? 'option',
  };
}

export function optionTypeNodeFromIdl(idl: IdlTypeOption): OptionTypeNode {
  const item = 'option' in idl ? idl.option : idl.coption;
  const defaultPrefix = numberTypeNode('option' in idl ? 'u8' : 'u32');
  const defaultFixed = !('option' in idl);
  return optionTypeNode(createTypeNodeFromIdl(item), {
    prefix: idl.prefix ? numberTypeNode(idl.prefix) : defaultPrefix,
    fixed: idl.fixed !== undefined ? idl.fixed : defaultFixed,
    idlOption: 'option' in idl ? 'option' : 'coption',
  });
}
