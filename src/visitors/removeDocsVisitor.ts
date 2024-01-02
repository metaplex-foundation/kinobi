import { NodeKind } from '../nodes';
import { identityVisitor } from './identityVisitor';
import { interceptVisitor } from './interceptVisitor';

export function removeDocsVisitor<TNodeKind extends NodeKind = NodeKind>(
  nodeKeys?: TNodeKind[]
) {
  return interceptVisitor(identityVisitor(nodeKeys), (node, next) => {
    if ('docs' in node) {
      return { ...node, docs: [] };
    }
    return next(node);
  });
}
