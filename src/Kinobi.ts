import {
  assertIsNode,
  IdlInputs,
  Node,
  rootNode,
  RootNode,
  rootNodeFromIdls,
} from './nodes';
import { defaultVisitor, visit, Visitor } from './visitors';

export interface Kinobi {
  getRoot(): RootNode;
  getJson(): string;
  accept<T>(visitor: Visitor<T>): T;
  update(visitor: Visitor<Node | null>): void;
  clone(): Kinobi;
}

export function createFromRoot(
  root: RootNode,
  useDefaultVisitor = true
): Kinobi {
  let currentRoot = root;
  if (useDefaultVisitor) {
    currentRoot = visit(currentRoot, defaultVisitor());
  }
  return {
    getRoot(): RootNode {
      return currentRoot;
    },
    getJson(): string {
      return JSON.stringify(currentRoot);
    },
    accept<T>(visitor: Visitor<T>): T {
      return visit(currentRoot, visitor);
    },
    update(visitor: Visitor<Node | null>): void {
      const newRoot = visit(currentRoot, visitor);
      assertIsNode(newRoot, 'rootNode');
      currentRoot = newRoot;
    },
    clone(): Kinobi {
      return createFromRoot(rootNode(currentRoot.programs));
    },
  };
}

export function createFromIdls(
  idls: IdlInputs,
  useDefaultVisitor = true
): Kinobi {
  return createFromRoot(rootNodeFromIdls(idls), useDefaultVisitor);
}

export function createFromJson(
  json: string,
  useDefaultVisitor = false
): Kinobi {
  return createFromRoot(JSON.parse(json) as RootNode, useDefaultVisitor);
}
