import { RegisteredNodes } from '../nodes';
import { IdentityVisitorInterceptor, identityVisitor } from './identityVisitor';

export function removeDocsVisitor<
  TNodeKeys extends keyof RegisteredNodes = keyof RegisteredNodes
>(
  options: {
    nodeKeys?: TNodeKeys[];
  } = {}
) {
  const intercept: IdentityVisitorInterceptor = (fn) => (node) => {
    if ('docs' in node) {
      return { ...node, docs: [] };
    }
    return fn(node);
  };
  return identityVisitor({ ...options, intercept });
}
