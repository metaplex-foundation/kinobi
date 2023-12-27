import { RegisteredNodes } from '../nodes';
import { identityVisitor } from './identityVisitor';
import { interceptVisitor } from './interceptVisitor';

export function removeDocsVisitor<
  TNodeKeys extends keyof RegisteredNodes = keyof RegisteredNodes
>(nodeKeys?: TNodeKeys[]) {
  return interceptVisitor(identityVisitor(nodeKeys), (node, next) => {
    if ('docs' in node) {
      return { ...node, docs: [] };
    }
    return next(node);
  });
}
