//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

use crate::generatedTypes::TmKey;
use solana_program::pubkey::Pubkey;
use crate::generatedTypes::ReservationV1;
use borsh::BorshSerialize;
use borsh::BorshDeserialize;


#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, Eq, PartialEq)]
pub struct ReservationListV1AccountData {
pub key: TmKey,
pub master_edition: Pubkey,
pub supply_snapshot: Option<u64>,
pub reservations: Vec<ReservationV1>,
}
