import { KinobiError } from '../shared';
import { Node, RootNode, assertIsNode } from '../nodes';
import { identityVisitor } from './identityVisitor';
import { visit } from './visitor';

/**
 * A loose typing of a Codama-standard root node.
 *
 * The Codama standard uses a different node representation than v1.0's own
 * node model (see `transform` below), so we deliberately do NOT type this as
 * v1.0's `RootNode` — that would be lying about the shape of the data.
 */
export type CodamaRootInput = {
  readonly kind: 'rootNode';
  readonly standard: string;
  readonly version: string;
  readonly program: unknown;
  readonly additionalPrograms?: unknown[];
};

/**
 * Translates a raw Codama-standard root (as parsed from JSON) into a v1.0
 * Kinobi root node.
 *
 * This cannot be implemented as a typed v1.0 visitor because the raw Codama
 * tree does not satisfy v1.0's node shapes (e.g. it uses `count` nodes on
 * collections instead of v1.0's `size` property, and wraps string/bytes
 * leaves in `sizePrefixTypeNode`/`fixedSizeTypeNode` instead of using v1.0's
 * native `size` property on those leaves). We therefore run a raw,
 * untyped deep-walk (`transform`) over the parsed JSON first to reshape it
 * into v1.0's node shapes, and only then canonicalize the result by
 * rebuilding every node through its v1.0 constructor via `identityVisitor`
 * (which also drops unknown Codama-only metadata such as `docs`/`display`).
 */
export function normalizeCodamaRoot(root: CodamaRootInput): RootNode {
  const v1Root = transform(root) as Node;
  assertIsNode(v1Root, 'rootNode');
  return visit(v1Root, identityVisitor()) as RootNode;
}

type JsonRecord = Record<string, unknown>;

function isPlainObject(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function transform(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(transform);
  }
  if (!isPlainObject(value)) {
    return value;
  }
  if (typeof value.kind !== 'string') {
    return transformValues(value);
  }
  switch (value.kind) {
    case 'rootNode':
      return transformRoot(value);
    case 'arrayTypeNode':
    case 'setTypeNode':
      return transformArrayOrSetType(value);
    case 'mapTypeNode':
      return transformMapType(value);
    case 'sizePrefixTypeNode':
      return transformSizePrefixType(value);
    case 'fixedSizeTypeNode':
      return transformFixedSizeType(value);
    case 'stringTypeNode':
      return transformBareStringType(value);
    case 'bytesTypeNode':
      return transformBareBytesType(value);
    default:
      return transformValues(value);
  }
}

/**
 * Codama-only metadata keys that no v1.0 node ever reads. Most node kinds
 * get rebuilt through an explicit `identityVisitor` handler whose builder
 * only picks known fields (which incidentally drops these), but some kinds
 * (e.g. `numberTypeNode`) have no such handler and fall back to a shallow
 * `{ ...node }` copy — which would otherwise let these keys (and any
 * Codama-only node kinds nested inside them, like `display`'s
 * `structFieldDisplayNode`/`instructionAccountDisplayNode`) leak into the
 * final v1.0 root. Drop them explicitly and unconditionally here instead of
 * relying on that inconsistent per-kind behavior downstream.
 */
const CODAMA_ONLY_METADATA_KEYS = new Set(['display']);

/** Generic recursion: copy the object, transforming every child value. */
function transformValues(obj: JsonRecord): JsonRecord {
  const result: JsonRecord = {};
  Object.entries(obj).forEach(([key, child]) => {
    if (CODAMA_ONLY_METADATA_KEYS.has(key)) return;
    result[key] = transform(child);
  });
  return result;
}

// 1. rootNode: `program` + `additionalPrograms` -> a flat `programs` array.
function transformRoot(obj: JsonRecord): JsonRecord {
  const additionalPrograms = Array.isArray(obj.additionalPrograms)
    ? obj.additionalPrograms
    : [];
  return {
    kind: 'rootNode',
    programs: [obj.program, ...additionalPrograms].map(transform),
  };
}

// 2. arrayTypeNode / setTypeNode: `count` -> `size`.
function transformArrayOrSetType(obj: JsonRecord): JsonRecord {
  const { count, ...rest } = obj;
  return { ...transformValues(rest), size: countToSize(count) };
}

// 2. mapTypeNode: `count` -> `size`.
function transformMapType(obj: JsonRecord): JsonRecord {
  const { count, ...rest } = obj;
  return { ...transformValues(rest), size: countToSize(count) };
}

function countToSize(count: unknown): JsonRecord {
  if (!isPlainObject(count) || typeof count.kind !== 'string') {
    throw new KinobiError(
      `Expected a Codama count node whilst normalizing a Codama root, got: ${JSON.stringify(
        count
      )}.`
    );
  }
  switch (count.kind) {
    case 'fixedCountNode':
      return { kind: 'fixedSizeNode', size: count.value };
    case 'prefixedCountNode':
      return { kind: 'prefixedSizeNode', prefix: transform(count.prefix) };
    case 'remainderCountNode':
      return { kind: 'remainderSizeNode' };
    default:
      throw new KinobiError(
        `Unsupported Codama count node kind [${count.kind}] whilst normalizing a Codama root.`
      );
  }
}

// 3. sizePrefixTypeNode: collapse around string/bytes leaves, keep the
// wrapper node around anything else (e.g. structs).
function transformSizePrefixType(obj: JsonRecord): JsonRecord {
  const { type } = obj;
  const prefix = transform(obj.prefix);
  if (isPlainObject(type) && type.kind === 'stringTypeNode') {
    return {
      kind: 'stringTypeNode',
      encoding: type.encoding ?? 'utf8',
      size: { kind: 'prefixedSizeNode', prefix },
    };
  }
  if (isPlainObject(type) && type.kind === 'bytesTypeNode') {
    return {
      kind: 'bytesTypeNode',
      size: { kind: 'prefixedSizeNode', prefix },
    };
  }
  return { kind: 'sizePrefixTypeNode', type: transform(type), prefix };
}

// 4. fixedSizeTypeNode: collapse around string/bytes leaves, keep the
// wrapper node around anything else (e.g. structs).
function transformFixedSizeType(obj: JsonRecord): JsonRecord {
  const { type, size } = obj;
  if (isPlainObject(type) && type.kind === 'stringTypeNode') {
    return {
      kind: 'stringTypeNode',
      encoding: type.encoding ?? 'utf8',
      size: { kind: 'fixedSizeNode', size },
    };
  }
  if (isPlainObject(type) && type.kind === 'bytesTypeNode') {
    return {
      kind: 'bytesTypeNode',
      size: { kind: 'fixedSizeNode', size },
    };
  }
  return { kind: 'fixedSizeTypeNode', type: transform(type), size };
}

// 5. Bare stringTypeNode/bytesTypeNode reached via generic recursion (i.e.
// NOT consumed by a sizePrefix/fixedSize parent) need v1.0's default size.
function transformBareStringType(obj: JsonRecord): JsonRecord {
  const result = transformValues(obj);
  if (result.size === undefined) {
    result.size = {
      kind: 'prefixedSizeNode',
      prefix: { kind: 'numberTypeNode', format: 'u32', endian: 'le' },
    };
  }
  return result;
}

function transformBareBytesType(obj: JsonRecord): JsonRecord {
  const result = transformValues(obj);
  if (result.size === undefined) {
    result.size = { kind: 'remainderSizeNode' };
  }
  return result;
}
