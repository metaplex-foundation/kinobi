//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

use crate::generated::types::DataV2;
use borsh::BorshDeserialize;
use borsh::BorshSerialize;
use solana_program::pubkey::Pubkey;

/// Accounts.
pub struct UpdateMetadataAccountV2 {
    /// Metadata account
    pub metadata: solana_program::pubkey::Pubkey,
    /// Update authority key
    pub update_authority: solana_program::pubkey::Pubkey,
    /// Additional instruction accounts.
    pub __remaining_accounts: Vec<(solana_program::pubkey::Pubkey, super::AccountType)>,
}

impl UpdateMetadataAccountV2 {
    #[allow(clippy::vec_init_then_push)]
    pub fn instruction(
        &self,
        args: UpdateMetadataAccountV2InstructionArgs,
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
            .for_each(|remaining_account| {
                accounts.push(remaining_account.1.to_account_meta(remaining_account.0))
            });
        let mut data = UpdateMetadataAccountV2InstructionData::new()
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
struct UpdateMetadataAccountV2InstructionData {
    discriminator: u8,
}

impl UpdateMetadataAccountV2InstructionData {
    fn new() -> Self {
        Self { discriminator: 15 }
    }
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct UpdateMetadataAccountV2InstructionArgs {
    pub data: Option<DataV2>,
    pub update_authority_arg: Option<Pubkey>,
    pub primary_sale_happened: Option<bool>,
    pub is_mutable: Option<bool>,
}

/// Instruction builder.
#[derive(Default)]
pub struct UpdateMetadataAccountV2Builder {
    metadata: Option<solana_program::pubkey::Pubkey>,
    update_authority: Option<solana_program::pubkey::Pubkey>,
    data: Option<DataV2>,
    update_authority_arg: Option<Pubkey>,
    primary_sale_happened: Option<bool>,
    is_mutable: Option<bool>,
    __remaining_accounts: Vec<(solana_program::pubkey::Pubkey, super::AccountType)>,
}

impl UpdateMetadataAccountV2Builder {
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
    pub fn data(&mut self, data: DataV2) -> &mut Self {
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
    /// `[optional argument]`
    #[inline(always)]
    pub fn is_mutable(&mut self, is_mutable: bool) -> &mut Self {
        self.is_mutable = Some(is_mutable);
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
        let accounts = UpdateMetadataAccountV2 {
            metadata: self.metadata.expect("metadata is not set"),
            update_authority: self.update_authority.expect("update_authority is not set"),
            __remaining_accounts: self.__remaining_accounts.clone(),
        };
        let args = UpdateMetadataAccountV2InstructionArgs {
            data: self.data.clone(),
            update_authority_arg: self.update_authority_arg.clone(),
            primary_sale_happened: self.primary_sale_happened.clone(),
            is_mutable: self.is_mutable.clone(),
        };

        accounts.instruction(args)
    }
}

/// `update_metadata_account_v2` CPI instruction.
pub struct UpdateMetadataAccountV2Cpi<'a> {
    /// The program to invoke.
    pub __program: &'a solana_program::account_info::AccountInfo<'a>,
    /// Metadata account
    pub metadata: &'a solana_program::account_info::AccountInfo<'a>,
    /// Update authority key
    pub update_authority: &'a solana_program::account_info::AccountInfo<'a>,
    /// The arguments for the instruction.
    pub __args: UpdateMetadataAccountV2InstructionArgs,
    /// Additional instruction accounts.
    pub __remaining_accounts: Vec<(
        &'a solana_program::account_info::AccountInfo<'a>,
        super::AccountType,
    )>,
}

impl<'a> UpdateMetadataAccountV2Cpi<'a> {
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
            .for_each(|remaining_account| {
                accounts.push(
                    remaining_account
                        .1
                        .to_account_meta(*remaining_account.0.key),
                )
            });
        let mut data = UpdateMetadataAccountV2InstructionData::new()
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

/// `update_metadata_account_v2` CPI instruction builder.
pub struct UpdateMetadataAccountV2CpiBuilder<'a> {
    instruction: Box<UpdateMetadataAccountV2CpiBuilderInstruction<'a>>,
}

impl<'a> UpdateMetadataAccountV2CpiBuilder<'a> {
    pub fn new(program: &'a solana_program::account_info::AccountInfo<'a>) -> Self {
        let instruction = Box::new(UpdateMetadataAccountV2CpiBuilderInstruction {
            __program: program,
            metadata: None,
            update_authority: None,
            data: None,
            update_authority_arg: None,
            primary_sale_happened: None,
            is_mutable: None,
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
    pub fn data(&mut self, data: DataV2) -> &mut Self {
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
    /// `[optional argument]`
    #[inline(always)]
    pub fn is_mutable(&mut self, is_mutable: bool) -> &mut Self {
        self.instruction.is_mutable = Some(is_mutable);
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
    pub fn build(&self) -> UpdateMetadataAccountV2Cpi<'a> {
        let args = UpdateMetadataAccountV2InstructionArgs {
            data: self.instruction.data.clone(),
            update_authority_arg: self.instruction.update_authority_arg.clone(),
            primary_sale_happened: self.instruction.primary_sale_happened.clone(),
            is_mutable: self.instruction.is_mutable.clone(),
        };

        UpdateMetadataAccountV2Cpi {
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

struct UpdateMetadataAccountV2CpiBuilderInstruction<'a> {
    __program: &'a solana_program::account_info::AccountInfo<'a>,
    metadata: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    update_authority: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    data: Option<DataV2>,
    update_authority_arg: Option<Pubkey>,
    primary_sale_happened: Option<bool>,
    is_mutable: Option<bool>,
    __remaining_accounts: Vec<(
        &'a solana_program::account_info::AccountInfo<'a>,
        super::AccountType,
    )>,
}
