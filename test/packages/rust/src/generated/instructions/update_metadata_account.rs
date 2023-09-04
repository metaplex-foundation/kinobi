//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

use crate::generated::types::Creator;
use borsh::BorshDeserialize;
use borsh::BorshSerialize;
use solana_program::pubkey::Pubkey;

/// Accounts.
pub struct UpdateMetadataAccount {
    /// Metadata account
    pub metadata: solana_program::pubkey::Pubkey,
    /// Update authority key
    pub update_authority: solana_program::pubkey::Pubkey,
    /// Additional instruction accounts.
    pub __remaining_accounts: Vec<super::RemainingAccount>,
}

impl UpdateMetadataAccount {
    #[allow(clippy::vec_init_then_push)]
    pub fn instruction(
        &self,
        args: UpdateMetadataAccountInstructionArgs,
    ) -> solana_program::instruction::Instruction {
        let mut accounts = Vec::with_capacity(2 + self.__remaining_accounts.len());
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.metadata,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.update_authority,
            true,
        ));
        self.__remaining_accounts
            .iter()
            .for_each(|remaining_account| accounts.push(remaining_account.to_account_meta()));
        let mut data = UpdateMetadataAccountInstructionData::new()
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

#[derive(BorshDeserialize, BorshSerialize)]
struct UpdateMetadataAccountInstructionData {
    discriminator: u8,
}

impl UpdateMetadataAccountInstructionData {
    fn new() -> Self {
        Self { discriminator: 1 }
    }
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct UpdateMetadataAccountInstructionArgs {
    pub data: Option<UpdateMetadataAccountInstructionDataData>,
    pub update_authority_arg: Option<Pubkey>,
    pub primary_sale_happened: Option<bool>,
}

#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, Eq, PartialEq)]
pub struct UpdateMetadataAccountInstructionDataData {
    pub name: String,
    pub symbol: String,
    pub uri: String,
    pub seller_fee_basis_points: u16,
    pub creators: Option<Vec<Creator>>,
}

/// Instruction builder.
#[derive(Default)]
pub struct UpdateMetadataAccountBuilder {
    metadata: Option<solana_program::pubkey::Pubkey>,
    update_authority: Option<solana_program::pubkey::Pubkey>,
    data: Option<UpdateMetadataAccountInstructionDataData>,
    update_authority_arg: Option<Pubkey>,
    primary_sale_happened: Option<bool>,
    __remaining_accounts: Vec<super::RemainingAccount>,
}

impl UpdateMetadataAccountBuilder {
    pub fn new() -> Self {
        Self::default()
    }
    /// Metadata account
    #[inline(always)]
    pub fn metadata(&mut self, metadata: solana_program::pubkey::Pubkey) -> &mut Self {
        self.metadata = Some(metadata);
        self
    }
    /// Update authority key
    #[inline(always)]
    pub fn update_authority(
        &mut self,
        update_authority: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.update_authority = Some(update_authority);
        self
    }
    /// `[optional argument]`
    #[inline(always)]
    pub fn data(&mut self, data: UpdateMetadataAccountInstructionDataData) -> &mut Self {
        self.data = Some(data);
        self
    }
    /// `[optional argument]`
    #[inline(always)]
    pub fn update_authority_arg(&mut self, update_authority_arg: Pubkey) -> &mut Self {
        self.update_authority_arg = Some(update_authority_arg);
        self
    }
    /// `[optional argument]`
    #[inline(always)]
    pub fn primary_sale_happened(&mut self, primary_sale_happened: bool) -> &mut Self {
        self.primary_sale_happened = Some(primary_sale_happened);
        self
    }
    #[inline(always)]
    pub fn remaining_account(&mut self, account: super::RemainingAccount) -> &mut Self {
        self.__remaining_accounts.push(account);
        self
    }
    #[inline(always)]
    pub fn remaining_accounts(&mut self, accounts: &[super::RemainingAccount]) -> &mut Self {
        self.__remaining_accounts.extend_from_slice(accounts);
        self
    }
    #[allow(clippy::clone_on_copy)]
    pub fn build(&self) -> solana_program::instruction::Instruction {
        let accounts = UpdateMetadataAccount {
            metadata: self.metadata.expect("metadata is not set"),
            update_authority: self.update_authority.expect("update_authority is not set"),
            __remaining_accounts: self.__remaining_accounts.clone(),
        };
        let args = UpdateMetadataAccountInstructionArgs {
            data: self.data.clone(),
            update_authority_arg: self.update_authority_arg.clone(),
            primary_sale_happened: self.primary_sale_happened.clone(),
        };

        accounts.instruction(args)
    }
}

/// `update_metadata_account` CPI instruction.
pub struct UpdateMetadataAccountCpi<'a> {
    /// The program to invoke.
    pub __program: &'a solana_program::account_info::AccountInfo<'a>,
    /// Metadata account
    pub metadata: &'a solana_program::account_info::AccountInfo<'a>,
    /// Update authority key
    pub update_authority: &'a solana_program::account_info::AccountInfo<'a>,
    /// The arguments for the instruction.
    pub __args: UpdateMetadataAccountInstructionArgs,
    /// Additional instruction accounts.
    pub __remaining_accounts: Vec<super::RemainingAccountInfo<'a>>,
}

impl<'a> UpdateMetadataAccountCpi<'a> {
    pub fn invoke(&self) -> solana_program::entrypoint::ProgramResult {
        self.invoke_signed(&[])
    }
    #[allow(clippy::clone_on_copy)]
    #[allow(clippy::vec_init_then_push)]
    pub fn invoke_signed(
        &self,
        signers_seeds: &[&[&[u8]]],
    ) -> solana_program::entrypoint::ProgramResult {
        let mut accounts = Vec::with_capacity(2 + self.__remaining_accounts.len());
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.metadata.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.update_authority.key,
            true,
        ));
        self.__remaining_accounts
            .iter()
            .for_each(|remaining_account| accounts.push(remaining_account.to_account_meta()));
        let mut data = UpdateMetadataAccountInstructionData::new()
            .try_to_vec()
            .unwrap();
        let mut args = self.__args.try_to_vec().unwrap();
        data.append(&mut args);

        let instruction = solana_program::instruction::Instruction {
            program_id: crate::MPL_TOKEN_METADATA_ID,
            accounts,
            data,
        };
        let mut account_infos = Vec::with_capacity(2 + 1);
        account_infos.push(self.__program.clone());
        account_infos.push(self.metadata.clone());
        account_infos.push(self.update_authority.clone());

        if signers_seeds.is_empty() {
            solana_program::program::invoke(&instruction, &account_infos)
        } else {
            solana_program::program::invoke_signed(&instruction, &account_infos, signers_seeds)
        }
    }
}

/// `update_metadata_account` CPI instruction builder.
pub struct UpdateMetadataAccountCpiBuilder<'a> {
    instruction: Box<UpdateMetadataAccountCpiBuilderInstruction<'a>>,
}

impl<'a> UpdateMetadataAccountCpiBuilder<'a> {
    pub fn new(program: &'a solana_program::account_info::AccountInfo<'a>) -> Self {
        let instruction = Box::new(UpdateMetadataAccountCpiBuilderInstruction {
            __program: program,
            metadata: None,
            update_authority: None,
            data: None,
            update_authority_arg: None,
            primary_sale_happened: None,
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
    /// Update authority key
    #[inline(always)]
    pub fn update_authority(
        &mut self,
        update_authority: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.update_authority = Some(update_authority);
        self
    }
    /// `[optional argument]`
    #[inline(always)]
    pub fn data(&mut self, data: UpdateMetadataAccountInstructionDataData) -> &mut Self {
        self.instruction.data = Some(data);
        self
    }
    /// `[optional argument]`
    #[inline(always)]
    pub fn update_authority_arg(&mut self, update_authority_arg: Pubkey) -> &mut Self {
        self.instruction.update_authority_arg = Some(update_authority_arg);
        self
    }
    /// `[optional argument]`
    #[inline(always)]
    pub fn primary_sale_happened(&mut self, primary_sale_happened: bool) -> &mut Self {
        self.instruction.primary_sale_happened = Some(primary_sale_happened);
        self
    }
    #[inline(always)]
    pub fn remaining_account(&mut self, account: super::RemainingAccountInfo<'a>) -> &mut Self {
        self.instruction.__remaining_accounts.push(account);
        self
    }
    #[inline(always)]
    pub fn remaining_accounts(
        &mut self,
        accounts: &[super::RemainingAccountInfo<'a>],
    ) -> &mut Self {
        self.instruction
            .__remaining_accounts
            .extend_from_slice(accounts);
        self
    }
    #[allow(clippy::clone_on_copy)]
    pub fn build(&self) -> UpdateMetadataAccountCpi<'a> {
        let args = UpdateMetadataAccountInstructionArgs {
            data: self.instruction.data.clone(),
            update_authority_arg: self.instruction.update_authority_arg.clone(),
            primary_sale_happened: self.instruction.primary_sale_happened.clone(),
        };

        UpdateMetadataAccountCpi {
            __program: self.instruction.__program,

            metadata: self.instruction.metadata.expect("metadata is not set"),

            update_authority: self
                .instruction
                .update_authority
                .expect("update_authority is not set"),
            __args: args,
            __remaining_accounts: self.instruction.__remaining_accounts.clone(),
        }
    }
}

struct UpdateMetadataAccountCpiBuilderInstruction<'a> {
    __program: &'a solana_program::account_info::AccountInfo<'a>,
    metadata: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    update_authority: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    data: Option<UpdateMetadataAccountInstructionDataData>,
    update_authority_arg: Option<Pubkey>,
    primary_sale_happened: Option<bool>,
    __remaining_accounts: Vec<super::RemainingAccountInfo<'a>>,
}
