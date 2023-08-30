//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

use crate::generated::types::VerifyArgs;
use borsh::BorshDeserialize;
use borsh::BorshSerialize;

/// Accounts.
pub struct Verify {
    /// Metadata account
    pub metadata: solana_program::pubkey::Pubkey,
    /// Collection Update authority
    pub collection_authority: solana_program::pubkey::Pubkey,
    /// payer
    pub payer: solana_program::pubkey::Pubkey,
    /// Token Authorization Rules account
    pub authorization_rules: Option<solana_program::pubkey::Pubkey>,
    /// Token Authorization Rules Program
    pub authorization_rules_program: Option<solana_program::pubkey::Pubkey>,
    /// Additional instruction accounts.
    pub __remaining_accounts: Vec<(solana_program::pubkey::Pubkey, super::AccountType)>,
}

impl Verify {
    #[allow(clippy::vec_init_then_push)]
    pub fn instruction(
        &self,
        args: VerifyInstructionArgs,
    ) -> solana_program::instruction::Instruction {
        let mut accounts = Vec::with_capacity(5 + self.__remaining_accounts.len());
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.metadata,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.collection_authority,
            true,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.payer, true,
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
        if let Some(authorization_rules_program) = self.authorization_rules_program {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                authorization_rules_program,
                false,
            ));
        } else {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                crate::MPL_TOKEN_METADATA_ID,
                false,
            ));
        }
        self.__remaining_accounts
            .iter()
            .for_each(|remaining_account| {
                accounts.push(remaining_account.1.to_account_meta(remaining_account.0))
            });
        let mut data = VerifyInstructionData::new().try_to_vec().unwrap();
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
struct VerifyInstructionData {
    discriminator: u8,
}

impl VerifyInstructionData {
    fn new() -> Self {
        Self { discriminator: 47 }
    }
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct VerifyInstructionArgs {
    pub verify_args: VerifyArgs,
}

/// Instruction builder.
#[derive(Default)]
pub struct VerifyBuilder {
    metadata: Option<solana_program::pubkey::Pubkey>,
    collection_authority: Option<solana_program::pubkey::Pubkey>,
    payer: Option<solana_program::pubkey::Pubkey>,
    authorization_rules: Option<solana_program::pubkey::Pubkey>,
    authorization_rules_program: Option<solana_program::pubkey::Pubkey>,
    verify_args: Option<VerifyArgs>,
    __remaining_accounts: Vec<(solana_program::pubkey::Pubkey, super::AccountType)>,
}

impl VerifyBuilder {
    pub fn new() -> Self {
        Self::default()
    }
    /// Metadata account
    #[inline(always)]
    pub fn metadata(&mut self, metadata: solana_program::pubkey::Pubkey) -> &mut Self {
        self.metadata = Some(metadata);
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
    /// payer
    #[inline(always)]
    pub fn payer(&mut self, payer: solana_program::pubkey::Pubkey) -> &mut Self {
        self.payer = Some(payer);
        self
    }
    /// `[optional account]`
    /// Token Authorization Rules account
    #[inline(always)]
    pub fn authorization_rules(
        &mut self,
        authorization_rules: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.authorization_rules = Some(authorization_rules);
        self
    }
    /// `[optional account]`
    /// Token Authorization Rules Program
    #[inline(always)]
    pub fn authorization_rules_program(
        &mut self,
        authorization_rules_program: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.authorization_rules_program = Some(authorization_rules_program);
        self
    }
    #[inline(always)]
    pub fn verify_args(&mut self, verify_args: VerifyArgs) -> &mut Self {
        self.verify_args = Some(verify_args);
        self
    }
    #[inline(always)]
    pub fn remaining_account(
        &mut self,
        account: solana_program::pubkey::Pubkey,
        as_type: super::AccountType,
    ) -> &mut Self {
        self.__remaining_accounts.push((account, as_type));
        self
    }
    #[allow(clippy::clone_on_copy)]
    pub fn build(&self) -> solana_program::instruction::Instruction {
        let accounts = Verify {
            metadata: self.metadata.expect("metadata is not set"),
            collection_authority: self
                .collection_authority
                .expect("collection_authority is not set"),
            payer: self.payer.expect("payer is not set"),
            authorization_rules: self.authorization_rules,
            authorization_rules_program: self.authorization_rules_program,
            __remaining_accounts: self.__remaining_accounts.clone(),
        };
        let args = VerifyInstructionArgs {
            verify_args: self.verify_args.clone().expect("verify_args is not set"),
        };

        accounts.instruction(args)
    }
}

/// `verify` CPI instruction.
pub struct VerifyCpi<'a> {
    /// The program to invoke.
    pub __program: &'a solana_program::account_info::AccountInfo<'a>,
    /// Metadata account
    pub metadata: &'a solana_program::account_info::AccountInfo<'a>,
    /// Collection Update authority
    pub collection_authority: &'a solana_program::account_info::AccountInfo<'a>,
    /// payer
    pub payer: &'a solana_program::account_info::AccountInfo<'a>,
    /// Token Authorization Rules account
    pub authorization_rules: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    /// Token Authorization Rules Program
    pub authorization_rules_program: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    /// The arguments for the instruction.
    pub __args: VerifyInstructionArgs,
    /// Additional instruction accounts.
    pub __remaining_accounts: Vec<(
        &'a solana_program::account_info::AccountInfo<'a>,
        super::AccountType,
    )>,
}

impl<'a> VerifyCpi<'a> {
    pub fn invoke(&self) -> solana_program::entrypoint::ProgramResult {
        self.invoke_signed(&[])
    }
    #[allow(clippy::clone_on_copy)]
    #[allow(clippy::vec_init_then_push)]
    pub fn invoke_signed(
        &self,
        signers_seeds: &[&[&[u8]]],
    ) -> solana_program::entrypoint::ProgramResult {
        let mut accounts = Vec::with_capacity(5 + self.__remaining_accounts.len());
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.metadata.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.collection_authority.key,
            true,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.payer.key,
            true,
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
        if let Some(authorization_rules_program) = self.authorization_rules_program {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                *authorization_rules_program.key,
                false,
            ));
        } else {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                crate::MPL_TOKEN_METADATA_ID,
                false,
            ));
        }
        self.__remaining_accounts
            .iter()
            .for_each(|remaining_account| {
                accounts.push(
                    remaining_account
                        .1
                        .to_account_meta(*remaining_account.0.key),
                )
            });
        let mut data = VerifyInstructionData::new().try_to_vec().unwrap();
        let mut args = self.__args.try_to_vec().unwrap();
        data.append(&mut args);

        let instruction = solana_program::instruction::Instruction {
            program_id: crate::MPL_TOKEN_METADATA_ID,
            accounts,
            data,
        };
        let mut account_infos = Vec::with_capacity(5 + 1);
        account_infos.push(self.__program.clone());
        account_infos.push(self.metadata.clone());
        account_infos.push(self.collection_authority.clone());
        account_infos.push(self.payer.clone());
        if let Some(authorization_rules) = self.authorization_rules {
            account_infos.push(authorization_rules.clone());
        }
        if let Some(authorization_rules_program) = self.authorization_rules_program {
            account_infos.push(authorization_rules_program.clone());
        }

        if signers_seeds.is_empty() {
            solana_program::program::invoke(&instruction, &account_infos)
        } else {
            solana_program::program::invoke_signed(&instruction, &account_infos, signers_seeds)
        }
    }
}

/// `verify` CPI instruction builder.
pub struct VerifyCpiBuilder<'a> {
    instruction: Box<VerifyCpiBuilderInstruction<'a>>,
}

impl<'a> VerifyCpiBuilder<'a> {
    pub fn new(program: &'a solana_program::account_info::AccountInfo<'a>) -> Self {
        let instruction = Box::new(VerifyCpiBuilderInstruction {
            __program: program,
            metadata: None,
            collection_authority: None,
            payer: None,
            authorization_rules: None,
            authorization_rules_program: None,
            verify_args: None,
            __remaining_accounts: Vec::new(),
        });
        Self { instruction }
    }
    /// Metadata account
    #[inline(always)]
    pub fn metadata(
        &mut self,
        metadata: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.metadata = Some(metadata);
        self
    }
    /// Collection Update authority
    #[inline(always)]
    pub fn collection_authority(
        &mut self,
        collection_authority: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.collection_authority = Some(collection_authority);
        self
    }
    /// payer
    #[inline(always)]
    pub fn payer(&mut self, payer: &'a solana_program::account_info::AccountInfo<'a>) -> &mut Self {
        self.instruction.payer = Some(payer);
        self
    }
    /// `[optional account]`
    /// Token Authorization Rules account
    #[inline(always)]
    pub fn authorization_rules(
        &mut self,
        authorization_rules: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.authorization_rules = Some(authorization_rules);
        self
    }
    /// `[optional account]`
    /// Token Authorization Rules Program
    #[inline(always)]
    pub fn authorization_rules_program(
        &mut self,
        authorization_rules_program: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.authorization_rules_program = Some(authorization_rules_program);
        self
    }
    #[inline(always)]
    pub fn verify_args(&mut self, verify_args: VerifyArgs) -> &mut Self {
        self.instruction.verify_args = Some(verify_args);
        self
    }
    #[inline(always)]
    pub fn remaining_account(
        &mut self,
        account: &'a solana_program::account_info::AccountInfo<'a>,
        as_type: super::AccountType,
    ) -> &mut Self {
        self.instruction
            .__remaining_accounts
            .push((account, as_type));
        self
    }
    #[allow(clippy::clone_on_copy)]
    pub fn build(&self) -> VerifyCpi<'a> {
        let args = VerifyInstructionArgs {
            verify_args: self
                .instruction
                .verify_args
                .clone()
                .expect("verify_args is not set"),
        };

        VerifyCpi {
            __program: self.instruction.__program,

            metadata: self.instruction.metadata.expect("metadata is not set"),

            collection_authority: self
                .instruction
                .collection_authority
                .expect("collection_authority is not set"),

            payer: self.instruction.payer.expect("payer is not set"),

            authorization_rules: self.instruction.authorization_rules,

            authorization_rules_program: self.instruction.authorization_rules_program,
            __args: args,
            __remaining_accounts: self.instruction.__remaining_accounts.clone(),
        }
    }
}

struct VerifyCpiBuilderInstruction<'a> {
    __program: &'a solana_program::account_info::AccountInfo<'a>,
    metadata: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    collection_authority: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    payer: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    authorization_rules: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    authorization_rules_program: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    verify_args: Option<VerifyArgs>,
    __remaining_accounts: Vec<(
        &'a solana_program::account_info::AccountInfo<'a>,
        super::AccountType,
    )>,
}
