//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!



/// This is a union of all the possible payload types.

pub enum PayloadType {

Seeds {
seeds: Vec<RemainderArray<u8>>,
}
MerkleProof {
leaf: [u8; 32],
proof: Vec<[u8; 32]>,
}

}
