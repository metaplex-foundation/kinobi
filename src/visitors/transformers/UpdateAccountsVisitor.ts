import * as nodes from '../../nodes';
import { mainCase } from '../../utils';
import { Dependency } from '../Dependency';
import {
  NodeTransform,
  NodeTransformer,
  TransformNodesVisitor,
} from './TransformNodesVisitor';
import { renameStructNode } from './_renameHelpers';

export type AccountUpdates =
  | NodeTransformer<nodes.AccountNode>
  | { delete: true }
  | (Partial<nodes.AccountNodeMetadata> & {
      data?: Record<string, string>;
      link?: true | string | { name: string; dependency: Dependency };
    });

export class UpdateAccountsVisitor extends TransformNodesVisitor {
  constructor(readonly map: Record<string, AccountUpdates>) {
    const transforms = Object.entries(map).map(
      ([selector, updates]): NodeTransform => {
        const selectorStack = selector.split('.');
        const name = selectorStack.pop();
        return {
          selector: { type: 'account', stack: selectorStack, name },
          transformer: (node, stack, program) => {
            nodes.assertAccountNode(node);
            if (typeof updates === 'function') {
              return updates(node, stack, program);
            }
            if ('delete' in updates) {
              return null;
            }
            const newName = mainCase(updates.name ?? node.name);
            const data = updates.data ?? {};
            const link = updates.link ? parseLink(newName, updates.link) : null;

            let newType: nodes.AccountNode['type'] = node.type;
            if (link) {
              newType = new nodes.TypeDefinedLinkNode(link.name, {
                dependency: link.dependency,
              });
            } else if (nodes.isTypeStructNode(node.type)) {
              newType = renameStructNode(node.type, data, newName);
            }

            return new nodes.AccountNode(
              { ...node.metadata, ...updates },
              newType
            );
          },
        };
      }
    );

    super(transforms);
  }
}

function parseLink(
  name: string,
  link: true | string | { name: string; dependency: Dependency }
): { name: string; dependency: Dependency } {
  if (typeof link === 'boolean') {
    return { name: `${name}AccountData`, dependency: 'hooked' };
  }
  if (typeof link === 'string') {
    return { name: link, dependency: 'hooked' };
  }
  return link;
}
