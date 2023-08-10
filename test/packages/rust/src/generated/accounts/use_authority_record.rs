//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

use crate::generated::types::TmKey;
use borsh::BorshDeserialize;
use borsh::BorshSerialize;

#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, Eq, PartialEq)]
pub struct UseAuthorityRecord {
    pub key: TmKey,
    pub allowed_uses: u64,
    pub bump: u8,
}

impl UseAuthorityRecord {
    pub const LEN: usize = 10;
}
