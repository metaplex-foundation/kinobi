//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

use crate::generated::types::MintPrintingTokensViaTokenArgs;
#[cfg(feature = "anchor")]
use anchor_lang::prelude::{AnchorDeserialize, AnchorSerialize};
#[cfg(not(feature = "anchor"))]
use borsh::{BorshDeserialize, BorshSerialize};
#[cfg(feature = "serde")]
use serde::{Deserialize, Serialize};

/// Accounts.
pub struct DeprecatedMintPrintingTokens {
    /// Destination account
    pub destination: solana_program::pubkey::Pubkey,
    /// Printing mint
    pub printing_mint: solana_program::pubkey::Pubkey,
    /// Update authority
    pub update_authority: solana_program::pubkey::Pubkey,
    /// Metadata key (pda of ['metadata', program id, mint id])
    pub metadata: solana_program::pubkey::Pubkey,
    /// Master Edition V1 key (pda of ['metadata', program id, mint id, 'edition'])
    pub master_edition: solana_program::pubkey::Pubkey,
    /// Token program
    pub token_program: solana_program::pubkey::Pubkey,
    /// Rent
    pub rent: solana_program::pubkey::Pubkey,
}

impl DeprecatedMintPrintingTokens {
    pub fn instruction(
        &self,
        args: DeprecatedMintPrintingTokensInstructionArgs,
    ) -> solana_program::instruction::Instruction {
        self.instruction_with_remaining_accounts(args, &[])
    }
    #[allow(clippy::vec_init_then_push)]
    pub fn instruction_with_remaining_accounts(
        &self,
        args: DeprecatedMintPrintingTokensInstructionArgs,
        remaining_accounts: &[solana_program::instruction::AccountMeta],
    ) -> solana_program::instruction::Instruction {
        let mut accounts = Vec::with_capacity(7 + remaining_accounts.len());
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.destination,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.printing_mint,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.update_authority,
            true,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.metadata,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.master_edition,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.token_program,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.rent, false,
        ));
        accounts.extend_from_slice(remaining_accounts);
        let mut data = DeprecatedMintPrintingTokensInstructionData::new()
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
pub struct DeprecatedMintPrintingTokensInstructionData {
    discriminator: u8,
}

impl DeprecatedMintPrintingTokensInstructionData {
    pub fn new() -> Self {
        Self { discriminator: 9 }
    }
}

#[cfg_attr(not(feature = "anchor"), derive(BorshSerialize, BorshDeserialize))]
#[cfg_attr(feature = "anchor", derive(AnchorSerialize, AnchorDeserialize))]
#[cfg_attr(feature = "serde", derive(Serialize, Deserialize))]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct DeprecatedMintPrintingTokensInstructionArgs {
    pub mint_printing_tokens_via_token_args: MintPrintingTokensViaTokenArgs,
}

/// Instruction builder for `DeprecatedMintPrintingTokens`.
///
/// ### Accounts:
///
///   0. `[writable]` destination
///   1. `[writable]` printing_mint
///   2. `[signer]` update_authority
///   3. `[]` metadata
///   4. `[]` master_edition
///   5. `[optional]` token_program (default to `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`)
///   6. `[optional]` rent (default to `SysvarRent111111111111111111111111111111111`)
#[derive(Default)]
pub struct DeprecatedMintPrintingTokensBuilder {
    destination: Option<solana_program::pubkey::Pubkey>,
    printing_mint: Option<solana_program::pubkey::Pubkey>,
    update_authority: Option<solana_program::pubkey::Pubkey>,
    metadata: Option<solana_program::pubkey::Pubkey>,
    master_edition: Option<solana_program::pubkey::Pubkey>,
    token_program: Option<solana_program::pubkey::Pubkey>,
    rent: Option<solana_program::pubkey::Pubkey>,
    mint_printing_tokens_via_token_args: Option<MintPrintingTokensViaTokenArgs>,
    __remaining_accounts: Vec<solana_program::instruction::AccountMeta>,
}

impl DeprecatedMintPrintingTokensBuilder {
    pub fn new() -> Self {
        Self::default()
    }
    /// Destination account
    #[inline(always)]
    pub fn destination(&mut self, destination: solana_program::pubkey::Pubkey) -> &mut Self {
        self.destination = Some(destination);
        self
    }
    /// Printing mint
    #[inline(always)]
    pub fn printing_mint(&mut self, printing_mint: solana_program::pubkey::Pubkey) -> &mut Self {
        self.printing_mint = Some(printing_mint);
        self
    }
    /// Update authority
    #[inline(always)]
    pub fn update_authority(
        &mut self,
        update_authority: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.update_authority = Some(update_authority);
        self
    }
    /// Metadata key (pda of ['metadata', program id, mint id])
    #[inline(always)]
    pub fn metadata(&mut self, metadata: solana_program::pubkey::Pubkey) -> &mut Self {
        self.metadata = Some(metadata);
        self
    }
    /// Master Edition V1 key (pda of ['metadata', program id, mint id, 'edition'])
    #[inline(always)]
    pub fn master_edition(&mut self, master_edition: solana_program::pubkey::Pubkey) -> &mut Self {
        self.master_edition = Some(master_edition);
        self
    }
    /// `[optional account, default to 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA']`
    /// Token program
    #[inline(always)]
    pub fn token_program(&mut self, token_program: solana_program::pubkey::Pubkey) -> &mut Self {
        self.token_program = Some(token_program);
        self
    }
    /// `[optional account, default to 'SysvarRent111111111111111111111111111111111']`
    /// Rent
    #[inline(always)]
    pub fn rent(&mut self, rent: solana_program::pubkey::Pubkey) -> &mut Self {
        self.rent = Some(rent);
        self
    }
    #[inline(always)]
    pub fn mint_printing_tokens_via_token_args(
        &mut self,
        mint_printing_tokens_via_token_args: MintPrintingTokensViaTokenArgs,
    ) -> &mut Self {
        self.mint_printing_tokens_via_token_args = Some(mint_printing_tokens_via_token_args);
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
        let accounts = DeprecatedMintPrintingTokens {
            destination: self.destination.expect("destination is not set"),
            printing_mint: self.printing_mint.expect("printing_mint is not set"),
            update_authority: self.update_authority.expect("update_authority is not set"),
            metadata: self.metadata.expect("metadata is not set"),
            master_edition: self.master_edition.expect("master_edition is not set"),
            token_program: self.token_program.unwrap_or(solana_program::pubkey!(
                "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
            )),
            rent: self.rent.unwrap_or(solana_program::pubkey!(
                "SysvarRent111111111111111111111111111111111"
            )),
        };
        let args = DeprecatedMintPrintingTokensInstructionArgs {
            mint_printing_tokens_via_token_args: self
                .mint_printing_tokens_via_token_args
                .clone()
                .expect("mint_printing_tokens_via_token_args is not set"),
        };

        accounts.instruction_with_remaining_accounts(args, &self.__remaining_accounts)
    }
}

/// `deprecated_mint_printing_tokens` CPI accounts.
pub struct DeprecatedMintPrintingTokensCpiAccounts<'a, 'b> {
    /// Destination account
    pub destination: &'b solana_program::account_info::AccountInfo<'a>,
    /// Printing mint
    pub printing_mint: &'b solana_program::account_info::AccountInfo<'a>,
    /// Update authority
    pub update_authority: &'b solana_program::account_info::AccountInfo<'a>,
    /// Metadata key (pda of ['metadata', program id, mint id])
    pub metadata: &'b solana_program::account_info::AccountInfo<'a>,
    /// Master Edition V1 key (pda of ['metadata', program id, mint id, 'edition'])
    pub master_edition: &'b solana_program::account_info::AccountInfo<'a>,
    /// Token program
    pub token_program: &'b solana_program::account_info::AccountInfo<'a>,
    /// Rent
    pub rent: &'b solana_program::account_info::AccountInfo<'a>,
}

/// `deprecated_mint_printing_tokens` CPI instruction.
pub struct DeprecatedMintPrintingTokensCpi<'a, 'b> {
    /// The program to invoke.
    pub __program: &'b solana_program::account_info::AccountInfo<'a>,
    /// Destination account
    pub destination: &'b solana_program::account_info::AccountInfo<'a>,
    /// Printing mint
    pub printing_mint: &'b solana_program::account_info::AccountInfo<'a>,
    /// Update authority
    pub update_authority: &'b solana_program::account_info::AccountInfo<'a>,
    /// Metadata key (pda of ['metadata', program id, mint id])
    pub metadata: &'b solana_program::account_info::AccountInfo<'a>,
    /// Master Edition V1 key (pda of ['metadata', program id, mint id, 'edition'])
    pub master_edition: &'b solana_program::account_info::AccountInfo<'a>,
    /// Token program
    pub token_program: &'b solana_program::account_info::AccountInfo<'a>,
    /// Rent
    pub rent: &'b solana_program::account_info::AccountInfo<'a>,
    /// The arguments for the instruction.
    pub __args: DeprecatedMintPrintingTokensInstructionArgs,
}

impl<'a, 'b> DeprecatedMintPrintingTokensCpi<'a, 'b> {
    pub fn new(
        program: &'b solana_program::account_info::AccountInfo<'a>,
        accounts: DeprecatedMintPrintingTokensCpiAccounts<'a, 'b>,
        args: DeprecatedMintPrintingTokensInstructionArgs,
    ) -> Self {
        Self {
            __program: program,
            destination: accounts.destination,
            printing_mint: accounts.printing_mint,
            update_authority: accounts.update_authority,
            metadata: accounts.metadata,
            master_edition: accounts.master_edition,
            token_program: accounts.token_program,
            rent: accounts.rent,
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
        let mut accounts = Vec::with_capacity(7 + remaining_accounts.len());
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.destination.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.printing_mint.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.update_authority.key,
            true,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.metadata.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.master_edition.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.token_program.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.rent.key,
            false,
        ));
        remaining_accounts.iter().for_each(|remaining_account| {
            accounts.push(solana_program::instruction::AccountMeta {
                pubkey: *remaining_account.0.key,
                is_signer: remaining_account.1,
                is_writable: remaining_account.2,
            })
        });
        let mut data = DeprecatedMintPrintingTokensInstructionData::new()
            .try_to_vec()
            .unwrap();
        let mut args = self.__args.try_to_vec().unwrap();
        data.append(&mut args);

        let instruction = solana_program::instruction::Instruction {
            program_id: crate::MPL_TOKEN_METADATA_ID,
            accounts,
            data,
        };
        let mut account_infos = Vec::with_capacity(7 + 1 + remaining_accounts.len());
        account_infos.push(self.__program.clone());
        account_infos.push(self.destination.clone());
        account_infos.push(self.printing_mint.clone());
        account_infos.push(self.update_authority.clone());
        account_infos.push(self.metadata.clone());
        account_infos.push(self.master_edition.clone());
        account_infos.push(self.token_program.clone());
        account_infos.push(self.rent.clone());
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

/// Instruction builder for `DeprecatedMintPrintingTokens` via CPI.
///
/// ### Accounts:
///
///   0. `[writable]` destination
///   1. `[writable]` printing_mint
///   2. `[signer]` update_authority
///   3. `[]` metadata
///   4. `[]` master_edition
///   5. `[]` token_program
///   6. `[]` rent
pub struct DeprecatedMintPrintingTokensCpiBuilder<'a, 'b> {
    instruction: Box<DeprecatedMintPrintingTokensCpiBuilderInstruction<'a, 'b>>,
}

impl<'a, 'b> DeprecatedMintPrintingTokensCpiBuilder<'a, 'b> {
    pub fn new(program: &'b solana_program::account_info::AccountInfo<'a>) -> Self {
        let instruction = Box::new(DeprecatedMintPrintingTokensCpiBuilderInstruction {
            __program: program,
            destination: None,
            printing_mint: None,
            update_authority: None,
            metadata: None,
            master_edition: None,
            token_program: None,
            rent: None,
            mint_printing_tokens_via_token_args: None,
            __remaining_accounts: Vec::new(),
        });
        Self { instruction }
    }
    /// Destination account
    #[inline(always)]
    pub fn destination(
        &mut self,
        destination: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.destination = Some(destination);
        self
    }
    /// Printing mint
    #[inline(always)]
    pub fn printing_mint(
        &mut self,
        printing_mint: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.printing_mint = Some(printing_mint);
        self
    }
    /// Update authority
    #[inline(always)]
    pub fn update_authority(
        &mut self,
        update_authority: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.update_authority = Some(update_authority);
        self
    }
    /// Metadata key (pda of ['metadata', program id, mint id])
    #[inline(always)]
    pub fn metadata(
        &mut self,
        metadata: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.metadata = Some(metadata);
        self
    }
    /// Master Edition V1 key (pda of ['metadata', program id, mint id, 'edition'])
    #[inline(always)]
    pub fn master_edition(
        &mut self,
        master_edition: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.master_edition = Some(master_edition);
        self
    }
    /// Token program
    #[inline(always)]
    pub fn token_program(
        &mut self,
        token_program: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.token_program = Some(token_program);
        self
    }
    /// Rent
    #[inline(always)]
    pub fn rent(&mut self, rent: &'b solana_program::account_info::AccountInfo<'a>) -> &mut Self {
        self.instruction.rent = Some(rent);
        self
    }
    #[inline(always)]
    pub fn mint_printing_tokens_via_token_args(
        &mut self,
        mint_printing_tokens_via_token_args: MintPrintingTokensViaTokenArgs,
    ) -> &mut Self {
        self.instruction.mint_printing_tokens_via_token_args =
            Some(mint_printing_tokens_via_token_args);
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
        let args = DeprecatedMintPrintingTokensInstructionArgs {
            mint_printing_tokens_via_token_args: self
                .instruction
                .mint_printing_tokens_via_token_args
                .clone()
                .expect("mint_printing_tokens_via_token_args is not set"),
        };
        let instruction = DeprecatedMintPrintingTokensCpi {
            __program: self.instruction.__program,

            destination: self
                .instruction
                .destination
                .expect("destination is not set"),

            printing_mint: self
                .instruction
                .printing_mint
                .expect("printing_mint is not set"),

            update_authority: self
                .instruction
                .update_authority
                .expect("update_authority is not set"),

            metadata: self.instruction.metadata.expect("metadata is not set"),

            master_edition: self
                .instruction
                .master_edition
                .expect("master_edition is not set"),

            token_program: self
                .instruction
                .token_program
                .expect("token_program is not set"),

            rent: self.instruction.rent.expect("rent is not set"),
            __args: args,
        };
        instruction.invoke_signed_with_remaining_accounts(
            signers_seeds,
            &self.instruction.__remaining_accounts,
        )
    }
}

struct DeprecatedMintPrintingTokensCpiBuilderInstruction<'a, 'b> {
    __program: &'b solana_program::account_info::AccountInfo<'a>,
    destination: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    printing_mint: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    update_authority: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    metadata: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    master_edition: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    token_program: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    rent: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    mint_printing_tokens_via_token_args: Option<MintPrintingTokensViaTokenArgs>,
    /// Additional instruction accounts `(AccountInfo, is_writable, is_signer)`.
    __remaining_accounts: Vec<(
        &'b solana_program::account_info::AccountInfo<'a>,
        bool,
        bool,
    )>,
}
