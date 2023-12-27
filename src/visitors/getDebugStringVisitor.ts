import { Node } from '../nodes';
import { Visitor } from './visitor';
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
      const details = getNodeDetails(node).join('.');
      if (indent) {
        return `${indentSeparator.repeat(stackLevel)}${node.kind}${
          details ? ` [${details}]` : ''
        }`;
      }
      return `${node.kind}${details ? `[${details}]` : ''}`;
    },
    (node, values) => {
      const details = getNodeDetails(node).join('.');
      if (indent) {
        return [
          `${indentSeparator.repeat(stackLevel)}${node.kind}${
            details ? ` [${details}]` : ''
          }`,
          ...values,
        ].join('\n');
      }
      return `${node.kind}${details ? `[${details}]` : ''}(${values.join(
        ', '
      )})`;
    },
    { intercept }
  );

  return visitor;
}

function getNodeDetails(node: Node): string[] {
  switch (node.kind) {
    case 'programNode':
      return [node.name, node.publicKey];
    case 'instructionAccountNode':
      return [
        node.name,
        ...(node.isWritable ? ['writable'] : []),
        ...(node.isSigner === true ? ['signer'] : []),
        ...(node.isSigner === 'either' ? ['optionalSigner'] : []),
        ...(node.isOptional ? ['optional'] : []),
      ];
    case 'errorNode':
      return [node.code.toString(), node.name];
    case 'linkTypeNode':
      return [
        node.name,
        ...(node.importFrom === 'generated' ? [] : [`from:${node.importFrom}`]),
      ];
    case 'numberTypeNode':
      return [node.format, ...(node.endian === 'be' ? ['be'] : [])];
    case 'amountTypeNode':
      return [node.identifier, node.decimals.toString()];
    case 'stringTypeNode':
      return [node.encoding, node.size.kind];
    default:
      return 'name' in node ? [node.name] : [];
  }
}
