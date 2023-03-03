import * as nodes from '../../nodes';
import { AccountNodeMetadata } from '../../nodes';
import { mainCase } from '../../utils';
import { Dependency } from '../Dependency';
import {
  NodeTransform,
  NodeTransformer,
  TransformNodesVisitor,
} from './TransformNodesVisitor';
import { renameStructNode } from './_renameHelpers';

type AccountLinkOptions = {
  name: string;
  dependency: Dependency;
  extract: boolean;
  extractAs: string;
  extractedTypeShouldBeInternal: boolean;
};

export type AccountUpdates =
  | NodeTransformer<nodes.AccountNode>
  | { delete: true }
  | (Partial<nodes.AccountNodeMetadata> & {
      data?: Record<string, string>;
      link?: true | Partial<AccountLinkOptions>;
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
            const newGpaFields: nodes.AccountNodeGpaField[] =
              node.metadata.gpaFields.map((f) => ({
                ...f,
                name: data[f.name] ?? f.name,
              }));
            const newMetadata: AccountNodeMetadata = {
              ...node.metadata,
              gpaFields: newGpaFields,
              ...updates,
            };

            const link = updates.link ? parseLink(newName, updates.link) : null;
            if (link) {
              return new nodes.AccountNode(
                newMetadata,
                new nodes.TypeDefinedLinkNode(link.name, {
                  dependency: link.dependency,
                })
              );
            }

            if (nodes.isTypeStructNode(node.type)) {
              return new nodes.AccountNode(
                newMetadata,
                renameStructNode(node.type, data, newName)
              );
            }

            return new nodes.AccountNode(newMetadata, node.type);
          },
        };
      }
    );

    super(transforms);
  }
}

function parseLink(
  name: string,
  link: true | Partial<AccountLinkOptions>
): AccountLinkOptions {
  const defaultOptions = {
    name: `${name}AccountData`,
    dependency: 'hooked',
    extract: false,
    extractAs: `${name}AccountData`,
    extractedTypeShouldBeInternal: true,
  };
  return typeof link === 'boolean'
    ? defaultOptions
    : { ...defaultOptions, ...link };
}
