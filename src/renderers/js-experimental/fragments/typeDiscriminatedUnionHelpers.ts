import { TypeNode, isDataEnum, isNode } from '../../../nodes';
import type { GlobalFragmentScope } from '../getRenderMapVisitor';
import { Fragment, fragment, fragmentFromTemplate } from './common';

export function getTypeDiscriminatedUnionHelpersFragment(
  scope: Pick<GlobalFragmentScope, 'nameApi'> & {
    name: string;
    typeNode: TypeNode;
  }
): Fragment {
  const { name, typeNode, nameApi } = scope;
  const isDiscriminatedUnion =
    isNode(typeNode, 'enumTypeNode') && isDataEnum(typeNode);

  if (!isDiscriminatedUnion) {
    return fragment('');
  }

  return fragmentFromTemplate('typeDiscriminatedUnionHelpers.njk', {
    strictName: nameApi.dataType(name),
    looseName: nameApi.dataArgsType(name),
    discriminatedUnionDiscriminator:
      nameApi.discriminatedUnionDiscriminator(name),
    getVariant: (variant: string) => nameApi.discriminatedUnionVariant(variant),
    discriminatedUnionFunction: nameApi.discriminatedUnionFunction(name),
    isDiscriminatedUnionFunction: nameApi.isDiscriminatedUnionFunction(name),
    typeNode,
  }).addImports('solanaCodecsDataStructures', [
    'type GetDiscriminatedUnionVariantContent',
    'type GetDiscriminatedUnionVariant',
  ]);
}
