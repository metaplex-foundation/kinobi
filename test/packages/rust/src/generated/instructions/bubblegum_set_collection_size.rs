//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

use crate::generated::types::SetCollectionSizeArgs;
#[cfg(feature = "anchor")]
use anchor_lang::prelude::{AnchorDeserialize, AnchorSerialize};
#[cfg(not(feature = "anchor"))]
use borsh::{BorshDeserialize, BorshSerialize};
#[cfg(feature = "serde")]
use serde::{Deserialize, Serialize};

/// Accounts.
pub struct BubblegumSetCollectionSize {
    /// Collection Metadata account
    pub collection_metadata: solana_program::pubkey::Pubkey,
    /// Collection Update authority
    pub collection_authority: solana_program::pubkey::Pubkey,
    /// Mint of the Collection
    pub collection_mint: solana_program::pubkey::Pubkey,
    /// Signing PDA of Bubblegum program
    pub bubblegum_signer: solana_program::pubkey::Pubkey,
    /// Collection Authority Record PDA
    pub collection_authority_record: Option<solana_program::pubkey::Pubkey>,
}

impl BubblegumSetCollectionSize {
    pub fn instruction(
        &self,
        args: BubblegumSetCollectionSizeInstructionArgs,
    ) -> solana_program::instruction::Instruction {
        self.instruction_with_remaining_accounts(args, &[])
    }
    #[allow(clippy::vec_init_then_push)]
    pub fn instruction_with_remaining_accounts(
        &self,
        args: BubblegumSetCollectionSizeInstructionArgs,
        remaining_accounts: &[solana_program::instruction::AccountMeta],
    ) -> solana_program::instruction::Instruction {
        let mut accounts = Vec::with_capacity(5 + remaining_accounts.len());
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.collection_metadata,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.collection_authority,
            true,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.collection_mint,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.bubblegum_signer,
            true,
        ));
        if let Some(collection_authority_record) = self.collection_authority_record {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                collection_authority_record,
                false,
            ));
        } else {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                crate::MPL_TOKEN_METADATA_ID,
                false,
            ));
        }
        accounts.extend_from_slice(remaining_accounts);
        let mut data = BubblegumSetCollectionSizeInstructionData::new()
            .try_to_vec()
            .unwrap();
        let mut args = args.try_to_vec().unwrap();
        data.append(&mut args);

        solana_program::instruction::Instruction {
            program_id: crate::MPL_TOKEN_METADATA_ID,
            accounts,
            data,
        }
    }
}

#[cfg_attr(not(feature = "anchor"), derive(BorshSerialize, BorshDeserialize))]
#[cfg_attr(feature = "anchor", derive(AnchorSerialize, AnchorDeserialize))]
pub struct BubblegumSetCollectionSizeInstructionData {
    discriminator: u8,
}

impl BubblegumSetCollectionSizeInstructionData {
    pub fn new() -> Self {
        Self { discriminator: 36 }
    }
}

#[cfg_attr(not(feature = "anchor"), derive(BorshSerialize, BorshDeserialize))]
#[cfg_attr(feature = "anchor", derive(AnchorSerialize, AnchorDeserialize))]
#[cfg_attr(feature = "serde", derive(Serialize, Deserialize))]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BubblegumSetCollectionSizeInstructionArgs {
    pub set_collection_size_args: SetCollectionSizeArgs,
}

/// Instruction builder for `BubblegumSetCollectionSize`.
///
/// ### Accounts:
///
///   0. `[writable]` collection_metadata
///   1. `[writable, signer]` collection_authority
///   2. `[]` collection_mint
///   3. `[signer]` bubblegum_signer
///   4. `[optional]` collection_authority_record
#[derive(Default)]
pub struct BubblegumSetCollectionSizeBuilder {
    collection_metadata: Option<solana_program::pubkey::Pubkey>,
    collection_authority: Option<solana_program::pubkey::Pubkey>,
    collection_mint: Option<solana_program::pubkey::Pubkey>,
    bubblegum_signer: Option<solana_program::pubkey::Pubkey>,
    collection_authority_record: Option<solana_program::pubkey::Pubkey>,
    set_collection_size_args: Option<SetCollectionSizeArgs>,
    __remaining_accounts: Vec<solana_program::instruction::AccountMeta>,
}

impl BubblegumSetCollectionSizeBuilder {
    pub fn new() -> Self {
        Self::default()
    }
    /// Collection Metadata account
    #[inline(always)]
    pub fn collection_metadata(
        &mut self,
        collection_metadata: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.collection_metadata = Some(collection_metadata);
        self
    }
    /// Collection Update authority
    #[inline(always)]
    pub fn collection_authority(
        &mut self,
        collection_authority: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.collection_authority = Some(collection_authority);
        self
    }
    /// Mint of the Collection
    #[inline(always)]
    pub fn collection_mint(
        &mut self,
        collection_mint: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.collection_mint = Some(collection_mint);
        self
    }
    /// Signing PDA of Bubblegum program
    #[inline(always)]
    pub fn bubblegum_signer(
        &mut self,
        bubblegum_signer: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.bubblegum_signer = Some(bubblegum_signer);
        self
    }
    /// `[optional account]`
    /// Collection Authority Record PDA
    #[inline(always)]
    pub fn collection_authority_record(
        &mut self,
        collection_authority_record: Option<solana_program::pubkey::Pubkey>,
    ) -> &mut Self {
        self.collection_authority_record = collection_authority_record;
        self
    }
    #[inline(always)]
    pub fn set_collection_size_args(
        &mut self,
        set_collection_size_args: SetCollectionSizeArgs,
    ) -> &mut Self {
        self.set_collection_size_args = Some(set_collection_size_args);
        self
    }
    /// Add an aditional account to the instruction.
    #[inline(always)]
    pub fn add_remaining_account(
        &mut self,
        account: solana_program::instruction::AccountMeta,
    ) -> &mut Self {
        self.__remaining_accounts.push(account);
        self
    }
    /// Add additional accounts to the instruction.
    #[inline(always)]
    pub fn add_remaining_accounts(
        &mut self,
        accounts: &[solana_program::instruction::AccountMeta],
    ) -> &mut Self {
        self.__remaining_accounts.extend_from_slice(accounts);
        self
    }
    #[allow(clippy::clone_on_copy)]
    pub fn instruction(&self) -> solana_program::instruction::Instruction {
        let accounts = BubblegumSetCollectionSize {
            collection_metadata: self
                .collection_metadata
                .expect("collection_metadata is not set"),
            collection_authority: self
                .collection_authority
                .expect("collection_authority is not set"),
            collection_mint: self.collection_mint.expect("collection_mint is not set"),
            bubblegum_signer: self.bubblegum_signer.expect("bubblegum_signer is not set"),
            collection_authority_record: self.collection_authority_record,
        };
        let args = BubblegumSetCollectionSizeInstructionArgs {
            set_collection_size_args: self
                .set_collection_size_args
                .clone()
                .expect("set_collection_size_args is not set"),
        };

        accounts.instruction_with_remaining_accounts(args, &self.__remaining_accounts)
    }
}

/// `bubblegum_set_collection_size` CPI accounts.
pub struct BubblegumSetCollectionSizeCpiAccounts<'a, 'b> {
    /// Collection Metadata account
    pub collection_metadata: &'b solana_program::account_info::AccountInfo<'a>,
    /// Collection Update authority
    pub collection_authority: &'b solana_program::account_info::AccountInfo<'a>,
    /// Mint of the Collection
    pub collection_mint: &'b solana_program::account_info::AccountInfo<'a>,
    /// Signing PDA of Bubblegum program
    pub bubblegum_signer: &'b solana_program::account_info::AccountInfo<'a>,
    /// Collection Authority Record PDA
    pub collection_authority_record: Option<&'b solana_program::account_info::AccountInfo<'a>>,
}

/// `bubblegum_set_collection_size` CPI instruction.
pub struct BubblegumSetCollectionSizeCpi<'a, 'b> {
    /// The program to invoke.
    pub __program: &'b solana_program::account_info::AccountInfo<'a>,
    /// Collection Metadata account
    pub collection_metadata: &'b solana_program::account_info::AccountInfo<'a>,
    /// Collection Update authority
    pub collection_authority: &'b solana_program::account_info::AccountInfo<'a>,
    /// Mint of the Collection
    pub collection_mint: &'b solana_program::account_info::AccountInfo<'a>,
    /// Signing PDA of Bubblegum program
    pub bubblegum_signer: &'b solana_program::account_info::AccountInfo<'a>,
    /// Collection Authority Record PDA
    pub collection_authority_record: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    /// The arguments for the instruction.
    pub __args: BubblegumSetCollectionSizeInstructionArgs,
}

impl<'a, 'b> BubblegumSetCollectionSizeCpi<'a, 'b> {
    pub fn new(
        program: &'b solana_program::account_info::AccountInfo<'a>,
        accounts: BubblegumSetCollectionSizeCpiAccounts<'a, 'b>,
        args: BubblegumSetCollectionSizeInstructionArgs,
    ) -> Self {
        Self {
            __program: program,
            collection_metadata: accounts.collection_metadata,
            collection_authority: accounts.collection_authority,
            collection_mint: accounts.collection_mint,
            bubblegum_signer: accounts.bubblegum_signer,
            collection_authority_record: accounts.collection_authority_record,
            __args: args,
        }
    }
    #[inline(always)]
    pub fn invoke(&self) -> solana_program::entrypoint::ProgramResult {
        self.invoke_signed_with_remaining_accounts(&[], &[])
    }
    #[inline(always)]
    pub fn invoke_with_remaining_accounts(
        &self,
        remaining_accounts: &[(
            &'b solana_program::account_info::AccountInfo<'a>,
            bool,
            bool,
        )],
    ) -> solana_program::entrypoint::ProgramResult {
        self.invoke_signed_with_remaining_accounts(&[], remaining_accounts)
    }
    #[inline(always)]
    pub fn invoke_signed(
        &self,
        signers_seeds: &[&[&[u8]]],
    ) -> solana_program::entrypoint::ProgramResult {
        self.invoke_signed_with_remaining_accounts(signers_seeds, &[])
    }
    #[allow(clippy::clone_on_copy)]
    #[allow(clippy::vec_init_then_push)]
    pub fn invoke_signed_with_remaining_accounts(
        &self,
        signers_seeds: &[&[&[u8]]],
        remaining_accounts: &[(
            &'b solana_program::account_info::AccountInfo<'a>,
            bool,
            bool,
        )],
    ) -> solana_program::entrypoint::ProgramResult {
        let mut accounts = Vec::with_capacity(5 + remaining_accounts.len());
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.collection_metadata.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.collection_authority.key,
            true,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.collection_mint.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.bubblegum_signer.key,
            true,
        ));
        if let Some(collection_authority_record) = self.collection_authority_record {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                *collection_authority_record.key,
                false,
            ));
        } else {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                crate::MPL_TOKEN_METADATA_ID,
                false,
            ));
        }
        remaining_accounts.iter().for_each(|remaining_account| {
            accounts.push(solana_program::instruction::AccountMeta {
                pubkey: *remaining_account.0.key,
                is_signer: remaining_account.1,
                is_writable: remaining_account.2,
            })
        });
        let mut data = BubblegumSetCollectionSizeInstructionData::new()
            .try_to_vec()
            .unwrap();
        let mut args = self.__args.try_to_vec().unwrap();
        data.append(&mut args);

        let instruction = solana_program::instruction::Instruction {
            program_id: crate::MPL_TOKEN_METADATA_ID,
            accounts,
            data,
        };
        let mut account_infos = Vec::with_capacity(5 + 1 + remaining_accounts.len());
        account_infos.push(self.__program.clone());
        account_infos.push(self.collection_metadata.clone());
        account_infos.push(self.collection_authority.clone());
        account_infos.push(self.collection_mint.clone());
        account_infos.push(self.bubblegum_signer.clone());
        if let Some(collection_authority_record) = self.collection_authority_record {
            account_infos.push(collection_authority_record.clone());
        }
        remaining_accounts
            .iter()
            .for_each(|remaining_account| account_infos.push(remaining_account.0.clone()));

        if signers_seeds.is_empty() {
            solana_program::program::invoke(&instruction, &account_infos)
        } else {
            solana_program::program::invoke_signed(&instruction, &account_infos, signers_seeds)
        }
    }
}

/// Instruction builder for `BubblegumSetCollectionSize` via CPI.
///
/// ### Accounts:
///
///   0. `[writable]` collection_metadata
///   1. `[writable, signer]` collection_authority
///   2. `[]` collection_mint
///   3. `[signer]` bubblegum_signer
///   4. `[optional]` collection_authority_record
pub struct BubblegumSetCollectionSizeCpiBuilder<'a, 'b> {
    instruction: Box<BubblegumSetCollectionSizeCpiBuilderInstruction<'a, 'b>>,
}

impl<'a, 'b> BubblegumSetCollectionSizeCpiBuilder<'a, 'b> {
    pub fn new(program: &'b solana_program::account_info::AccountInfo<'a>) -> Self {
        let instruction = Box::new(BubblegumSetCollectionSizeCpiBuilderInstruction {
            __program: program,
            collection_metadata: None,
            collection_authority: None,
            collection_mint: None,
            bubblegum_signer: None,
            collection_authority_record: None,
            set_collection_size_args: None,
            __remaining_accounts: Vec::new(),
        });
        Self { instruction }
    }
    /// Collection Metadata account
    #[inline(always)]
    pub fn collection_metadata(
        &mut self,
        collection_metadata: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.collection_metadata = Some(collection_metadata);
        self
    }
    /// Collection Update authority
    #[inline(always)]
    pub fn collection_authority(
        &mut self,
        collection_authority: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.collection_authority = Some(collection_authority);
        self
    }
    /// Mint of the Collection
    #[inline(always)]
    pub fn collection_mint(
        &mut self,
        collection_mint: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.collection_mint = Some(collection_mint);
        self
    }
    /// Signing PDA of Bubblegum program
    #[inline(always)]
    pub fn bubblegum_signer(
        &mut self,
        bubblegum_signer: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.bubblegum_signer = Some(bubblegum_signer);
        self
    }
    /// `[optional account]`
    /// Collection Authority Record PDA
    #[inline(always)]
    pub fn collection_authority_record(
        &mut self,
        collection_authority_record: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    ) -> &mut Self {
        self.instruction.collection_authority_record = collection_authority_record;
        self
    }
    #[inline(always)]
    pub fn set_collection_size_args(
        &mut self,
        set_collection_size_args: SetCollectionSizeArgs,
    ) -> &mut Self {
        self.instruction.set_collection_size_args = Some(set_collection_size_args);
        self
    }
    /// Add an additional account to the instruction.
    #[inline(always)]
    pub fn add_remaining_account(
        &mut self,
        account: &'b solana_program::account_info::AccountInfo<'a>,
        is_writable: bool,
        is_signer: bool,
    ) -> &mut Self {
        self.instruction
            .__remaining_accounts
            .push((account, is_writable, is_signer));
        self
    }
    /// Add additional accounts to the instruction.
    ///
    /// Each account is represented by a tuple of the `AccountInfo`, a `bool` indicating whether the account is writable or not,
    /// and a `bool` indicating whether the account is a signer or not.
    #[inline(always)]
    pub fn add_remaining_accounts(
        &mut self,
        accounts: &[(
            &'b solana_program::account_info::AccountInfo<'a>,
            bool,
            bool,
        )],
    ) -> &mut Self {
        self.instruction
            .__remaining_accounts
            .extend_from_slice(accounts);
        self
    }
    #[inline(always)]
    pub fn invoke(&self) -> solana_program::entrypoint::ProgramResult {
        self.invoke_signed(&[])
    }
    #[allow(clippy::clone_on_copy)]
    #[allow(clippy::vec_init_then_push)]
    pub fn invoke_signed(
        &self,
        signers_seeds: &[&[&[u8]]],
    ) -> solana_program::entrypoint::ProgramResult {
        let args = BubblegumSetCollectionSizeInstructionArgs {
            set_collection_size_args: self
                .instruction
                .set_collection_size_args
                .clone()
                .expect("set_collection_size_args is not set"),
        };
        let instruction = BubblegumSetCollectionSizeCpi {
            __program: self.instruction.__program,

            collection_metadata: self
                .instruction
                .collection_metadata
                .expect("collection_metadata is not set"),

            collection_authority: self
                .instruction
                .collection_authority
                .expect("collection_authority is not set"),

            collection_mint: self
                .instruction
                .collection_mint
                .expect("collection_mint is not set"),

            bubblegum_signer: self
                .instruction
                .bubblegum_signer
                .expect("bubblegum_signer is not set"),

            collection_authority_record: self.instruction.collection_authority_record,
            __args: args,
        };
        instruction.invoke_signed_with_remaining_accounts(
            signers_seeds,
            &self.instruction.__remaining_accounts,
        )
    }
}

struct BubblegumSetCollectionSizeCpiBuilderInstruction<'a, 'b> {
    __program: &'b solana_program::account_info::AccountInfo<'a>,
    collection_metadata: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    collection_authority: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    collection_mint: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    bubblegum_signer: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    collection_authority_record: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    set_collection_size_args: Option<SetCollectionSizeArgs>,
    /// Additional instruction accounts `(AccountInfo, is_writable, is_signer)`.
    __remaining_accounts: Vec<(
        &'b solana_program::account_info::AccountInfo<'a>,
        bool,
        bool,
    )>,
}
