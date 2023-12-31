import { TypeNode, isDataEnum, isNode } from '../../../nodes';
import { NameApi } from '../nameTransformers';
import { Fragment, fragment, fragmentFromTemplate } from './common';

export function getTypeDataEnumHelpersFragment(scope: {
  name: string;
  typeNode: TypeNode;
  nameApi: NameApi;
}): Fragment {
  const { name, typeNode, nameApi } = scope;
  const isDataEnumNode =
    isNode(typeNode, 'enumTypeNode') && isDataEnum(typeNode);

  if (!isDataEnumNode) {
    return fragment('');
  }

  return fragmentFromTemplate('typeDataEnumHelpers.njk', {
    strictName: nameApi.dataType(name),
    looseName: nameApi.dataArgsType(name),
    dataEnumFunction: nameApi.dataEnumFunction(name),
    isDataEnumFunction: nameApi.isDataEnumFunction(name),
    typeNode,
  }).addImports('solanaCodecsDataStructures', [
    'GetDataEnumKindContent',
    'GetDataEnumKind',
  ]);
}
