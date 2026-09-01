import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { isSome, none, some } from '@metaplex-foundation/umi';
import {
  publicKey as publicKeySerializer,
  u8,
  u16,
  u64,
} from '@metaplex-foundation/umi/serializers';
import {
  getMintAccountDataSerializer,
  getTokenAccountDataSerializer,
  hiddenPrefix,
  padLeftSerializer,
  remainderOption,
  sizePrefix,
  zeroableOption,
} from '../src';

const fixture = (name: string): Uint8Array =>
  new Uint8Array(
    Buffer.from(
      readFileSync(join(__dirname, 'fixtures', `${name}.b64`), 'utf8').trim(),
      'base64'
    )
  );

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString('hex');

test('it roundtrips a mint account with extensions byte-for-byte', () => {
  const bytes = fixture('mint-with-extensions');
  const serializer = getMintAccountDataSerializer();
  const [mint, offset] = serializer.deserialize(bytes);

  // The whole account data was consumed.
  assert.strictEqual(offset, bytes.length);

  // Base fields decode.
  assert.ok(isSome(mint.mintAuthority));
  assert.strictEqual(typeof mint.supply, 'bigint');
  assert.strictEqual(mint.isInitialized, true);

  // The extension TLV list decodes (remainderOption + hiddenPrefix +
  // padLeftSerializer (account-type byte at offset 165) + dataEnum(u16) +
  // sizePrefix(u16) are all exercised).
  assert.ok(isSome(mint.extensions));
  const extensions = isSome(mint.extensions) ? mint.extensions.value : [];
  const kinds = extensions.map((extension) => extension.__kind);
  assert.ok(kinds.includes('MetadataPointer'), `kinds: ${kinds.join(', ')}`);
  assert.ok(kinds.includes('TransferFeeConfig'), `kinds: ${kinds.join(', ')}`);
  assert.ok(kinds.includes('TokenMetadata'), `kinds: ${kinds.join(', ')}`);

  // zeroableOption: non-zero authority/metadataAddress decode as Some (the
  // fixture mint was created with `initialize-metadata` and no explicit
  // --metadata-address, so the pointer self-references the mint).
  const pointer = extensions.find((e) => e.__kind === 'MetadataPointer');
  assert.ok(pointer && pointer.__kind === 'MetadataPointer');
  assert.ok(isSome(pointer.authority));
  assert.ok(isSome(pointer.metadataAddress));

  // Transfer fee values match the CLI arguments used to generate the fixture
  // (see test/fixtures/README.md): --transfer-fee-basis-points 100 (raw,
  // not decimal-scaled) and --transfer-fee-maximum-fee 1000000, which
  // spl-token-cli treats as a UI amount and scales by 10^decimals (6),
  // giving a raw on-chain maximumFee of 1_000_000_000_000.
  const fee = extensions.find((e) => e.__kind === 'TransferFeeConfig');
  assert.ok(fee && fee.__kind === 'TransferFeeConfig');
  assert.strictEqual(
    fee.newerTransferFee.transferFeeBasisPoints.basisPoints,
    BigInt(100)
  );
  assert.strictEqual(
    fee.newerTransferFee.maximumFee,
    BigInt(1_000_000_000_000)
  );

  // The single strongest check: byte-for-byte re-encode.
  assert.strictEqual(hex(serializer.serialize(mint)), hex(bytes));
});

test('it roundtrips a plain mint account (no extensions)', () => {
  const bytes = fixture('mint-plain');
  assert.strictEqual(bytes.length, 82);
  const serializer = getMintAccountDataSerializer();
  const [mint, offset] = serializer.deserialize(bytes);
  assert.strictEqual(offset, 82);
  assert.deepStrictEqual(mint.extensions, none());
  assert.strictEqual(hex(serializer.serialize(mint)), hex(bytes));
});

test('it roundtrips a token account with extensions byte-for-byte', () => {
  const bytes = fixture('token-with-extensions');
  const serializer = getTokenAccountDataSerializer();
  const [token, offset] = serializer.deserialize(bytes);
  assert.strictEqual(offset, bytes.length);
  assert.ok(isSome(token.extensions));
  const kinds = (isSome(token.extensions) ? token.extensions.value : []).map(
    (extension) => extension.__kind
  );
  assert.ok(kinds.includes('ImmutableOwner'), `kinds: ${kinds.join(', ')}`);
  assert.ok(kinds.includes('TransferFeeAmount'), `kinds: ${kinds.join(', ')}`);
  assert.strictEqual(hex(serializer.serialize(token)), hex(bytes));
});

test('zeroableOption serializes none as zero bytes and back', () => {
  const serializer = zeroableOption(publicKeySerializer());
  const noneBytes = serializer.serialize(none());
  assert.strictEqual(noneBytes.length, 32);
  assert.ok(noneBytes.every((byte) => byte === 0));
  assert.deepStrictEqual(serializer.deserialize(noneBytes)[0], none());

  const someBytes = serializer.serialize(
    some('11111111111111111111111111111112')
  );
  const [decoded] = serializer.deserialize(someBytes);
  assert.ok(isSome(decoded));
});

test('remainderOption reads none at end of bytes', () => {
  const serializer = remainderOption(u64());
  assert.deepStrictEqual(serializer.deserialize(new Uint8Array(0))[0], none());
  const someBytes = serializer.serialize(some(BigInt(42)));
  assert.strictEqual(someBytes.length, 8);
  const [decoded] = serializer.deserialize(someBytes);
  assert.ok(isSome(decoded) && decoded.value === BigInt(42));
});

test('hiddenPrefix writes and asserts its constant', () => {
  const serializer = hiddenPrefix(u16(), [
    padLeftSerializer(u8(), 3).serialize(1),
  ]);
  const bytes = serializer.serialize(513);
  assert.deepStrictEqual([...bytes], [0, 0, 0, 1, 1, 2]);
  assert.strictEqual(serializer.deserialize(bytes)[0], 513);
  assert.throws(() => serializer.deserialize(new Uint8Array([9, 9, 9, 9, 1, 2])));
});

test('sizePrefix frames content with a length prefix', () => {
  const serializer = sizePrefix(u64(), u16());
  const bytes = serializer.serialize(BigInt(7));
  assert.deepStrictEqual([...bytes.slice(0, 2)], [8, 0]);
  assert.strictEqual(bytes.length, 10);
  const [value, offset] = serializer.deserialize(bytes);
  assert.strictEqual(value, BigInt(7));
  assert.strictEqual(offset, 10);
});
