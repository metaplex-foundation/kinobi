//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

use num_derive::FromPrimitive;
use thiserror::Error;

#[derive(Clone, Debug, Eq, Error, FromPrimitive, PartialEq)]
pub enum MplCandyMachineCoreError {
    /// 6000 (0x1770) - Account does not have correct owner
    #[error("Account does not have correct owner")]
    IncorrectOwner,
    /// 6001 (0x1771) - Account is not initialized
    #[error("Account is not initialized")]
    Uninitialized,
    /// 6002 (0x1772) - Mint Mismatch
    #[error("Mint Mismatch")]
    MintMismatch,
    /// 6003 (0x1773) - Index greater than length
    #[error("Index greater than length")]
    IndexGreaterThanLength,
    /// 6004 (0x1774) - Numerical overflow error
    #[error("Numerical overflow error")]
    NumericalOverflowError,
    /// 6005 (0x1775) - Can only provide up to 4 creators to candy machine (because candy machine is one)
    #[error("Can only provide up to 4 creators to candy machine (because candy machine is one)")]
    TooManyCreators,
    /// 6006 (0x1776) - Candy machine is empty
    #[error("Candy machine is empty")]
    CandyMachineEmpty,
    /// 6007 (0x1777) - Candy machines using hidden uris do not have config lines, they have a single hash representing hashed order
    #[error("Candy machines using hidden uris do not have config lines, they have a single hash representing hashed order")]
    HiddenSettingsDoNotHaveConfigLines,
    /// 6008 (0x1778) - Cannot change number of lines unless is a hidden config
    #[error("Cannot change number of lines unless is a hidden config")]
    CannotChangeNumberOfLines,
    /// 6009 (0x1779) - Cannot switch to hidden settings after items available is greater than 0
    #[error("Cannot switch to hidden settings after items available is greater than 0")]
    CannotSwitchToHiddenSettings,
    /// 6010 (0x177A) - Incorrect collection NFT authority
    #[error("Incorrect collection NFT authority")]
    IncorrectCollectionAuthority,
    /// 6011 (0x177B) - The metadata account has data in it, and this must be empty to mint a new NFT
    #[error("The metadata account has data in it, and this must be empty to mint a new NFT")]
    MetadataAccountMustBeEmpty,
    /// 6012 (0x177C) - Can't change collection settings after items have begun to be minted
    #[error("Can't change collection settings after items have begun to be minted")]
    NoChangingCollectionDuringMint,
    /// 6013 (0x177D) - Value longer than expected maximum value
    #[error("Value longer than expected maximum value")]
    ExceededLengthError,
    /// 6014 (0x177E) - Missing config lines settings
    #[error("Missing config lines settings")]
    MissingConfigLinesSettings,
    /// 6015 (0x177F) - Cannot increase the length in config lines settings
    #[error("Cannot increase the length in config lines settings")]
    CannotIncreaseLength,
    /// 6016 (0x1780) - Cannot switch from hidden settings
    #[error("Cannot switch from hidden settings")]
    CannotSwitchFromHiddenSettings,
    /// 6017 (0x1781) - Cannot change sequential index generation after items have begun to be minted
    #[error("Cannot change sequential index generation after items have begun to be minted")]
    CannotChangeSequentialIndexGeneration,
    /// 6018 (0x1782) - Collection public key mismatch
    #[error("Collection public key mismatch")]
    CollectionKeyMismatch,
    /// 6019 (0x1783) - Could not retrive config line data
    #[error("Could not retrive config line data")]
    CouldNotRetrieveConfigLineData,
    /// 6020 (0x1784) - Not all config lines were added to the candy machine
    #[error("Not all config lines were added to the candy machine")]
    NotFullyLoaded,
}

impl solana_program::program_error::PrintProgramError for MplCandyMachineCoreError {
    fn print<E>(&self) {
        solana_program::msg!(&self.to_string());
    }
}
