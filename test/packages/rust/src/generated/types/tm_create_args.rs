//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

use crate::generated::types::AssetData;
use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, Eq, PartialEq)]
pub enum TmCreateArgs {
    V1 {
        asset_data: AssetData,
        decimals: Option<u8>,
        max_supply: Option<u64>,
    },
    V2 {
        asset_data: AssetData,
        max_supply: Option<u64>,
    },
}
