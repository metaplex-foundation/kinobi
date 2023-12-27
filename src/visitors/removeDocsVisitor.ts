import { Node, RegisteredNodes } from '../nodes';
import { identityVisitor } from './identityVisitor';
import { VisitorInterceptor, interceptVisitor } from './interceptVisitor';

export function removeDocsVisitor<
  TNodeKeys extends keyof RegisteredNodes = keyof RegisteredNodes
>(nodeKeys?: TNodeKeys[]) {
  const interceptor: VisitorInterceptor<Node | null> = (fn) => (node) => {
    if ('docs' in node) {
      return { ...node, docs: [] };
    }
    return fn(node);
  };
  return interceptVisitor(identityVisitor(nodeKeys), interceptor);
}
