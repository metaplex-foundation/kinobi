//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

use borsh::BorshDeserialize;
use borsh::BorshSerialize;

/// Accounts.
pub struct UnverifySizedCollectionItem {
    /// Metadata account
    pub metadata: solana_program::pubkey::Pubkey,
    /// Collection Authority
    pub collection_authority: solana_program::pubkey::Pubkey,
    /// payer
    pub payer: solana_program::pubkey::Pubkey,
    /// Mint of the Collection
    pub collection_mint: solana_program::pubkey::Pubkey,
    /// Metadata Account of the Collection
    pub collection: solana_program::pubkey::Pubkey,
    /// MasterEdition2 Account of the Collection Token
    pub collection_master_edition_account: solana_program::pubkey::Pubkey,
    /// Collection Authority Record PDA
    pub collection_authority_record: Option<solana_program::pubkey::Pubkey>,
}

impl UnverifySizedCollectionItem {
    pub fn instruction(&self) -> solana_program::instruction::Instruction {
        let args = UnverifySizedCollectionItemInstructionArgs::new();
        solana_program::instruction::Instruction {
            program_id: crate::MPL_TOKEN_METADATA_ID,
            accounts: vec![
                solana_program::instruction::AccountMeta::new(self.metadata, false),
                solana_program::instruction::AccountMeta::new_readonly(
                    self.collection_authority,
                    true,
                ),
                solana_program::instruction::AccountMeta::new(self.payer, true),
                solana_program::instruction::AccountMeta::new_readonly(self.collection_mint, false),
                solana_program::instruction::AccountMeta::new(self.collection, false),
                solana_program::instruction::AccountMeta::new_readonly(
                    self.collection_master_edition_account,
                    false,
                ),
                if let Some(collection_authority_record) = self.collection_authority_record {
                    solana_program::instruction::AccountMeta::new_readonly(
                        collection_authority_record,
                        false,
                    )
                } else {
                    solana_program::instruction::AccountMeta::new_readonly(
                        crate::MPL_TOKEN_METADATA_ID,
                        false,
                    )
                },
            ],
            data: args.try_to_vec().unwrap(),
        }
    }
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
struct UnverifySizedCollectionItemInstructionArgs {
    discriminator: u8,
}

impl UnverifySizedCollectionItemInstructionArgs {
    pub fn new() -> Self {
        Self { discriminator: 31 }
    }
}

/// Instruction builder.
#[derive(Default)]
pub struct UnverifySizedCollectionItemBuilder {
    metadata: Option<solana_program::pubkey::Pubkey>,
    collection_authority: Option<solana_program::pubkey::Pubkey>,
    payer: Option<solana_program::pubkey::Pubkey>,
    collection_mint: Option<solana_program::pubkey::Pubkey>,
    collection: Option<solana_program::pubkey::Pubkey>,
    collection_master_edition_account: Option<solana_program::pubkey::Pubkey>,
    collection_authority_record: Option<solana_program::pubkey::Pubkey>,
}

impl UnverifySizedCollectionItemBuilder {
    pub fn new() -> Self {
        Self::default()
    }
    pub fn metadata(&mut self, metadata: solana_program::pubkey::Pubkey) -> &mut Self {
        self.metadata = Some(metadata);
        self
    }
    pub fn collection_authority(
        &mut self,
        collection_authority: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.collection_authority = Some(collection_authority);
        self
    }
    pub fn payer(&mut self, payer: solana_program::pubkey::Pubkey) -> &mut Self {
        self.payer = Some(payer);
        self
    }
    pub fn collection_mint(
        &mut self,
        collection_mint: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.collection_mint = Some(collection_mint);
        self
    }
    pub fn collection(&mut self, collection: solana_program::pubkey::Pubkey) -> &mut Self {
        self.collection = Some(collection);
        self
    }
    pub fn collection_master_edition_account(
        &mut self,
        collection_master_edition_account: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.collection_master_edition_account = Some(collection_master_edition_account);
        self
    }
    pub fn collection_authority_record(
        &mut self,
        collection_authority_record: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.collection_authority_record = Some(collection_authority_record);
        self
    }
    pub fn build(&self) -> solana_program::instruction::Instruction {
        let accounts = UnverifySizedCollectionItem {
            metadata: self.metadata.expect("metadata is not set"),

            collection_authority: self
                .collection_authority
                .expect("collection_authority is not set"),

            payer: self.payer.expect("payer is not set"),

            collection_mint: self.collection_mint.expect("collection_mint is not set"),

            collection: self.collection.expect("collection is not set"),

            collection_master_edition_account: self
                .collection_master_edition_account
                .expect("collection_master_edition_account is not set"),

            collection_authority_record: self.collection_authority_record,
        };
        accounts.instruction()
    }
}

pub mod cpi {
    use super::*;

    /// `unverify_sized_collection_item` CPI instruction.
    pub struct UnverifySizedCollectionItem<'a> {
        pub program: &'a solana_program::account_info::AccountInfo<'a>,
        /// Metadata account
        pub metadata: &'a solana_program::account_info::AccountInfo<'a>,
        /// Collection Authority
        pub collection_authority: &'a solana_program::account_info::AccountInfo<'a>,
        /// payer
        pub payer: &'a solana_program::account_info::AccountInfo<'a>,
        /// Mint of the Collection
        pub collection_mint: &'a solana_program::account_info::AccountInfo<'a>,
        /// Metadata Account of the Collection
        pub collection: &'a solana_program::account_info::AccountInfo<'a>,
        /// MasterEdition2 Account of the Collection Token
        pub collection_master_edition_account: &'a solana_program::account_info::AccountInfo<'a>,
        /// Collection Authority Record PDA
        pub collection_authority_record: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    }

    impl<'a> UnverifySizedCollectionItem<'a> {
        pub fn invoke(&self) -> solana_program::entrypoint::ProgramResult {
            self.invoke_signed(&[])
        }
        #[allow(clippy::vec_init_then_push)]
        pub fn invoke_signed(
            &self,
            signers_seeds: &[&[&[u8]]],
        ) -> solana_program::entrypoint::ProgramResult {
            let args = UnverifySizedCollectionItemInstructionArgs::new();
            let instruction = solana_program::instruction::Instruction {
                program_id: crate::MPL_TOKEN_METADATA_ID,
                accounts: vec![
                    solana_program::instruction::AccountMeta::new(*self.metadata.key, false),
                    solana_program::instruction::AccountMeta::new_readonly(
                        *self.collection_authority.key,
                        true,
                    ),
                    solana_program::instruction::AccountMeta::new(*self.payer.key, true),
                    solana_program::instruction::AccountMeta::new_readonly(
                        *self.collection_mint.key,
                        false,
                    ),
                    solana_program::instruction::AccountMeta::new(*self.collection.key, false),
                    solana_program::instruction::AccountMeta::new_readonly(
                        *self.collection_master_edition_account.key,
                        false,
                    ),
                    if let Some(collection_authority_record) = self.collection_authority_record {
                        solana_program::instruction::AccountMeta::new_readonly(
                            *collection_authority_record.key,
                            false,
                        )
                    } else {
                        solana_program::instruction::AccountMeta::new_readonly(
                            crate::MPL_TOKEN_METADATA_ID,
                            false,
                        )
                    },
                ],
                data: args.try_to_vec().unwrap(),
            };
            let mut account_infos = Vec::with_capacity(7 + 1);
            account_infos.push(self.program.clone());
            account_infos.push(self.metadata.clone());
            account_infos.push(self.collection_authority.clone());
            account_infos.push(self.payer.clone());
            account_infos.push(self.collection_mint.clone());
            account_infos.push(self.collection.clone());
            account_infos.push(self.collection_master_edition_account.clone());
            if let Some(collection_authority_record) = self.collection_authority_record {
                account_infos.push(collection_authority_record.clone());
            }

            if signers_seeds.is_empty() {
                solana_program::program::invoke(&instruction, &account_infos)
            } else {
                solana_program::program::invoke_signed(&instruction, &account_infos, signers_seeds)
            }
        }
    }

    /// `unverify_sized_collection_item` CPI instruction builder.
    pub struct UnverifySizedCollectionItemBuilder<'a> {
        program: &'a solana_program::account_info::AccountInfo<'a>,
        metadata: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        collection_authority: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        payer: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        collection_mint: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        collection: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        collection_master_edition_account:
            Option<&'a solana_program::account_info::AccountInfo<'a>>,
        collection_authority_record: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    }

    impl<'a> UnverifySizedCollectionItemBuilder<'a> {
        pub fn new(program: &'a solana_program::account_info::AccountInfo<'a>) -> Self {
            Self {
                program,
                metadata: None,
                collection_authority: None,
                payer: None,
                collection_mint: None,
                collection: None,
                collection_master_edition_account: None,
                collection_authority_record: None,
            }
        }
        pub fn metadata(
            &'a mut self,
            metadata: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.metadata = Some(metadata);
            self
        }
        pub fn collection_authority(
            &'a mut self,
            collection_authority: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.collection_authority = Some(collection_authority);
            self
        }
        pub fn payer(
            &'a mut self,
            payer: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.payer = Some(payer);
            self
        }
        pub fn collection_mint(
            &'a mut self,
            collection_mint: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.collection_mint = Some(collection_mint);
            self
        }
        pub fn collection(
            &'a mut self,
            collection: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.collection = Some(collection);
            self
        }
        pub fn collection_master_edition_account(
            &'a mut self,
            collection_master_edition_account: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.collection_master_edition_account = Some(collection_master_edition_account);
            self
        }
        pub fn collection_authority_record(
            &'a mut self,
            collection_authority_record: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.collection_authority_record = Some(collection_authority_record);
            self
        }
        pub fn build(&'a self) -> UnverifySizedCollectionItem {
            UnverifySizedCollectionItem {
                program: self.program,

                metadata: self.metadata.expect("metadata is not set"),

                collection_authority: self
                    .collection_authority
                    .expect("collection_authority is not set"),

                payer: self.payer.expect("payer is not set"),

                collection_mint: self.collection_mint.expect("collection_mint is not set"),

                collection: self.collection.expect("collection is not set"),

                collection_master_edition_account: self
                    .collection_master_edition_account
                    .expect("collection_master_edition_account is not set"),

                collection_authority_record: self.collection_authority_record,
            }
        }
    }
}
