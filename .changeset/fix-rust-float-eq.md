---
"@metaplex-foundation/kinobi": patch
---

Fix the Rust renderer deriving `Eq` on structs, accounts and instruction args that contain an `f32`/`f64` field, which fails to compile since `f32`/`f64` don't implement `Eq` (only `PartialEq`). Such a type - or anything directly embedding it, including instruction argument structs and nested structs - now derives `PartialEq` without `Eq`.
