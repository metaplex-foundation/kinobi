//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

use crate::generated::types::MigrateArgs;
use borsh::BorshDeserialize;
use borsh::BorshSerialize;

/// Accounts.
pub struct Migrate {
    /// Metadata account
    pub metadata: solana_program::pubkey::Pubkey,
    /// Master edition account
    pub master_edition: solana_program::pubkey::Pubkey,
    /// Token account
    pub token_account: solana_program::pubkey::Pubkey,
    /// Mint account
    pub mint: solana_program::pubkey::Pubkey,
    /// Update authority
    pub update_authority: solana_program::pubkey::Pubkey,
    /// Collection metadata account
    pub collection_metadata: solana_program::pubkey::Pubkey,
    /// Token Program
    pub token_program: solana_program::pubkey::Pubkey,
    /// System program
    pub system_program: solana_program::pubkey::Pubkey,
    /// Instruction sysvar account
    pub sysvar_instructions: solana_program::pubkey::Pubkey,
    /// Token Authorization Rules account
    pub authorization_rules: Option<solana_program::pubkey::Pubkey>,
}

impl Migrate {
    pub fn instruction(
        &self,
        args: MigrateInstructionArgs,
    ) -> solana_program::instruction::Instruction {
        self.instruction_with_remaining_accounts(args, &[])
    }
    #[allow(clippy::vec_init_then_push)]
    pub fn instruction_with_remaining_accounts(
        &self,
        args: MigrateInstructionArgs,
        remaining_accounts: &[solana_program::instruction::AccountMeta],
    ) -> solana_program::instruction::Instruction {
        let mut accounts = Vec::with_capacity(10 + remaining_accounts.len());
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.metadata,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.master_edition,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.token_account,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.mint, false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.update_authority,
            true,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.collection_metadata,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.token_program,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.system_program,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.sysvar_instructions,
            false,
        ));
        if let Some(authorization_rules) = self.authorization_rules {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                authorization_rules,
                false,
            ));
        } else {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                crate::MPL_TOKEN_METADATA_ID,
                false,
            ));
        }
        accounts.extend_from_slice(remaining_accounts);
        let mut data = MigrateInstructionData::new().try_to_vec().unwrap();
        let mut args = args.try_to_vec().unwrap();
        data.append(&mut args);

        solana_program::instruction::Instruction {
            program_id: crate::MPL_TOKEN_METADATA_ID,
            accounts,
            data,
        }
    }
}

#[derive(BorshDeserialize, BorshSerialize)]
pub struct MigrateInstructionData {
    discriminator: u8,
}

impl MigrateInstructionData {
    pub fn new() -> Self {
        Self { discriminator: 50 }
    }
}

#[cfg_attr(not(feature = "anchor"), derive(BorshSerialize, BorshDeserialize))]
#[cfg_attr(
    feature = "anchor",
    derive(anchor_lang::AnchorSerialize, anchor_lang::AnchorDeserialize)
)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MigrateInstructionArgs {
    pub migrate_args: MigrateArgs,
}

/// Instruction builder for `Migrate`.
///
/// ### Accounts:
///
///   0. `[writable]` metadata
///   1. `[]` master_edition
///   2. `[writable]` token_account
///   3. `[]` mint
///   4. `[signer]` update_authority
///   5. `[]` collection_metadata
///   6. `[optional]` token_program (default to `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`)
///   7. `[optional]` system_program (default to `11111111111111111111111111111111`)
///   8. `[optional]` sysvar_instructions (default to `Sysvar1nstructions1111111111111111111111111`)
///   9. `[optional]` authorization_rules
#[derive(Default)]
pub struct MigrateBuilder {
    metadata: Option<solana_program::pubkey::Pubkey>,
    master_edition: Option<solana_program::pubkey::Pubkey>,
    token_account: Option<solana_program::pubkey::Pubkey>,
    mint: Option<solana_program::pubkey::Pubkey>,
    update_authority: Option<solana_program::pubkey::Pubkey>,
    collection_metadata: Option<solana_program::pubkey::Pubkey>,
    token_program: Option<solana_program::pubkey::Pubkey>,
    system_program: Option<solana_program::pubkey::Pubkey>,
    sysvar_instructions: Option<solana_program::pubkey::Pubkey>,
    authorization_rules: Option<solana_program::pubkey::Pubkey>,
    migrate_args: Option<MigrateArgs>,
    __remaining_accounts: Vec<solana_program::instruction::AccountMeta>,
}

impl MigrateBuilder {
    pub fn new() -> Self {
        Self::default()
    }
    /// Metadata account
    #[inline(always)]
    pub fn metadata(&mut self, metadata: solana_program::pubkey::Pubkey) -> &mut Self {
        self.metadata = Some(metadata);
        self
    }
    /// Master edition account
    #[inline(always)]
    pub fn master_edition(&mut self, master_edition: solana_program::pubkey::Pubkey) -> &mut Self {
        self.master_edition = Some(master_edition);
        self
    }
    /// Token account
    #[inline(always)]
    pub fn token_account(&mut self, token_account: solana_program::pubkey::Pubkey) -> &mut Self {
        self.token_account = Some(token_account);
        self
    }
    /// Mint account
    #[inline(always)]
    pub fn mint(&mut self, mint: solana_program::pubkey::Pubkey) -> &mut Self {
        self.mint = Some(mint);
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
    /// Collection metadata account
    #[inline(always)]
    pub fn collection_metadata(
        &mut self,
        collection_metadata: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.collection_metadata = Some(collection_metadata);
        self
    }
    /// `[optional account, default to 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA']`
    /// Token Program
    #[inline(always)]
    pub fn token_program(&mut self, token_program: solana_program::pubkey::Pubkey) -> &mut Self {
        self.token_program = Some(token_program);
        self
    }
    /// `[optional account, default to '11111111111111111111111111111111']`
    /// System program
    #[inline(always)]
    pub fn system_program(&mut self, system_program: solana_program::pubkey::Pubkey) -> &mut Self {
        self.system_program = Some(system_program);
        self
    }
    /// `[optional account, default to 'Sysvar1nstructions1111111111111111111111111']`
    /// Instruction sysvar account
    #[inline(always)]
    pub fn sysvar_instructions(
        &mut self,
        sysvar_instructions: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.sysvar_instructions = Some(sysvar_instructions);
        self
    }
    /// `[optional account]`
    /// Token Authorization Rules account
    #[inline(always)]
    pub fn authorization_rules(
        &mut self,
        authorization_rules: Option<solana_program::pubkey::Pubkey>,
    ) -> &mut Self {
        self.authorization_rules = authorization_rules;
        self
    }
    #[inline(always)]
    pub fn migrate_args(&mut self, migrate_args: MigrateArgs) -> &mut Self {
        self.migrate_args = Some(migrate_args);
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
        let accounts = Migrate {
            metadata: self.metadata.expect("metadata is not set"),
            master_edition: self.master_edition.expect("master_edition is not set"),
            token_account: self.token_account.expect("token_account is not set"),
            mint: self.mint.expect("mint is not set"),
            update_authority: self.update_authority.expect("update_authority is not set"),
            collection_metadata: self
                .collection_metadata
                .expect("collection_metadata is not set"),
            token_program: self.token_program.unwrap_or(solana_program::pubkey!(
                "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
            )),
            system_program: self
                .system_program
                .unwrap_or(solana_program::pubkey!("11111111111111111111111111111111")),
            sysvar_instructions: self.sysvar_instructions.unwrap_or(solana_program::pubkey!(
                "Sysvar1nstructions1111111111111111111111111"
            )),
            authorization_rules: self.authorization_rules,
        };
        let args = MigrateInstructionArgs {
            migrate_args: self.migrate_args.clone().expect("migrate_args is not set"),
        };

        accounts.instruction_with_remaining_accounts(args, &self.__remaining_accounts)
    }
}

/// `migrate` CPI accounts.
pub struct MigrateCpiAccounts<'a, 'b> {
    /// Metadata account
    pub metadata: &'b solana_program::account_info::AccountInfo<'a>,
    /// Master edition account
    pub master_edition: &'b solana_program::account_info::AccountInfo<'a>,
    /// Token account
    pub token_account: &'b solana_program::account_info::AccountInfo<'a>,
    /// Mint account
    pub mint: &'b solana_program::account_info::AccountInfo<'a>,
    /// Update authority
    pub update_authority: &'b solana_program::account_info::AccountInfo<'a>,
    /// Collection metadata account
    pub collection_metadata: &'b solana_program::account_info::AccountInfo<'a>,
    /// Token Program
    pub token_program: &'b solana_program::account_info::AccountInfo<'a>,
    /// System program
    pub system_program: &'b solana_program::account_info::AccountInfo<'a>,
    /// Instruction sysvar account
    pub sysvar_instructions: &'b solana_program::account_info::AccountInfo<'a>,
    /// Token Authorization Rules account
    pub authorization_rules: Option<&'b solana_program::account_info::AccountInfo<'a>>,
}

/// `migrate` CPI instruction.
pub struct MigrateCpi<'a, 'b> {
    /// The program to invoke.
    pub __program: &'b solana_program::account_info::AccountInfo<'a>,
    /// Metadata account
    pub metadata: &'b solana_program::account_info::AccountInfo<'a>,
    /// Master edition account
    pub master_edition: &'b solana_program::account_info::AccountInfo<'a>,
    /// Token account
    pub token_account: &'b solana_program::account_info::AccountInfo<'a>,
    /// Mint account
    pub mint: &'b solana_program::account_info::AccountInfo<'a>,
    /// Update authority
    pub update_authority: &'b solana_program::account_info::AccountInfo<'a>,
    /// Collection metadata account
    pub collection_metadata: &'b solana_program::account_info::AccountInfo<'a>,
    /// Token Program
    pub token_program: &'b solana_program::account_info::AccountInfo<'a>,
    /// System program
    pub system_program: &'b solana_program::account_info::AccountInfo<'a>,
    /// Instruction sysvar account
    pub sysvar_instructions: &'b solana_program::account_info::AccountInfo<'a>,
    /// Token Authorization Rules account
    pub authorization_rules: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    /// The arguments for the instruction.
    pub __args: MigrateInstructionArgs,
}

impl<'a, 'b> MigrateCpi<'a, 'b> {
    pub fn new(
        program: &'b solana_program::account_info::AccountInfo<'a>,
        accounts: MigrateCpiAccounts<'a, 'b>,
        args: MigrateInstructionArgs,
    ) -> Self {
        Self {
            __program: program,
            metadata: accounts.metadata,
            master_edition: accounts.master_edition,
            token_account: accounts.token_account,
            mint: accounts.mint,
            update_authority: accounts.update_authority,
            collection_metadata: accounts.collection_metadata,
            token_program: accounts.token_program,
            system_program: accounts.system_program,
            sysvar_instructions: accounts.sysvar_instructions,
            authorization_rules: accounts.authorization_rules,
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
        let mut accounts = Vec::with_capacity(10 + remaining_accounts.len());
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.metadata.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.master_edition.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.token_account.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.mint.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.update_authority.key,
            true,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.collection_metadata.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.token_program.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.system_program.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.sysvar_instructions.key,
            false,
        ));
        if let Some(authorization_rules) = self.authorization_rules {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                *authorization_rules.key,
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
        let mut data = MigrateInstructionData::new().try_to_vec().unwrap();
        let mut args = self.__args.try_to_vec().unwrap();
        data.append(&mut args);

        let instruction = solana_program::instruction::Instruction {
            program_id: crate::MPL_TOKEN_METADATA_ID,
            accounts,
            data,
        };
        let mut account_infos = Vec::with_capacity(10 + 1 + remaining_accounts.len());
        account_infos.push(self.__program.clone());
        account_infos.push(self.metadata.clone());
        account_infos.push(self.master_edition.clone());
        account_infos.push(self.token_account.clone());
        account_infos.push(self.mint.clone());
        account_infos.push(self.update_authority.clone());
        account_infos.push(self.collection_metadata.clone());
        account_infos.push(self.token_program.clone());
        account_infos.push(self.system_program.clone());
        account_infos.push(self.sysvar_instructions.clone());
        if let Some(authorization_rules) = self.authorization_rules {
            account_infos.push(authorization_rules.clone());
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

/// Instruction builder for `Migrate` via CPI.
///
/// ### Accounts:
///
///   0. `[writable]` metadata
///   1. `[]` master_edition
///   2. `[writable]` token_account
///   3. `[]` mint
///   4. `[signer]` update_authority
///   5. `[]` collection_metadata
///   6. `[]` token_program
///   7. `[]` system_program
///   8. `[]` sysvar_instructions
///   9. `[optional]` authorization_rules
pub struct MigrateCpiBuilder<'a, 'b> {
    instruction: Box<MigrateCpiBuilderInstruction<'a, 'b>>,
}

impl<'a, 'b> MigrateCpiBuilder<'a, 'b> {
    pub fn new(program: &'b solana_program::account_info::AccountInfo<'a>) -> Self {
        let instruction = Box::new(MigrateCpiBuilderInstruction {
            __program: program,
            metadata: None,
            master_edition: None,
            token_account: None,
            mint: None,
            update_authority: None,
            collection_metadata: None,
            token_program: None,
            system_program: None,
            sysvar_instructions: None,
            authorization_rules: None,
            migrate_args: None,
            __remaining_accounts: Vec::new(),
        });
        Self { instruction }
    }
    /// Metadata account
    #[inline(always)]
    pub fn metadata(
        &mut self,
        metadata: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.metadata = Some(metadata);
        self
    }
    /// Master edition account
    #[inline(always)]
    pub fn master_edition(
        &mut self,
        master_edition: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.master_edition = Some(master_edition);
        self
    }
    /// Token account
    #[inline(always)]
    pub fn token_account(
        &mut self,
        token_account: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.token_account = Some(token_account);
        self
    }
    /// Mint account
    #[inline(always)]
    pub fn mint(&mut self, mint: &'b solana_program::account_info::AccountInfo<'a>) -> &mut Self {
        self.instruction.mint = Some(mint);
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
    /// Collection metadata account
    #[inline(always)]
    pub fn collection_metadata(
        &mut self,
        collection_metadata: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.collection_metadata = Some(collection_metadata);
        self
    }
    /// Token Program
    #[inline(always)]
    pub fn token_program(
        &mut self,
        token_program: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.token_program = Some(token_program);
        self
    }
    /// System program
    #[inline(always)]
    pub fn system_program(
        &mut self,
        system_program: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.system_program = Some(system_program);
        self
    }
    /// Instruction sysvar account
    #[inline(always)]
    pub fn sysvar_instructions(
        &mut self,
        sysvar_instructions: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.sysvar_instructions = Some(sysvar_instructions);
        self
    }
    /// `[optional account]`
    /// Token Authorization Rules account
    #[inline(always)]
    pub fn authorization_rules(
        &mut self,
        authorization_rules: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    ) -> &mut Self {
        self.instruction.authorization_rules = authorization_rules;
        self
    }
    #[inline(always)]
    pub fn migrate_args(&mut self, migrate_args: MigrateArgs) -> &mut Self {
        self.instruction.migrate_args = Some(migrate_args);
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
        let args = MigrateInstructionArgs {
            migrate_args: self
                .instruction
                .migrate_args
                .clone()
                .expect("migrate_args is not set"),
        };
        let instruction = MigrateCpi {
            __program: self.instruction.__program,

            metadata: self.instruction.metadata.expect("metadata is not set"),

            master_edition: self
                .instruction
                .master_edition
                .expect("master_edition is not set"),

            token_account: self
                .instruction
                .token_account
                .expect("token_account is not set"),

            mint: self.instruction.mint.expect("mint is not set"),

            update_authority: self
                .instruction
                .update_authority
                .expect("update_authority is not set"),

            collection_metadata: self
                .instruction
                .collection_metadata
                .expect("collection_metadata is not set"),

            token_program: self
                .instruction
                .token_program
                .expect("token_program is not set"),

            system_program: self
                .instruction
                .system_program
                .expect("system_program is not set"),

            sysvar_instructions: self
                .instruction
                .sysvar_instructions
                .expect("sysvar_instructions is not set"),

            authorization_rules: self.instruction.authorization_rules,
            __args: args,
        };
        instruction.invoke_signed_with_remaining_accounts(
            signers_seeds,
            &self.instruction.__remaining_accounts,
        )
    }
}

struct MigrateCpiBuilderInstruction<'a, 'b> {
    __program: &'b solana_program::account_info::AccountInfo<'a>,
    metadata: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    master_edition: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    token_account: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    mint: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    update_authority: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    collection_metadata: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    token_program: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    system_program: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    sysvar_instructions: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    authorization_rules: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    migrate_args: Option<MigrateArgs>,
    /// Additional instruction accounts `(AccountInfo, is_writable, is_signer)`.
    __remaining_accounts: Vec<(
        &'b solana_program::account_info::AccountInfo<'a>,
        bool,
        bool,
    )>,
}
