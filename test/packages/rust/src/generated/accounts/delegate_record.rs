//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

use crate::generated::types::DelegateRole;
use crate::generated::types::TmKey;
#[cfg(feature = "anchor")]
use anchor_lang::AnchorDeserialize;
#[cfg(not(feature = "anchor"))]
use borsh::BorshDeserialize;

#[cfg_attr(
    not(feature = "anchor"),
    derive(borsh::BorshSerialize, borsh::BorshDeserialize)
)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
#[cfg_attr(
    feature = "anchor",
    derive(anchor_lang::AnchorSerialize, anchor_lang::AnchorDeserialize)
)]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct DelegateRecord {
    pub key: TmKey,
    pub role: DelegateRole,
    pub bump: u8,
}

impl DelegateRecord {
    pub const LEN: usize = 282;

    /// Prefix values used to generate a PDA for this account.
    ///
    /// Values are positional and appear in the following order:
    ///
    ///   0. `DelegateRecord::PREFIX`
    ///   1. `crate::MPL_TOKEN_METADATA_ID`
    ///   2. role (`DelegateRole`)
    pub const PREFIX: &'static [u8] = "delegate_record".as_bytes();

    pub fn create_pda(
        role: DelegateRole,
        bump: u8,
    ) -> Result<solana_program::pubkey::Pubkey, solana_program::pubkey::PubkeyError> {
        solana_program::pubkey::Pubkey::create_program_address(
            &[
                "delegate_record".as_bytes(),
                crate::MPL_TOKEN_METADATA_ID.as_ref(),
                role.to_string().as_ref(),
                &[bump],
            ],
            &crate::MPL_TOKEN_METADATA_ID,
        )
    }

    pub fn find_pda(role: DelegateRole) -> (solana_program::pubkey::Pubkey, u8) {
        solana_program::pubkey::Pubkey::find_program_address(
            &[
                "delegate_record".as_bytes(),
                crate::MPL_TOKEN_METADATA_ID.as_ref(),
                role.to_string().as_ref(),
            ],
            &crate::MPL_TOKEN_METADATA_ID,
        )
    }

    #[inline(always)]
    pub fn from_bytes(data: &[u8]) -> Result<Self, std::io::Error> {
        let mut data = data;
        Self::deserialize(&mut data)
    }
}

impl<'a> TryFrom<&solana_program::account_info::AccountInfo<'a>> for DelegateRecord {
    type Error = std::io::Error;

    fn try_from(
        account_info: &solana_program::account_info::AccountInfo<'a>,
    ) -> Result<Self, Self::Error> {
        let mut data: &[u8] = &(*account_info.data).borrow();
        Self::deserialize(&mut data)
    }
}
