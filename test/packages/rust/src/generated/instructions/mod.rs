//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

pub mod add_config_lines;
pub mod approve_collection_authority;
pub mod approve_use_authority;
pub mod bubblegum_set_collection_size;
pub mod burn;
pub mod burn_edition_nft;
pub mod burn_nft;
pub mod close_escrow_account;
pub mod convert_master_edition_v1_to_v2;
pub mod create_escrow_account;
pub mod create_frequency_rule;
pub mod create_master_edition;
pub mod create_master_edition_v3;
pub mod create_metadata_account;
pub mod create_metadata_account_v2;
pub mod create_metadata_account_v3;
pub mod create_reservation_list;
pub mod create_rule_set;
pub mod create_v1;
pub mod create_v2;
pub mod delegate;
pub mod deprecated_create_master_edition;
pub mod deprecated_mint_new_edition_from_master_edition_via_printing_token;
pub mod deprecated_mint_printing_tokens;
pub mod deprecated_mint_printing_tokens_via_token;
pub mod deprecated_set_reservation_list;
pub mod dummy;
pub mod freeze_delegated_account;
pub mod initialize;
pub mod migrate;
pub mod mint;
pub mod mint_from_candy_machine;
pub mod mint_new_edition_from_master_edition_via_token;
pub mod mint_new_edition_from_master_edition_via_vault_proxy;
pub mod puff_metadata;
pub mod remove_creator_verification;
pub mod revoke;
pub mod revoke_collection_authority;
pub mod revoke_use_authority;
pub mod set_and_verify_collection;
pub mod set_and_verify_sized_collection_item;
pub mod set_authority;
pub mod set_collection;
pub mod set_collection_size;
pub mod set_mint_authority;
pub mod set_token_standard;
pub mod sign_metadata;
pub mod thaw_delegated_account;
pub mod transfer;
pub mod transfer_out_of_escrow;
pub mod unverify_collection;
pub mod unverify_sized_collection_item;
pub mod update_candy_machine;
pub mod update_metadata_account;
pub mod update_metadata_account_v2;
pub mod update_primary_sale_happened_via_token;
pub mod update_v1;
pub mod use_asset;
pub mod utilize;
pub mod validate;
pub mod verify;
pub mod verify_collection;
pub mod verify_sized_collection_item;
pub mod withdraw;

pub use self::add_config_lines::*;
pub use self::approve_collection_authority::*;
pub use self::approve_use_authority::*;
pub use self::bubblegum_set_collection_size::*;
pub use self::burn::*;
pub use self::burn_edition_nft::*;
pub use self::burn_nft::*;
pub use self::close_escrow_account::*;
pub use self::convert_master_edition_v1_to_v2::*;
pub use self::create_escrow_account::*;
pub use self::create_frequency_rule::*;
pub use self::create_master_edition::*;
pub use self::create_master_edition_v3::*;
pub use self::create_metadata_account::*;
pub use self::create_metadata_account_v2::*;
pub use self::create_metadata_account_v3::*;
pub use self::create_reservation_list::*;
pub use self::create_rule_set::*;
pub use self::create_v1::*;
pub use self::create_v2::*;
pub use self::delegate::*;
pub use self::deprecated_create_master_edition::*;
pub use self::deprecated_mint_new_edition_from_master_edition_via_printing_token::*;
pub use self::deprecated_mint_printing_tokens::*;
pub use self::deprecated_mint_printing_tokens_via_token::*;
pub use self::deprecated_set_reservation_list::*;
pub use self::dummy::*;
pub use self::freeze_delegated_account::*;
pub use self::initialize::*;
pub use self::migrate::*;
pub use self::mint::*;
pub use self::mint_from_candy_machine::*;
pub use self::mint_new_edition_from_master_edition_via_token::*;
pub use self::mint_new_edition_from_master_edition_via_vault_proxy::*;
pub use self::puff_metadata::*;
pub use self::remove_creator_verification::*;
pub use self::revoke::*;
pub use self::revoke_collection_authority::*;
pub use self::revoke_use_authority::*;
pub use self::set_and_verify_collection::*;
pub use self::set_and_verify_sized_collection_item::*;
pub use self::set_authority::*;
pub use self::set_collection::*;
pub use self::set_collection_size::*;
pub use self::set_mint_authority::*;
pub use self::set_token_standard::*;
pub use self::sign_metadata::*;
pub use self::thaw_delegated_account::*;
pub use self::transfer::*;
pub use self::transfer_out_of_escrow::*;
pub use self::unverify_collection::*;
pub use self::unverify_sized_collection_item::*;
pub use self::update_candy_machine::*;
pub use self::update_metadata_account::*;
pub use self::update_metadata_account_v2::*;
pub use self::update_primary_sale_happened_via_token::*;
pub use self::update_v1::*;
pub use self::use_asset::*;
pub use self::utilize::*;
pub use self::validate::*;
pub use self::verify::*;
pub use self::verify_collection::*;
pub use self::verify_sized_collection_item::*;
pub use self::withdraw::*;

#[derive(Clone, Copy)]
pub enum InstructionAccount {
    Readonly(solana_program::pubkey::Pubkey),
    ReadonlySigner(solana_program::pubkey::Pubkey),
    Writable(solana_program::pubkey::Pubkey),
    WritableSigner(solana_program::pubkey::Pubkey),
}

impl InstructionAccount {
    pub fn to_account_meta(&self) -> solana_program::instruction::AccountMeta {
        let (pubkey, writable, signer) = match self {
            InstructionAccount::Readonly(pubkey) => (pubkey, false, false),
            InstructionAccount::ReadonlySigner(pubkey) => (pubkey, false, true),
            InstructionAccount::Writable(pubkey) => (pubkey, true, false),
            InstructionAccount::WritableSigner(pubkey) => (pubkey, true, true),
        };

        if writable {
            solana_program::instruction::AccountMeta::new(*pubkey, signer)
        } else {
            solana_program::instruction::AccountMeta::new_readonly(*pubkey, signer)
        }
    }
}

#[derive(Clone, Copy)]
pub enum InstructionAccountInfo<'a> {
    Readonly(&'a solana_program::account_info::AccountInfo<'a>),
    ReadonlySigner(&'a solana_program::account_info::AccountInfo<'a>),
    Writable(&'a solana_program::account_info::AccountInfo<'a>),
    WritableSigner(&'a solana_program::account_info::AccountInfo<'a>),
}

impl<'a> InstructionAccountInfo<'a> {
    pub fn to_account_meta(&self) -> solana_program::instruction::AccountMeta {
        let (pubkey, writable, signer) = match self {
            InstructionAccountInfo::Readonly(account_info) => (account_info.key, false, false),
            InstructionAccountInfo::ReadonlySigner(account_info) => (account_info.key, false, true),
            InstructionAccountInfo::Writable(account_info) => (account_info.key, true, false),
            InstructionAccountInfo::WritableSigner(account_info) => (account_info.key, true, true),
        };

        if writable {
            solana_program::instruction::AccountMeta::new(*pubkey, signer)
        } else {
            solana_program::instruction::AccountMeta::new_readonly(*pubkey, signer)
        }
    }
}
