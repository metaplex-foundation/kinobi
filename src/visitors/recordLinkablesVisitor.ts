import { LinkableDictionary } from '../shared';
import {
  RegisteredNodes,
  getAllAccounts,
  getAllDefinedTypes,
  getAllPdas,
} from '../nodes';
import { Visitor } from './visitor';
import { VisitorOverrides, extendVisitor } from './extendVisitor';

export function recordLinkablesVisitor<
  TReturn,
  TNodeKeys extends keyof RegisteredNodes
>(
  visitor: Visitor<TReturn, TNodeKeys>,
  linkables: LinkableDictionary
): Visitor<TReturn, TNodeKeys> {
  const overriddenFunctions: VisitorOverrides<
    TReturn,
    'rootNode' | 'programNode' | 'pdaNode' | 'accountNode' | 'definedTypeNode'
  > = {
    visitRoot(node, { next }) {
      linkables.recordAll([
        ...node.programs,
        ...getAllPdas(node),
        ...getAllAccounts(node),
        ...getAllDefinedTypes(node),
      ]);
      return next(node);
    },
    visitProgram(node, { next }) {
      linkables.recordAll([
        node,
        ...node.pdas,
        ...node.accounts,
        ...node.definedTypes,
      ]);
      return next(node);
    },
    visitPda(node, { next }) {
      linkables.record(node);
      return next(node);
    },
    visitAccount(node, { next }) {
      linkables.record(node);
      return next(node);
    },
    visitDefinedType(node, { next }) {
      linkables.record(node);
      return next(node);
    },
  };
  return extendVisitor(
    visitor,
    overriddenFunctions as VisitorOverrides<TReturn, TNodeKeys>
  );
}
