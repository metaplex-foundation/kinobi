//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

use crate::generatedTypes::PayloadKey;
use crate::generatedTypes::PayloadType;
use borsh::BorshDeserialize;
use borsh::BorshSerialize;
use std::collections::HashMap;

#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, Eq, PartialEq)]
pub struct ExtendedPayload {
    pub map: HashMap<PayloadKey, PayloadType>,
    pub args: (u8, String),
}
