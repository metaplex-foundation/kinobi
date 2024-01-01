import {
  AccountNodeInput,
  PdaNode,
  PdaSeedNode,
  accountDataNode,
  accountLinkNode,
  accountNode,
  assertIsNode,
  pdaLinkNode,
  pdaNode,
  programNode,
} from '../nodes';
import { MainCaseString, mainCase, renameStructNode } from '../shared';
import {
  BottomUpNodeTransformerWithSelector,
  bottomUpTransformerVisitor,
} from './bottomUpTransformerVisitor';

export type AccountUpdates =
  | { delete: true }
  | (Partial<Omit<AccountNodeInput, 'data'>> & {
      data?: Record<string, string>;
      seeds?: PdaSeedNode[];
    });

export function updateAccountsVisitor(map: Record<string, AccountUpdates>) {
  return bottomUpTransformerVisitor(
    Object.entries(map).flatMap(([selector, updates]) => {
      const selectorStack = selector.split('.');
      const name = selectorStack.pop();
      const newName =
        typeof updates === 'object' && 'name' in updates && updates.name
          ? mainCase(updates.name)
          : undefined;
      const pdasToUpsert = [] as { program: MainCaseString; pda: PdaNode }[];

      const transformers: BottomUpNodeTransformerWithSelector[] = [
        {
          select: `${selectorStack.join('.')}.[accountNode]${name}`,
          transform: (node, stack) => {
            assertIsNode(node, 'accountNode');
            if ('delete' in updates) return null;

            const { seeds, pda, ...assignableUpdates } = updates;
            let newPda = node.pda;
            if (pda && !pda.importFrom && seeds) {
              newPda = pda;
              pdasToUpsert.push({
                program: stack.getProgram()!.name,
                pda: pdaNode(pda.name, seeds),
              });
            } else if (pda) {
              newPda = pda;
            } else if (seeds && node.pda) {
              pdasToUpsert.push({
                program: stack.getProgram()!.name,
                pda: pdaNode(node.pda.name, seeds),
              });
            } else if (seeds) {
              newPda = pdaLinkNode(newName ?? node.name);
              pdasToUpsert.push({
                program: stack.getProgram()!.name,
                pda: pdaNode(newName ?? node.name, seeds),
              });
            }

            return accountNode({
              ...node,
              ...assignableUpdates,
              data: accountDataNode({
                ...node.data,
                name: `${newName}AccountData`,
                struct: renameStructNode(node.data.struct, updates.data ?? {}),
              }),
              pda: newPda,
            });
          },
        },
        {
          select: `[programNode]`,
          transform: (node) => {
            assertIsNode(node, 'programNode');
            const pdasToUpsertForProgram = pdasToUpsert
              .filter((p) => p.program === node.name)
              .map((p) => p.pda);
            if (pdasToUpsertForProgram.length === 0) return node;
            const existingPdaNames = new Set(node.pdas.map((pda) => pda.name));
            const pdasToCreate = pdasToUpsertForProgram.filter(
              (p) => !existingPdaNames.has(p.name)
            );
            const pdasToUpdate = new Map(
              pdasToUpsertForProgram
                .filter((p) => existingPdaNames.has(p.name))
                .map((p) => [p.name, p])
            );
            const newPdas = [
              ...node.pdas.map((p) => pdasToUpdate.get(p.name) ?? p),
              ...pdasToCreate,
            ];
            return programNode({ ...node, pdas: newPdas });
          },
        },
      ];

      if (newName) {
        transformers.push(
          {
            select: `${selectorStack.join('.')}.[accountLinkNode]${name}`,
            transform: (node) => {
              assertIsNode(node, 'accountLinkNode');
              if (node.importFrom) return node;
              return accountLinkNode(newName);
            },
          },
          {
            select: `${selectorStack.join('.')}.[pdaNode]${name}`,
            transform: (node) => {
              assertIsNode(node, 'pdaNode');
              return pdaNode(newName, node.seeds);
            },
          },
          {
            select: `${selectorStack.join('.')}.[pdaLinkNode]${name}`,
            transform: (node) => {
              assertIsNode(node, 'pdaLinkNode');
              if (node.importFrom) return node;
              return pdaLinkNode(newName);
            },
          }
        );
      }

      return transformers;
    })
  );
}
