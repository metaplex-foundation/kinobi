# Token-2022 account fixtures

These `.b64` files are raw account data (base64), captured verbatim from a
local `solana-test-validator` running the Token-2022 program bundled with
the validator (`TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb`, no `--clone`
needed). They are the ACCEPTANCE GATE fixtures for
`test/packages/js-token2022/test/roundtrip.test.ts`: the generated
serializers must decode each file and re-encode it back to the exact same
bytes.

Tooling used to regenerate them:

```
solana-cli 3.0.8 (src:b4d1c774; feat:3604001754, client:Agave)
solana-test-validator 3.0.8 (src:b4d1c774; feat:3604001754, client:Agave)
spl-token-cli 5.4.0
```

## Regeneration steps

Run everything from the repo root. Use a throwaway ledger dir and a
throwaway keypair/config so this never touches your real `~/.config/solana`
setup (which may point at a hardware wallet or a real account).

```bash
mkdir -p /tmp/t22-validator-ledger
nohup solana-test-validator --reset --quiet --ledger /tmp/t22-validator-ledger \
  > /tmp/t22-validator.log 2>&1 &
sleep 8

# Throwaway identity + config so we never touch ~/.config/solana.
solana-keygen new --outfile /tmp/t22-keypair.json --no-bip39-passphrase --force --silent
solana config set -C /tmp/t22-config.yml --keypair /tmp/t22-keypair.json --url http://localhost:8899
solana airdrop 100 -C /tmp/t22-config.yml

TOKENZ=TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb

# 1) Mint with MetadataPointer + TransferFeeConfig + TokenMetadata extensions.
#    spl-token-cli 5.4.0 uses --transfer-fee-basis-points / --transfer-fee-maximum-fee
#    (older CLIs used the combined `--transfer-fee <bp> <max>` flag instead).
#    NOTE: --transfer-fee-maximum-fee takes a UI amount (i.e. it gets multiplied
#    by 10^decimals internally), NOT the raw on-chain u64 -- see "Chosen values" below.
spl-token -C /tmp/t22-config.yml --program-id $TOKENZ create-token --enable-metadata \
  --transfer-fee-basis-points 100 --transfer-fee-maximum-fee 1000000 --decimals 6
# => mint address printed; call it $MINT
spl-token -C /tmp/t22-config.yml initialize-metadata $MINT \
  "Token2022 Fixture" "T22FIX" "https://example.com/x.json"
solana account $MINT -C /tmp/t22-config.yml --output json | jq -r '.account.data[0]' \
  > test/packages/js-token2022/test/fixtures/mint-with-extensions.b64

# 2) Plain Token-2022 mint (82 bytes, no extensions => extensions === none()).
spl-token -C /tmp/t22-config.yml --program-id $TOKENZ create-token --decimals 6
# => mint address printed; call it $PLAIN
solana account $PLAIN -C /tmp/t22-config.yml --output json | jq -r '.account.data[0]' \
  > test/packages/js-token2022/test/fixtures/mint-plain.b64

# 3) Token (ATA) for $MINT -- carries ImmutableOwner + TransferFeeAmount
#    extensions, account-type byte 0x02 at offset 165.
spl-token -C /tmp/t22-config.yml create-account $MINT
# => associated token account address printed; call it $ATA
solana account $ATA -C /tmp/t22-config.yml --output json | jq -r '.account.data[0]' \
  > test/packages/js-token2022/test/fixtures/token-with-extensions.b64

pkill -f "solana-test-validator.*t22-validator-ledger"
rm -rf /tmp/t22-validator-ledger /tmp/t22-validator.log /tmp/t22-config.yml /tmp/t22-keypair.json
```

## Chosen values (from the run that produced the committed fixtures)

- Mint with extensions: `3v4ggqKFeJ4urbAkYV5Lu876a2eyEDJe96NHuRiXnwij`, decimals `6`.
  - `--transfer-fee-basis-points 100` -> raw `transferFeeBasisPoints` on-chain
    is `100` (basis points are not decimal-scaled).
  - `--transfer-fee-maximum-fee 1000000` -> spl-token-cli treats this as a UI
    amount and multiplies by `10^decimals`, so the raw on-chain `maximumFee`
    is `1000000 * 10^6 = 1_000_000_000_000`.
  - `initialize-metadata $MINT "Token2022 Fixture" "T22FIX" "https://example.com/x.json"`
    with no `--metadata-address`, so the `MetadataPointer` extension's
    `metadataAddress` self-points at the mint, and `authority` is the
    throwaway keypair used to sign (both decode as `Some`, exercising
    `zeroableOption`'s non-zero branch).
  - Extensions present (verified by walking the raw TLV bytes before writing
    this test): `TransferFeeConfig` (type 1, 108 bytes), `MetadataPointer`
    (type 18, 64 bytes), `TokenMetadata` (type 19, 129 bytes). Account-type
    byte (`0x01`, Mint) sits at absolute offset 165 (82-byte base struct +
    83 bytes of zero padding), TLV data starts at offset 166, total account
    length 479 bytes.
- Plain mint: `DrADin9T2EgmWy7i9S1hd4ioTE3nGMnmJ5uS5ipPEXJe`, decimals `6`,
  no extensions. Decodes to exactly 82 bytes.
- Token account (ATA) for the extensions mint:
  `F2RnfxirVa27t8dmU7hKYB3NiLmxUWChmU4aoUvZMtf3`, created via
  `spl-token create-account $MINT` (no explicit `--immutable`, but
  `create-account` without an explicit owner already sets `ImmutableOwner`
  on Token-2022 ATAs). Extensions present: `ImmutableOwner` (type 7, 0
  bytes) and `TransferFeeAmount` (type 2, 8 bytes, `withheldAmount = 0`
  since no transfers have happened yet). Account-type byte (`0x02`,
  Account) sits at absolute offset 165, TLV data starts at offset 166,
  total account length 182 bytes.

None of these addresses/keys hold any real value -- they were generated
against a local, throwaway validator instance and the throwaway keypair was
deleted immediately after use.
