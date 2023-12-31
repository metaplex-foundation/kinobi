import { pipe } from '../shared';
import { Node } from '../nodes';
import { interceptVisitor } from './interceptVisitor';
import { mergeVisitor } from './mergeVisitor';
import { Visitor } from './visitor';

export function getDebugStringVisitor(
  options: { indent?: boolean; indentSeparator?: string } = {}
): Visitor<string> {
  const indent = options.indent ?? false;
  const indentSeparator = options.indentSeparator ?? '|   ';
  let stackLevel = -1;

  return pipe(
    mergeVisitor<string>(
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
      }
    ),
    (v) =>
      interceptVisitor(v, (node, next) => {
        stackLevel += 1;
        const newNode = next(node);
        stackLevel -= 1;
        return newNode;
      })
  );
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
    case 'programLinkNode':
    case 'pdaLinkNode':
    case 'accountLinkNode':
    case 'definedTypeLinkNode':
      return [
        node.name,
        ...(node.importFrom ? [`from:${node.importFrom}`] : []),
      ];
    case 'numberTypeNode':
      return [node.format, ...(node.endian === 'be' ? ['be'] : [])];
    case 'amountTypeNode':
      return [node.identifier, node.decimals.toString()];
    case 'stringTypeNode':
      return [node.encoding];
    case 'fixedSizeNode':
      return [node.size.toString()];
    default:
      return 'name' in node ? [node.name] : [];
  }
}
