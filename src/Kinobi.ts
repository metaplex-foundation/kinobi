import {
  assertIsNode,
  IdlInput,
  KinobiVersion,
  Node,
  RootNode,
  rootNodeFromIdl,
} from './nodes';
import { KinobiError } from './shared';
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
  validateKinobiVersion(currentRoot.version);
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
      return createFromRoot({ ...currentRoot }, false);
    },
  };
}

export function createFromIdl(
  program: IdlInput,
  additionalPrograms: IdlInput[] = [],
  useDefaultVisitor = true
): Kinobi {
  return createFromRoot(
    rootNodeFromIdl(program, additionalPrograms),
    useDefaultVisitor
  );
}

export function createFromJson(
  json: string,
  useDefaultVisitor = false
): Kinobi {
  return createFromRoot(JSON.parse(json) as RootNode, useDefaultVisitor);
}

function validateKinobiVersion(rootVersion: KinobiVersion): void {
  // TODO: Replace with __VERSION__ variable when available.
  const kinobiVersion = '0.19.0';
  if (rootVersion === kinobiVersion) return;
  const [rootMajor, rootMinor] = rootVersion.split('.').map(Number);
  const [KinobiMajor, KinobiMinor] = kinobiVersion.split('.').map(Number);
  const isZeroMajor = rootMajor === 0 && KinobiMajor === 0;
  if (isZeroMajor && rootMinor === KinobiMinor) return;
  if (rootMajor === KinobiMajor) return;
  throw new KinobiError(
    `The provided IDL version [${rootVersion}] is not compatible with the installed Kinobi version [${kinobiVersion}]`
  );
}
