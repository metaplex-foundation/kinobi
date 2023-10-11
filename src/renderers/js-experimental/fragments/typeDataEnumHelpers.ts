import * as nodes from '../../../nodes';
import { pascalCase } from '../../../shared';
import { Fragment, fragment, fragmentFromTemplate } from './common';

export function getTypeDataEnumHelpersFragment(
  name: string,
  typeNode: nodes.TypeNode
): Fragment {
  const isDataEnum =
    nodes.isEnumTypeNode(typeNode) && nodes.isDataEnum(typeNode);

  if (!isDataEnum) {
    return fragment('');
  }

  const strictName = pascalCase(name);
  const looseName = `${strictName}Args`;
  const context = { strictName, looseName, typeNode };

  return fragmentFromTemplate('typeDataEnumHelpers.njk', context).addImports(
    'solanaCodecsDataStructures',
    ['GetDataEnumKindContent', 'GetDataEnumKind']
  );
}
