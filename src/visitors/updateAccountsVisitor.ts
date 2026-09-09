import {
  AccountLinkNode,
  AccountNode,
  AccountNodeInput,
  PdaLinkNode,
  PdaNode,
  PdaSeedNode,
  accountLinkNode,
  accountNode,
  assertIsNode,
  pdaLinkNode,
  pdaNode,
  programNode,
  transformNestedTypeNode,
} from '../nodes';
import {
  MainCaseString,
  NodeSelector,
  mainCase,
  renameStructNode,
} from '../shared';
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

type AccountRelatedNode = AccountNode | AccountLinkNode | PdaNode | PdaLinkNode;

/**
 * Either a static set of updates, or a function computing them per node.
 * The function receives the matched `accountNode`, and — when the updates
 * rename the account — every matched `accountLinkNode`, `pdaNode` and
 * `pdaLinkNode` so they can follow the rename. Only `name` is honoured
 * for those related nodes.
 */
export type AccountUpdater =
  | AccountUpdates
  | ((node: AccountRelatedNode) => AccountUpdates);

export type AccountUpdateWithSelector = {
  select: NodeSelector | NodeSelector[];
  update: AccountUpdater;
};

export function updateAccountsVisitor(
  map: Record<string, AccountUpdates> | AccountUpdateWithSelector[]
) {
  const entries: AccountUpdateWithSelector[] = Array.isArray(map)
    ? map
    : Object.entries(map).map(([select, update]) => ({ select, update }));

  return bottomUpTransformerVisitor(
    entries.flatMap(({ select, update }) => {
      const selectors = Array.isArray(select) ? select : [select];
      const resolve = (node: AccountRelatedNode) =>
        typeof update === 'function' ? update(node) : update;
      const newNameFor = (node: AccountRelatedNode) => {
        const updates = resolve(node);
        return 'name' in updates && updates.name
          ? mainCase(updates.name)
          : undefined;
      };
      const pdasToUpsert = [] as { program: MainCaseString; pda: PdaNode }[];

      const transformers: BottomUpNodeTransformerWithSelector[] = [
        {
          select: ['[accountNode]', ...selectors],
          transform: (node, stack) => {
            assertIsNode(node, 'accountNode');
            const updates = resolve(node);
            if ('delete' in updates) return null;
            const newName = newNameFor(node);

            const { seeds, pda, ...assignableUpdates } = updates;
            let newPda = node.pda;
            if (pda && !pda.importFrom && seeds !== undefined) {
              newPda = pda;
              pdasToUpsert.push({
                program: stack.getProgram()!.name,
                pda: pdaNode(pda.name, seeds),
              });
            } else if (pda) {
              newPda = pda;
            } else if (seeds !== undefined && node.pda) {
              pdasToUpsert.push({
                program: stack.getProgram()!.name,
                pda: pdaNode(node.pda.name, seeds),
              });
            } else if (seeds !== undefined) {
              newPda = pdaLinkNode(newName ?? node.name);
              pdasToUpsert.push({
                program: stack.getProgram()!.name,
                pda: pdaNode(newName ?? node.name, seeds),
              });
            }

            return accountNode({
              ...node,
              ...assignableUpdates,
              data: transformNestedTypeNode(node.data, (struct) =>
                renameStructNode(struct, updates.data ?? {})
              ),
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
        {
          select: ['[accountLinkNode]', ...selectors],
          transform: (node) => {
            assertIsNode(node, 'accountLinkNode');
            if (node.importFrom) return node;
            const newName = newNameFor(node);
            return newName ? accountLinkNode(newName) : node;
          },
        },
        {
          select: ['[pdaNode]', ...selectors],
          transform: (node) => {
            assertIsNode(node, 'pdaNode');
            const newName = newNameFor(node);
            return newName ? pdaNode(newName, node.seeds) : node;
          },
        },
        {
          select: ['[pdaLinkNode]', ...selectors],
          transform: (node) => {
            assertIsNode(node, 'pdaLinkNode');
            if (node.importFrom) return node;
            const newName = newNameFor(node);
            return newName ? pdaLinkNode(newName) : node;
          },
        },
      ];

      return transformers;
    })
  );
}
