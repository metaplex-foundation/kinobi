import { Visitor } from './Visitor';
import { MergeVisitorInterceptor, mergeVisitor } from './mergeVisitor';

export function getDebugStringVisitor(
  options: { indent?: boolean; indentSeparator?: string } = {}
): Visitor<string> {
  const indent = options.indent ?? false;
  const indentSeparator = options.indentSeparator ?? '|   ';
  let stackLevel = -1;
  const intercept: MergeVisitorInterceptor<string> = (fn) => (node) => {
    stackLevel += 1;
    const newNode = fn(node);
    stackLevel -= 1;
    return newNode;
  };

  const visitor = mergeVisitor<string>(
    (node) => {
      if (indent) {
        return `${indentSeparator.repeat(stackLevel)}[${node.kind}]`;
      }
      return `${node.kind}`;
    },
    (node, values) => {
      if (indent) {
        return [
          `${indentSeparator.repeat(stackLevel)}[${node.kind}]`,
          ...values,
        ].join('\n');
      }
      return `${node.kind}(${values.join(', ')})`;
    },
    { intercept }
  );

  return visitor;
}
