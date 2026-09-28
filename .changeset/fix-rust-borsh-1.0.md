---
"@metaplex-foundation/kinobi": patch
---

Fix the Rust renderer generating instruction-serialization code that calls `BorshSerialize::try_to_vec`, a method borsh removed in v1.0 ([near/borsh-rs#57](https://github.com/near/borsh-rs/blob/master/CHANGELOG.md#100-alpha6---2023-10-02)). Generated instruction builders and CPI builders now call the free function `borsh::to_vec(&value)` instead, which works on both pre-1.0 and 1.0+ borsh, so kinobi-generated Rust clients compile regardless of which borsh version the consuming crate depends on.
