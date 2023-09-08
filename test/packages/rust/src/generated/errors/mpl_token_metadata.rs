//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

use num_derive::FromPrimitive;
use thiserror::Error;

#[derive(Clone, Debug, Eq, Error, FromPrimitive, PartialEq)]
pub enum MplTokenMetadataError {
    /// 0 (0x0) - Failed to unpack instruction data
    #[error("Failed to unpack instruction data")]
    InstructionUnpackError,
    /// 1 (0x1) - Failed to pack instruction data
    #[error("Failed to pack instruction data")]
    InstructionPackError,
    /// 2 (0x2) - Lamport balance below rent-exempt threshold
    #[error("Lamport balance below rent-exempt threshold")]
    NotRentExempt,
    /// 3 (0x3) - Already initialized
    #[error("Already initialized")]
    AlreadyInitialized,
    /// 4 (0x4) - Uninitialized
    #[error("Uninitialized")]
    Uninitialized,
    /// 5 (0x5) -  Metadata's key must match seed of ['metadata', program id, mint] provided
    #[error(" Metadata's key must match seed of ['metadata', program id, mint] provided")]
    InvalidMetadataKey,
    /// 6 (0x6) - Edition's key must match seed of ['metadata', program id, name, 'edition'] provided
    #[error("Edition's key must match seed of ['metadata', program id, name, 'edition'] provided")]
    InvalidEditionKey,
    /// 7 (0x7) - Update Authority given does not match
    #[error("Update Authority given does not match")]
    UpdateAuthorityIncorrect,
    /// 8 (0x8) - Update Authority needs to be signer to update metadata
    #[error("Update Authority needs to be signer to update metadata")]
    UpdateAuthorityIsNotSigner,
    /// 9 (0x9) - You must be the mint authority and signer on this transaction
    #[error("You must be the mint authority and signer on this transaction")]
    NotMintAuthority,
    /// 10 (0xA) - Mint authority provided does not match the authority on the mint
    #[error("Mint authority provided does not match the authority on the mint")]
    InvalidMintAuthority,
    /// 11 (0xB) - Name too long
    #[error("Name too long")]
    NameTooLong,
    /// 12 (0xC) - Symbol too long
    #[error("Symbol too long")]
    SymbolTooLong,
    /// 13 (0xD) - URI too long
    #[error("URI too long")]
    UriTooLong,
    /// 14 (0xE) - Update authority must be equivalent to the metadata's authority and also signer of this transaction
    #[error("Update authority must be equivalent to the metadata's authority and also signer of this transaction")]
    UpdateAuthorityMustBeEqualToMetadataAuthorityAndSigner,
    /// 15 (0xF) - Mint given does not match mint on Metadata
    #[error("Mint given does not match mint on Metadata")]
    MintMismatch,
    /// 16 (0x10) - Editions must have exactly one token
    #[error("Editions must have exactly one token")]
    EditionsMustHaveExactlyOneToken,
    /// 17 (0x11) - Maximum editions printed already
    #[error("Maximum editions printed already")]
    MaxEditionsMintedAlready,
    /// 18 (0x12) - Token mint to failed
    #[error("Token mint to failed")]
    TokenMintToFailed,
    /// 19 (0x13) - The master edition record passed must match the master record on the edition given
    #[error("The master edition record passed must match the master record on the edition given")]
    MasterRecordMismatch,
    /// 20 (0x14) - The destination account does not have the right mint
    #[error("The destination account does not have the right mint")]
    DestinationMintMismatch,
    /// 21 (0x15) - An edition can only mint one of its kind!
    #[error("An edition can only mint one of its kind!")]
    EditionAlreadyMinted,
    /// 22 (0x16) - Printing mint decimals should be zero
    #[error("Printing mint decimals should be zero")]
    PrintingMintDecimalsShouldBeZero,
    /// 23 (0x17) - OneTimePrintingAuthorization mint decimals should be zero
    #[error("OneTimePrintingAuthorization mint decimals should be zero")]
    OneTimePrintingAuthorizationMintDecimalsShouldBeZero,
    /// 24 (0x18) - EditionMintDecimalsShouldBeZero
    #[error("EditionMintDecimalsShouldBeZero")]
    EditionMintDecimalsShouldBeZero,
    /// 25 (0x19) - Token burn failed
    #[error("Token burn failed")]
    TokenBurnFailed,
    /// 26 (0x1A) - The One Time authorization mint does not match that on the token account!
    #[error("The One Time authorization mint does not match that on the token account!")]
    TokenAccountOneTimeAuthMintMismatch,
    /// 27 (0x1B) - Derived key invalid
    #[error("Derived key invalid")]
    DerivedKeyInvalid,
    /// 28 (0x1C) - The Printing mint does not match that on the master edition!
    #[error("The Printing mint does not match that on the master edition!")]
    PrintingMintMismatch,
    /// 29 (0x1D) - The One Time Printing Auth mint does not match that on the master edition!
    #[error("The One Time Printing Auth mint does not match that on the master edition!")]
    OneTimePrintingAuthMintMismatch,
    /// 30 (0x1E) - The mint of the token account does not match the Printing mint!
    #[error("The mint of the token account does not match the Printing mint!")]
    TokenAccountMintMismatch,
    /// 31 (0x1F) - The mint of the token account does not match the master metadata mint!
    #[error("The mint of the token account does not match the master metadata mint!")]
    TokenAccountMintMismatchV2,
    /// 32 (0x20) - Not enough tokens to mint a limited edition
    #[error("Not enough tokens to mint a limited edition")]
    NotEnoughTokens,
    /// 33 (0x21) - The mint on your authorization token holding account does not match your Printing mint!
    #[error(
        "The mint on your authorization token holding account does not match your Printing mint!"
    )]
    PrintingMintAuthorizationAccountMismatch,
    /// 34 (0x22) - The authorization token account has a different owner than the update authority for the master edition!
    #[error("The authorization token account has a different owner than the update authority for the master edition!")]
    AuthorizationTokenAccountOwnerMismatch,
    /// 35 (0x23) - This feature is currently disabled.
    #[error("This feature is currently disabled.")]
    Disabled,
    /// 36 (0x24) - Creators list too long
    #[error("Creators list too long")]
    CreatorsTooLong,
    /// 37 (0x25) - Creators must be at least one if set
    #[error("Creators must be at least one if set")]
    CreatorsMustBeAtleastOne,
    /// 38 (0x26) - If using a creators array, you must be one of the creators listed
    #[error("If using a creators array, you must be one of the creators listed")]
    MustBeOneOfCreators,
    /// 39 (0x27) - This metadata does not have creators
    #[error("This metadata does not have creators")]
    NoCreatorsPresentOnMetadata,
    /// 40 (0x28) - This creator address was not found
    #[error("This creator address was not found")]
    CreatorNotFound,
    /// 41 (0x29) - Basis points cannot be more than 10000
    #[error("Basis points cannot be more than 10000")]
    InvalidBasisPoints,
    /// 42 (0x2A) - Primary sale can only be flipped to true and is immutable
    #[error("Primary sale can only be flipped to true and is immutable")]
    PrimarySaleCanOnlyBeFlippedToTrue,
    /// 43 (0x2B) - Owner does not match that on the account given
    #[error("Owner does not match that on the account given")]
    OwnerMismatch,
    /// 44 (0x2C) - This account has no tokens to be used for authorization
    #[error("This account has no tokens to be used for authorization")]
    NoBalanceInAccountForAuthorization,
    /// 45 (0x2D) - Share total must equal 100 for creator array
    #[error("Share total must equal 100 for creator array")]
    ShareTotalMustBe100,
    /// 46 (0x2E) - This reservation list already exists!
    #[error("This reservation list already exists!")]
    ReservationExists,
    /// 47 (0x2F) - This reservation list does not exist!
    #[error("This reservation list does not exist!")]
    ReservationDoesNotExist,
    /// 48 (0x30) - This reservation list exists but was never set with reservations
    #[error("This reservation list exists but was never set with reservations")]
    ReservationNotSet,
    /// 49 (0x31) - This reservation list has already been set!
    #[error("This reservation list has already been set!")]
    ReservationAlreadyMade,
    /// 50 (0x32) - Provided more addresses than max allowed in single reservation
    #[error("Provided more addresses than max allowed in single reservation")]
    BeyondMaxAddressSize,
    /// 51 (0x33) - NumericalOverflowError
    #[error("NumericalOverflowError")]
    NumericalOverflowError,
    /// 52 (0x34) - This reservation would go beyond the maximum supply of the master edition!
    #[error("This reservation would go beyond the maximum supply of the master edition!")]
    ReservationBreachesMaximumSupply,
    /// 53 (0x35) - Address not in reservation!
    #[error("Address not in reservation!")]
    AddressNotInReservation,
    /// 54 (0x36) - You cannot unilaterally verify another creator, they must sign
    #[error("You cannot unilaterally verify another creator, they must sign")]
    CannotVerifyAnotherCreator,
    /// 55 (0x37) - You cannot unilaterally unverify another creator
    #[error("You cannot unilaterally unverify another creator")]
    CannotUnverifyAnotherCreator,
    /// 56 (0x38) - In initial reservation setting, spots remaining should equal total spots
    #[error("In initial reservation setting, spots remaining should equal total spots")]
    SpotMismatch,
    /// 57 (0x39) - Incorrect account owner
    #[error("Incorrect account owner")]
    IncorrectOwner,
    /// 58 (0x3A) - printing these tokens would breach the maximum supply limit of the master edition
    #[error("printing these tokens would breach the maximum supply limit of the master edition")]
    PrintingWouldBreachMaximumSupply,
    /// 59 (0x3B) - Data is immutable
    #[error("Data is immutable")]
    DataIsImmutable,
    /// 60 (0x3C) - No duplicate creator addresses
    #[error("No duplicate creator addresses")]
    DuplicateCreatorAddress,
    /// 61 (0x3D) - Reservation spots remaining should match total spots when first being created
    #[error("Reservation spots remaining should match total spots when first being created")]
    ReservationSpotsRemainingShouldMatchTotalSpotsAtStart,
    /// 62 (0x3E) - Invalid token program
    #[error("Invalid token program")]
    InvalidTokenProgram,
    /// 63 (0x3F) - Data type mismatch
    #[error("Data type mismatch")]
    DataTypeMismatch,
    /// 64 (0x40) - Beyond alotted address size in reservation!
    #[error("Beyond alotted address size in reservation!")]
    BeyondAlottedAddressSize,
    /// 65 (0x41) - The reservation has only been partially alotted
    #[error("The reservation has only been partially alotted")]
    ReservationNotComplete,
    /// 66 (0x42) - You cannot splice over an existing reservation!
    #[error("You cannot splice over an existing reservation!")]
    TriedToReplaceAnExistingReservation,
    /// 67 (0x43) - Invalid operation
    #[error("Invalid operation")]
    InvalidOperation,
    /// 68 (0x44) - Invalid Owner
    #[error("Invalid Owner")]
    InvalidOwner,
    /// 69 (0x45) - Printing mint supply must be zero for conversion
    #[error("Printing mint supply must be zero for conversion")]
    PrintingMintSupplyMustBeZeroForConversion,
    /// 70 (0x46) - One Time Auth mint supply must be zero for conversion
    #[error("One Time Auth mint supply must be zero for conversion")]
    OneTimeAuthMintSupplyMustBeZeroForConversion,
    /// 71 (0x47) - You tried to insert one edition too many into an edition mark pda
    #[error("You tried to insert one edition too many into an edition mark pda")]
    InvalidEditionIndex,
    /// 72 (0x48) - In the legacy system the reservation needs to be of size one for cpu limit reasons
    #[error("In the legacy system the reservation needs to be of size one for cpu limit reasons")]
    ReservationArrayShouldBeSizeOne,
    /// 73 (0x49) - Is Mutable can only be flipped to false
    #[error("Is Mutable can only be flipped to false")]
    IsMutableCanOnlyBeFlippedToFalse,
    /// 74 (0x4A) - Collection cannot be verified in this instruction
    #[error("Collection cannot be verified in this instruction")]
    CollectionCannotBeVerifiedInThisInstruction,
    /// 75 (0x4B) - This instruction was deprecated in a previous release and is now removed
    #[error("This instruction was deprecated in a previous release and is now removed")]
    Removed,
    /// 76 (0x4C) - This token use method is burn and there are no remaining uses, it must be burned
    #[error("This token use method is burn and there are no remaining uses, it must be burned")]
    MustBeBurned,
    /// 77 (0x4D) - This use method is invalid
    #[error("This use method is invalid")]
    InvalidUseMethod,
    /// 78 (0x4E) - Cannot Change Use Method after the first use
    #[error("Cannot Change Use Method after the first use")]
    CannotChangeUseMethodAfterFirstUse,
    /// 79 (0x4F) - Cannot Change Remaining or Available uses after the first use
    #[error("Cannot Change Remaining or Available uses after the first use")]
    CannotChangeUsesAfterFirstUse,
    /// 80 (0x50) - Collection Not Found on Metadata
    #[error("Collection Not Found on Metadata")]
    CollectionNotFound,
    /// 81 (0x51) - Collection Update Authority is invalid
    #[error("Collection Update Authority is invalid")]
    InvalidCollectionUpdateAuthority,
    /// 82 (0x52) - Collection Must Be a Unique Master Edition v2
    #[error("Collection Must Be a Unique Master Edition v2")]
    CollectionMustBeAUniqueMasterEdition,
    /// 83 (0x53) - The Use Authority Record Already Exists, to modify it Revoke, then Approve
    #[error("The Use Authority Record Already Exists, to modify it Revoke, then Approve")]
    UseAuthorityRecordAlreadyExists,
    /// 84 (0x54) - The Use Authority Record is empty or already revoked
    #[error("The Use Authority Record is empty or already revoked")]
    UseAuthorityRecordAlreadyRevoked,
    /// 85 (0x55) - This token has no uses
    #[error("This token has no uses")]
    Unusable,
    /// 86 (0x56) - There are not enough Uses left on this token.
    #[error("There are not enough Uses left on this token.")]
    NotEnoughUses,
    /// 87 (0x57) - This Collection Authority Record Already Exists.
    #[error("This Collection Authority Record Already Exists.")]
    CollectionAuthorityRecordAlreadyExists,
    /// 88 (0x58) - This Collection Authority Record Does Not Exist.
    #[error("This Collection Authority Record Does Not Exist.")]
    CollectionAuthorityDoesNotExist,
    /// 89 (0x59) - This Use Authority Record is invalid.
    #[error("This Use Authority Record is invalid.")]
    InvalidUseAuthorityRecord,
    /// 90 (0x5A) - This Collection Authority Record is invalid.
    #[error("This Collection Authority Record is invalid.")]
    InvalidCollectionAuthorityRecord,
    /// 91 (0x5B) - Metadata does not match the freeze authority on the mint
    #[error("Metadata does not match the freeze authority on the mint")]
    InvalidFreezeAuthority,
    /// 92 (0x5C) - All tokens in this account have not been delegated to this user.
    #[error("All tokens in this account have not been delegated to this user.")]
    InvalidDelegate,
    /// 93 (0x5D) - Creator can not be adjusted once they are verified.
    #[error("Creator can not be adjusted once they are verified.")]
    CannotAdjustVerifiedCreator,
    /// 94 (0x5E) - Verified creators cannot be removed.
    #[error("Verified creators cannot be removed.")]
    CannotRemoveVerifiedCreator,
    /// 95 (0x5F) - Can not wipe verified creators.
    #[error("Can not wipe verified creators.")]
    CannotWipeVerifiedCreators,
    /// 96 (0x60) - Not allowed to change seller fee basis points.
    #[error("Not allowed to change seller fee basis points.")]
    NotAllowedToChangeSellerFeeBasisPoints,
    /// 97 (0x61) - Edition override cannot be zero
    #[error("Edition override cannot be zero")]
    EditionOverrideCannotBeZero,
    /// 98 (0x62) - Invalid User
    #[error("Invalid User")]
    InvalidUser,
    /// 99 (0x63) - Revoke Collection Authority signer is incorrect
    #[error("Revoke Collection Authority signer is incorrect")]
    RevokeCollectionAuthoritySignerIncorrect,
    /// 100 (0x64) - Token close failed
    #[error("Token close failed")]
    TokenCloseFailed,
    /// 101 (0x65) - Can't use this function on unsized collection
    #[error("Can't use this function on unsized collection")]
    UnsizedCollection,
    /// 102 (0x66) - Can't use this function on a sized collection
    #[error("Can't use this function on a sized collection")]
    SizedCollection,
    /// 103 (0x67) - Can't burn a verified member of a collection w/o providing collection metadata account
    #[error(
        "Can't burn a verified member of a collection w/o providing collection metadata account"
    )]
    MissingCollectionMetadata,
    /// 104 (0x68) - This NFT is not a member of the specified collection.
    #[error("This NFT is not a member of the specified collection.")]
    NotAMemberOfCollection,
    /// 105 (0x69) - This NFT is not a verified member of the specified collection.
    #[error("This NFT is not a verified member of the specified collection.")]
    NotVerifiedMemberOfCollection,
    /// 106 (0x6A) - This NFT is not a collection parent NFT.
    #[error("This NFT is not a collection parent NFT.")]
    NotACollectionParent,
    /// 107 (0x6B) - Could not determine a TokenStandard type.
    #[error("Could not determine a TokenStandard type.")]
    CouldNotDetermineTokenStandard,
    /// 108 (0x6C) - This mint account has an edition but none was provided.
    #[error("This mint account has an edition but none was provided.")]
    MissingEditionAccount,
    /// 109 (0x6D) - This edition is not a Master Edition
    #[error("This edition is not a Master Edition")]
    NotAMasterEdition,
    /// 110 (0x6E) - This Master Edition has existing prints
    #[error("This Master Edition has existing prints")]
    MasterEditionHasPrints,
    /// 111 (0x6F) - Borsh Deserialization Error
    #[error("Borsh Deserialization Error")]
    BorshDeserializationError,
    /// 112 (0x70) - Cannot update a verified collection in this command
    #[error("Cannot update a verified collection in this command")]
    CannotUpdateVerifiedCollection,
    /// 113 (0x71) - Edition account doesnt match collection
    #[error("Edition account doesnt match collection ")]
    CollectionMasterEditionAccountInvalid,
    /// 114 (0x72) - Item is already verified.
    #[error("Item is already verified.")]
    AlreadyVerified,
    /// 115 (0x73) - Item is already unverified.
    #[error("Item is already unverified.")]
    AlreadyUnverified,
    /// 116 (0x74) - This edition is not a Print Edition
    #[error("This edition is not a Print Edition")]
    NotAPrintEdition,
    /// 117 (0x75) - Invalid Master Edition
    #[error("Invalid Master Edition")]
    InvalidMasterEdition,
    /// 118 (0x76) - Invalid Print Edition
    #[error("Invalid Print Edition")]
    InvalidPrintEdition,
    /// 119 (0x77) - Invalid Edition Marker
    #[error("Invalid Edition Marker")]
    InvalidEditionMarker,
    /// 120 (0x78) - Reservation List is Deprecated
    #[error("Reservation List is Deprecated")]
    ReservationListDeprecated,
    /// 121 (0x79) - Print Edition does not match Master Edition
    #[error("Print Edition does not match Master Edition")]
    PrintEditionDoesNotMatchMasterEdition,
    /// 122 (0x7A) - Edition Number greater than max supply
    #[error("Edition Number greater than max supply")]
    EditionNumberGreaterThanMaxSupply,
    /// 123 (0x7B) - Must unverify before migrating collections.
    #[error("Must unverify before migrating collections.")]
    MustUnverify,
    /// 124 (0x7C) - Invalid Escrow Account Bump Seed
    #[error("Invalid Escrow Account Bump Seed")]
    InvalidEscrowBumpSeed,
    /// 125 (0x7D) - Must Escrow Authority
    #[error("Must Escrow Authority")]
    MustBeEscrowAuthority,
    /// 126 (0x7E) - Invalid System Program
    #[error("Invalid System Program")]
    InvalidSystemProgram,
    /// 127 (0x7F) - Must be a Non Fungible Token
    #[error("Must be a Non Fungible Token")]
    MustBeNonFungible,
    /// 128 (0x80) - Insufficient tokens for transfer
    #[error("Insufficient tokens for transfer")]
    InsufficientTokens,
    /// 129 (0x81) - Borsh Serialization Error
    #[error("Borsh Serialization Error")]
    BorshSerializationError,
    /// 130 (0x82) - Cannot create NFT with no Freeze Authority.
    #[error("Cannot create NFT with no Freeze Authority.")]
    NoFreezeAuthoritySet,
    /// 131 (0x83) - Invalid collection size change
    #[error("Invalid collection size change")]
    InvalidCollectionSizeChange,
    /// 132 (0x84) - Invalid bubblegum signer
    #[error("Invalid bubblegum signer")]
    InvalidBubblegumSigner,
    /// 133 (0x85) - Mint needs to be signer to initialize the account
    #[error("Mint needs to be signer to initialize the account")]
    MintIsNotSigner,
    /// 134 (0x86) - Invalid token standard
    #[error("Invalid token standard")]
    InvalidTokenStandard,
    /// 135 (0x87) - Invalid mint account for specified token standard
    #[error("Invalid mint account for specified token standard")]
    InvalidMintForTokenStandard,
    /// 136 (0x88) - Invalid authorization rules account
    #[error("Invalid authorization rules account")]
    InvalidAuthorizationRules,
    /// 137 (0x89) - Missing authorization rules account
    #[error("Missing authorization rules account")]
    MissingAuthorizationRules,
    /// 138 (0x8A) - Missing programmable configuration
    #[error("Missing programmable configuration")]
    MissingProgrammableConfig,
    /// 139 (0x8B) - Invalid programmable configuration
    #[error("Invalid programmable configuration")]
    InvalidProgrammableConfig,
    /// 140 (0x8C) - Delegate already exists
    #[error("Delegate already exists")]
    DelegateAlreadyExists,
    /// 141 (0x8D) - Delegate not found
    #[error("Delegate not found")]
    DelegateNotFound,
    /// 142 (0x8E) - Required account not set in instruction builder
    #[error("Required account not set in instruction builder")]
    MissingAccountInBuilder,
    /// 143 (0x8F) - Required argument not set in instruction builder
    #[error("Required argument not set in instruction builder")]
    MissingArgumentInBuilder,
    /// 144 (0x90) - Feature not supported currently
    #[error("Feature not supported currently")]
    FeatureNotSupported,
    /// 145 (0x91) - Invalid system wallet
    #[error("Invalid system wallet")]
    InvalidSystemWallet,
    /// 146 (0x92) - Only the sale delegate can transfer while its set
    #[error("Only the sale delegate can transfer while its set")]
    OnlySaleDelegateCanTransfer,
    /// 147 (0x93) - Missing token account
    #[error("Missing token account")]
    MissingTokenAccount,
    /// 148 (0x94) - Missing SPL token program
    #[error("Missing SPL token program")]
    MissingSplTokenProgram,
    /// 149 (0x95) - Missing SPL token program
    #[error("Missing SPL token program")]
    MissingAuthorizationRulesProgram,
    /// 150 (0x96) - Invalid delegate role for transfer
    #[error("Invalid delegate role for transfer")]
    InvalidDelegateRoleForTransfer,
}

impl solana_program::program_error::PrintProgramError for MplTokenMetadataError {
    fn print<E>(&self) {
        solana_program::msg!(&self.to_string());
    }
}
