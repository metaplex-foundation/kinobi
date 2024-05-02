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
use solana_program::pubkey::Pubkey;

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
pub struct MasterEditionV1 {
    pub key: TmKey,
    pub supply: u64,
    pub max_supply: Option<u64>,
    #[cfg_attr(
        feature = "serde",
        serde(with = "serde_with::As::<serde_with::DisplayFromStr>")
    )]
    pub printing_mint: Pubkey,
    #[cfg_attr(
        feature = "serde",
        serde(with = "serde_with::As::<serde_with::DisplayFromStr>")
    )]
    pub one_time_printing_authorization_mint: Pubkey,
}

impl MasterEditionV1 {
    /// Prefix values used to generate a PDA for this account.
    ///
    /// Values are positional and appear in the following order:
    ///
    ///   0. `MasterEditionV1::PREFIX`
    ///   1. `crate::MPL_TOKEN_METADATA_ID`
    ///   2. delegate_role (`DelegateRole`)
    pub const PREFIX: &'static [u8] = "metadata".as_bytes();

    pub fn create_pda(
        delegate_role: DelegateRole,
        bump: u8,
    ) -> Result<solana_program::pubkey::Pubkey, solana_program::pubkey::PubkeyError> {
        solana_program::pubkey::Pubkey::create_program_address(
            &[
                "metadata".as_bytes(),
                crate::MPL_TOKEN_METADATA_ID.as_ref(),
                delegate_role.to_string().as_ref(),
                &[bump],
            ],
            &crate::MPL_TOKEN_METADATA_ID,
        )
    }

    pub fn find_pda(delegate_role: DelegateRole) -> (solana_program::pubkey::Pubkey, u8) {
        solana_program::pubkey::Pubkey::find_program_address(
            &[
                "metadata".as_bytes(),
                crate::MPL_TOKEN_METADATA_ID.as_ref(),
                delegate_role.to_string().as_ref(),
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

impl<'a> TryFrom<&solana_program::account_info::AccountInfo<'a>> for MasterEditionV1 {
    type Error = std::io::Error;

    fn try_from(
        account_info: &solana_program::account_info::AccountInfo<'a>,
    ) -> Result<Self, Self::Error> {
        let mut data: &[u8] = &(*account_info.data).borrow();
        Self::deserialize(&mut data)
    }
}
