//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

use crate::generated::types::AssetData;

#[derive(Clone, Debug, Eq, PartialEq)]
#[cfg_attr(
    not(feature = "anchor"),
    derive(borsh::BorshSerialize, borsh::BorshDeserialize)
)]
#[cfg_attr(
    feature = "anchor",
    derive(anchor_lang::AnchorSerialize, anchor_lang::AnchorDeserialize)
)]
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
