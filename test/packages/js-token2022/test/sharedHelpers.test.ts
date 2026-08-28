import assert from 'node:assert';
import { test } from 'node:test';
import { isSome, none, publicKey, some } from '@metaplex-foundation/umi';
import {
  publicKey as publicKeySerializer,
  u8,
  u16,
  u64,
} from '@metaplex-foundation/umi/serializers';
import {
  hiddenPrefix,
  padLeftSerializer,
  remainderArray,
  remainderOption,
  sizePrefix,
  zeroableOption,
} from '../src/generated/shared';
import {
  getGizmoExtensionSerializer,
  getGizmoSerializer,
  GizmoArgs,
  GizmoExtensionArgs,
} from '../src/generated/types';

// These tests exercise the six shared serializer helpers the JavaScript
// renderer emits on demand — the same helpers Token-2022's Codama IDL
// triggers — by running the ACTUAL generated code (from
// test/testFileSharedHelpers.cjs) against small synthetic byte arrays.
// No committed IDL, no real on-chain fixtures: just the renderer's output
// exercised at runtime.

test('zeroableOption: None is an all-zero fixed-size value, Some is the item', () => {
  const serializer = zeroableOption(publicKeySerializer());

  const zeroBytes = serializer.serialize(none());
  assert.strictEqual(zeroBytes.length, 32);
  assert.ok(zeroBytes.every((byte) => byte === 0));
  const [decodedNone] = serializer.deserialize(zeroBytes);
  assert.deepStrictEqual(decodedNone, none());

  const address = publicKey('11111111111111111111111111111112');
  const someBytes = serializer.serialize(some(address));
  const [decodedSome] = serializer.deserialize(someBytes);
  assert.ok(isSome(decodedSome));
  assert.strictEqual(decodedSome.value, address);
});

test('remainderOption: Some iff bytes remain in the buffer', () => {
  const serializer = remainderOption(u64());

  const [decodedEmpty] = serializer.deserialize(new Uint8Array(0));
  assert.deepStrictEqual(decodedEmpty, none());

  const bytes = serializer.serialize(some(BigInt(42)));
  assert.strictEqual(bytes.length, 8);
  const [decodedSome] = serializer.deserialize(bytes);
  assert.deepStrictEqual(decodedSome, some(BigInt(42)));
});

test('padLeftSerializer: pads zero bytes before the item', () => {
  const serializer = padLeftSerializer(u8(), 4);

  const bytes = serializer.serialize(1);
  assert.deepStrictEqual(Array.from(bytes), [0, 0, 0, 0, 1]);

  const [decoded, offset] = serializer.deserialize(
    new Uint8Array([0, 0, 0, 0, 7])
  );
  assert.strictEqual(decoded, 7);
  assert.strictEqual(offset, 5);
});

test('hiddenPrefix: writes and validates constant prefix bytes', () => {
  const prefix = padLeftSerializer(u8(), 4).serialize(1);
  const serializer = hiddenPrefix(u16(), [prefix]);

  const bytes = serializer.serialize(513);
  assert.deepStrictEqual(Array.from(bytes.slice(0, 5)), [0, 0, 0, 0, 1]);
  assert.deepStrictEqual(Array.from(bytes.slice(5)), [1, 2]);
  const [decoded] = serializer.deserialize(bytes);
  assert.strictEqual(decoded, 513);

  const wrongPrefixBytes = new Uint8Array([0, 0, 0, 0, 2, 1, 2]);
  assert.throws(() => serializer.deserialize(wrongPrefixBytes));
});

test('sizePrefix: frames the item with a byte-length prefix', () => {
  const serializer = sizePrefix(u64(), u16());

  const bytes = serializer.serialize(BigInt(7));
  assert.deepStrictEqual(Array.from(bytes.slice(0, 2)), [8, 0]);
  assert.strictEqual(bytes.length, 10);

  const [decoded, offset] = serializer.deserialize(bytes);
  assert.strictEqual(decoded, BigInt(7));
  assert.strictEqual(offset, 10);
});

test('remainderArray: decodes variable-size items until the buffer is exhausted', () => {
  const serializer = remainderArray(getGizmoExtensionSerializer());

  const values: GizmoExtensionArgs[] = [
    { __kind: 'VariantA', value: 9 },
    { __kind: 'VariantB', value: BigInt(42) },
  ];
  const bytes = serializer.serialize(values);
  const [decoded] = serializer.deserialize(bytes);
  assert.deepStrictEqual(decoded, values);

  const emptyBytes = serializer.serialize([]);
  assert.strictEqual(emptyBytes.length, 0);
  const [decodedEmpty] = serializer.deserialize(emptyBytes);
  assert.deepStrictEqual(decodedEmpty, []);
});

test('getGizmoSerializer: round-trips the composed shared helpers', () => {
  const serializer = getGizmoSerializer();
  const authority = publicKey('11111111111111111111111111111112');
  const value: GizmoArgs = {
    authority: some(authority),
    sized: { amount: BigInt(123) },
    extensions: some([
      { __kind: 'VariantA', value: 5 },
      { __kind: 'VariantB', value: BigInt(999) },
    ]),
  };

  const bytes = serializer.serialize(value);
  const [decoded] = serializer.deserialize(bytes);

  assert.ok(isSome(decoded.authority));
  assert.strictEqual(decoded.authority.value, authority);
  assert.strictEqual(decoded.sized.amount, BigInt(123));
  assert.ok(isSome(decoded.extensions));
  assert.deepStrictEqual(decoded.extensions.value, [
    { __kind: 'VariantA', value: 5 },
    { __kind: 'VariantB', value: BigInt(999) },
  ]);
});
