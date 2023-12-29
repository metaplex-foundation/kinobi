import { ValueNode } from '../../../nodes';
import { visit } from '../../../visitors';
import { NameApi } from '../nameTransformers';
import { renderValueNodeVisitor } from '../renderValueNodeVisitor';
import { Fragment } from './common';

export function getValueNodeFragment(
  value: ValueNode,
  nameApi: NameApi
): Fragment {
  return visit(value, renderValueNodeVisitor(nameApi));
}
