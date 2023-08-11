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
}

impl UpdateMetadataAccount {
    pub fn instruction(
        &self,
        args: UpdateMetadataAccountInstructionArgs,
    ) -> solana_program::instruction::Instruction {
        solana_program::instruction::Instruction {
            program_id: crate::MPL_TOKEN_METADATA_ID,
            accounts: vec![
                solana_program::instruction::AccountMeta::new(self.metadata, false),
                solana_program::instruction::AccountMeta::new_readonly(self.update_authority, true),
            ],
            data: args.try_to_vec().unwrap(),
        }
    }
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct UpdateMetadataAccountInstructionArgs {
    discriminator: u8,
    pub data: Option<UpdateMetadataAccountInstructionDataData>,
    pub update_authority_arg: Option<Pubkey>,
    pub primary_sale_happened: Option<bool>,
}

pub struct UpdateMetadataAccountInstructionDataData {
    pub name: String,
    pub symbol: String,
    pub uri: String,
    pub seller_fee_basis_points: u16,
    pub creators: Option<Vec<Creator>>,
}

impl UpdateMetadataAccountInstructionArgs {
    pub fn new(
        data: Option<UpdateMetadataAccountInstructionDataData>,
        update_authority_arg: Option<Pubkey>,
        primary_sale_happened: Option<bool>,
    ) -> Self {
        Self {
            discriminator: 1,
            data,
            update_authority_arg,
            primary_sale_happened,
        }
    }
}

/// Instruction builder.
#[derive(Default)]
pub struct UpdateMetadataAccountBuilder {
    metadata: Option<solana_program::pubkey::Pubkey>,
    update_authority: Option<solana_program::pubkey::Pubkey>,
    data: Option<UpdateMetadataAccountInstructionDataData>,
    update_authority_arg: Option<Pubkey>,
    primary_sale_happened: Option<bool>,
}

impl UpdateMetadataAccountBuilder {
    pub fn new() -> Self {
        Self::default()
    }
    pub fn metadata(&mut self, metadata: solana_program::pubkey::Pubkey) -> &mut Self {
        self.metadata = Some(metadata);
        self
    }
    pub fn update_authority(
        &mut self,
        update_authority: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.update_authority = Some(update_authority);
        self
    }
    pub fn data(&mut self, data: UpdateMetadataAccountInstructionDataData) -> &mut Self {
        self.data = Some(data);
        self
    }
    pub fn update_authority_arg(&mut self, update_authority_arg: Pubkey) -> &mut Self {
        self.update_authority_arg = Some(update_authority_arg);
        self
    }
    pub fn primary_sale_happened(&mut self, primary_sale_happened: bool) -> &mut Self {
        self.primary_sale_happened = Some(primary_sale_happened);
        self
    }
    #[allow(clippy::clone_on_copy)]
    pub fn build(&self) -> solana_program::instruction::Instruction {
        let accounts = UpdateMetadataAccount {
            metadata: self.metadata.expect("metadata is not set"),

            update_authority: self.update_authority.expect("update_authority is not set"),
        };
        let args = UpdateMetadataAccountInstructionArgs::new(
            self.data.clone(),
            self.update_authority_arg.clone(),
            self.primary_sale_happened.clone(),
        );
        accounts.instruction(args)
    }
}

/// `update_metadata_account` CPI instruction.
pub struct UpdateMetadataAccountCpi<'a> {
    pub program: &'a solana_program::account_info::AccountInfo<'a>,
    /// Metadata account
    pub metadata: &'a solana_program::account_info::AccountInfo<'a>,
    /// Update authority key
    pub update_authority: &'a solana_program::account_info::AccountInfo<'a>,
    pub args: UpdateMetadataAccountInstructionArgs,
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
        let instruction = solana_program::instruction::Instruction {
            program_id: crate::MPL_TOKEN_METADATA_ID,
            accounts: vec![
                solana_program::instruction::AccountMeta::new(*self.metadata.key, false),
                solana_program::instruction::AccountMeta::new_readonly(
                    *self.update_authority.key,
                    true,
                ),
            ],
            data: self.args.try_to_vec().unwrap(),
        };
        let mut account_infos = Vec::with_capacity(2 + 1);
        account_infos.push(self.program.clone());
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
            program,
            metadata: None,
            update_authority: None,
            data: None,
            update_authority_arg: None,
            primary_sale_happened: None,
        });
        Self { instruction }
    }
    pub fn metadata(
        &mut self,
        metadata: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.metadata = Some(metadata);
        self
    }
    pub fn update_authority(
        &mut self,
        update_authority: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.update_authority = Some(update_authority);
        self
    }
    pub fn data(&mut self, data: UpdateMetadataAccountInstructionDataData) -> &mut Self {
        self.instruction.data = Some(data);
        self
    }
    pub fn update_authority_arg(&mut self, update_authority_arg: Pubkey) -> &mut Self {
        self.instruction.update_authority_arg = Some(update_authority_arg);
        self
    }
    pub fn primary_sale_happened(&mut self, primary_sale_happened: bool) -> &mut Self {
        self.instruction.primary_sale_happened = Some(primary_sale_happened);
        self
    }
    #[allow(clippy::clone_on_copy)]
    pub fn build(&self) -> UpdateMetadataAccountCpi<'a> {
        UpdateMetadataAccountCpi {
            program: self.instruction.program,

            metadata: self.instruction.metadata.expect("metadata is not set"),

            update_authority: self
                .instruction
                .update_authority
                .expect("update_authority is not set"),
            args: UpdateMetadataAccountInstructionArgs::new(
                self.instruction.data.clone(),
                self.instruction.update_authority_arg.clone(),
                self.instruction.primary_sale_happened.clone(),
            ),
        }
    }
}

struct UpdateMetadataAccountCpiBuilderInstruction<'a> {
    program: &'a solana_program::account_info::AccountInfo<'a>,
    metadata: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    update_authority: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    data: Option<UpdateMetadataAccountInstructionDataData>,
    update_authority_arg: Option<Pubkey>,
    primary_sale_happened: Option<bool>,
}
