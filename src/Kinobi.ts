import {
  assertIsNode,
  IdlInput,
  KinobiVersion,
  Node,
  RootNode,
  rootNodeFromIdl,
} from './nodes';
import { KinobiError } from './shared';
import { defaultVisitor, identityVisitor, visit, Visitor } from './visitors';

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
  if (currentRoot.standard === 'codama') {
    validateCodamaVersion(currentRoot.version);
    currentRoot = normalizeCodamaRoot(currentRoot);
  } else {
    validateKinobiVersion(currentRoot.version);
  }
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

/**
 * Rebuilds every node of a Codama-standard root through the Kinobi node
 * constructors. This main-cases names, fills in defaulted fields (such as
 * `idlName` or the program `prefix`) and drops unknown metadata keys (such
 * as `display` or `provides`). The resulting root is stamped with the
 * `kinobi` standard by the `rootNode` constructor.
 */
function normalizeCodamaRoot(root: RootNode): RootNode {
  const newRoot = visit(root, identityVisitor());
  assertIsNode(newRoot, 'rootNode');
  return newRoot;
}

function validateCodamaVersion(rootVersion: KinobiVersion): void {
  const [rootMajor] = rootVersion.split('.').map(Number);
  if (rootMajor === 1) return;
  throw new KinobiError(
    `The provided IDL uses version [${rootVersion}] of the Codama standard ` +
      `which is not supported by this version of Kinobi. ` +
      `Only Codama standard v1 IDLs are supported.`
  );
}
