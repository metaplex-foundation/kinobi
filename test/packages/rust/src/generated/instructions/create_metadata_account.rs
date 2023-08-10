//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

use crate::generated::types::Data;
use borsh::BorshDeserialize;
use borsh::BorshSerialize;

/// Accounts.
pub struct CreateMetadataAccount {
    /// Metadata key (pda of ['metadata', program id, mint id])
    pub metadata: solana_program::pubkey::Pubkey,
    /// Mint of token asset
    pub mint: solana_program::pubkey::Pubkey,
    /// Mint authority
    pub mint_authority: solana_program::pubkey::Pubkey,
    /// payer
    pub payer: solana_program::pubkey::Pubkey,
    /// update authority info
    pub update_authority: solana_program::pubkey::Pubkey,
    /// System program
    pub system_program: solana_program::pubkey::Pubkey,
    /// Rent info
    pub rent: solana_program::pubkey::Pubkey,
}

impl CreateMetadataAccount {
    pub fn instruction(
        &self,
        args: CreateMetadataAccountInstructionArgs,
    ) -> solana_program::instruction::Instruction {
        solana_program::instruction::Instruction {
            program_id: crate::MPL_TOKEN_METADATA_ID,
            accounts: vec![
                solana_program::instruction::AccountMeta::new(self.metadata, false),
                solana_program::instruction::AccountMeta::new_readonly(self.mint, false),
                solana_program::instruction::AccountMeta::new_readonly(self.mint_authority, true),
                solana_program::instruction::AccountMeta::new(self.payer, true),
                solana_program::instruction::AccountMeta::new_readonly(
                    self.update_authority,
                    false,
                ),
                solana_program::instruction::AccountMeta::new_readonly(self.system_program, false),
                solana_program::instruction::AccountMeta::new_readonly(self.rent, false),
            ],
            data: args.try_to_vec().unwrap(),
        }
    }
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct CreateMetadataAccountInstructionArgs {
    discriminator: u8,
    pub data: Data,
    pub is_mutable: bool,
    pub metadata_bump: u8,
}

impl CreateMetadataAccountInstructionArgs {
    pub fn new(data: Data, is_mutable: bool, metadata_bump: u8) -> Self {
        Self {
            discriminator: 0,
            data,
            is_mutable,
            metadata_bump,
        }
    }
}

/// Instruction builder.
#[derive(Default)]
pub struct CreateMetadataAccountBuilder {
    metadata: Option<solana_program::pubkey::Pubkey>,
    mint: Option<solana_program::pubkey::Pubkey>,
    mint_authority: Option<solana_program::pubkey::Pubkey>,
    payer: Option<solana_program::pubkey::Pubkey>,
    update_authority: Option<solana_program::pubkey::Pubkey>,
    system_program: Option<solana_program::pubkey::Pubkey>,
    rent: Option<solana_program::pubkey::Pubkey>,
    data: Option<Data>,
    is_mutable: Option<bool>,
    metadata_bump: Option<u8>,
}

impl CreateMetadataAccountBuilder {
    pub fn new() -> Self {
        Self::default()
    }
    pub fn metadata(&mut self, metadata: solana_program::pubkey::Pubkey) -> &mut Self {
        self.metadata = Some(metadata);
        self
    }
    pub fn mint(&mut self, mint: solana_program::pubkey::Pubkey) -> &mut Self {
        self.mint = Some(mint);
        self
    }
    pub fn mint_authority(&mut self, mint_authority: solana_program::pubkey::Pubkey) -> &mut Self {
        self.mint_authority = Some(mint_authority);
        self
    }
    pub fn payer(&mut self, payer: solana_program::pubkey::Pubkey) -> &mut Self {
        self.payer = Some(payer);
        self
    }
    pub fn update_authority(
        &mut self,
        update_authority: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.update_authority = Some(update_authority);
        self
    }
    pub fn system_program(&mut self, system_program: solana_program::pubkey::Pubkey) -> &mut Self {
        self.system_program = Some(system_program);
        self
    }
    pub fn rent(&mut self, rent: solana_program::pubkey::Pubkey) -> &mut Self {
        self.rent = Some(rent);
        self
    }
    pub fn data(&mut self, data: Data) -> &mut Self {
        self.data = Some(data);
        self
    }
    pub fn is_mutable(&mut self, is_mutable: bool) -> &mut Self {
        self.is_mutable = Some(is_mutable);
        self
    }
    pub fn metadata_bump(&mut self, metadata_bump: u8) -> &mut Self {
        self.metadata_bump = Some(metadata_bump);
        self
    }
    #[allow(clippy::clone_on_copy)]
    pub fn build(&self) -> solana_program::instruction::Instruction {
        let accounts = CreateMetadataAccount {
            metadata: self.metadata.expect("metadata is not set"),

            mint: self.mint.expect("mint is not set"),

            mint_authority: self.mint_authority.expect("mint_authority is not set"),

            payer: self.payer.expect("payer is not set"),

            update_authority: self.update_authority.expect("update_authority is not set"),

            system_program: self.system_program.expect("system_program is not set"),

            rent: self.rent.expect("rent is not set"),
        };
        let args = CreateMetadataAccountInstructionArgs::new(
            self.data.clone().expect("data is not set"),
            self.is_mutable.clone().expect("is_mutable is not set"),
            self.metadata_bump
                .clone()
                .expect("metadata_bump is not set"),
        );
        accounts.instruction(args)
    }
}

/// `create_metadata_account` CPI instruction.
pub struct CreateMetadataAccountCpi<'a> {
    pub program: &'a solana_program::account_info::AccountInfo<'a>,
    /// Metadata key (pda of ['metadata', program id, mint id])
    pub metadata: &'a solana_program::account_info::AccountInfo<'a>,
    /// Mint of token asset
    pub mint: &'a solana_program::account_info::AccountInfo<'a>,
    /// Mint authority
    pub mint_authority: &'a solana_program::account_info::AccountInfo<'a>,
    /// payer
    pub payer: &'a solana_program::account_info::AccountInfo<'a>,
    /// update authority info
    pub update_authority: &'a solana_program::account_info::AccountInfo<'a>,
    /// System program
    pub system_program: &'a solana_program::account_info::AccountInfo<'a>,
    /// Rent info
    pub rent: &'a solana_program::account_info::AccountInfo<'a>,
    pub args: CreateMetadataAccountInstructionArgs,
}

impl<'a> CreateMetadataAccountCpi<'a> {
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
                solana_program::instruction::AccountMeta::new_readonly(*self.mint.key, false),
                solana_program::instruction::AccountMeta::new_readonly(
                    *self.mint_authority.key,
                    true,
                ),
                solana_program::instruction::AccountMeta::new(*self.payer.key, true),
                solana_program::instruction::AccountMeta::new_readonly(
                    *self.update_authority.key,
                    false,
                ),
                solana_program::instruction::AccountMeta::new_readonly(
                    *self.system_program.key,
                    false,
                ),
                solana_program::instruction::AccountMeta::new_readonly(*self.rent.key, false),
            ],
            data: self.args.try_to_vec().unwrap(),
        };
        let mut account_infos = Vec::with_capacity(7 + 1);
        account_infos.push(self.program.clone());
        account_infos.push(self.metadata.clone());
        account_infos.push(self.mint.clone());
        account_infos.push(self.mint_authority.clone());
        account_infos.push(self.payer.clone());
        account_infos.push(self.update_authority.clone());
        account_infos.push(self.system_program.clone());
        account_infos.push(self.rent.clone());

        if signers_seeds.is_empty() {
            solana_program::program::invoke(&instruction, &account_infos)
        } else {
            solana_program::program::invoke_signed(&instruction, &account_infos, signers_seeds)
        }
    }
}

/// `create_metadata_account` CPI instruction builder.
pub struct CreateMetadataAccountCpiBuilder<'a> {
    instruction: Box<CreateMetadataAccountCpiBuilderInstruction<'a>>,
}

impl<'a> CreateMetadataAccountCpiBuilder<'a> {
    pub fn new(program: &'a solana_program::account_info::AccountInfo<'a>) -> Self {
        let instruction = Box::new(CreateMetadataAccountCpiBuilderInstruction {
            program,
            metadata: None,
            mint: None,
            mint_authority: None,
            payer: None,
            update_authority: None,
            system_program: None,
            rent: None,
            data: None,
            is_mutable: None,
            metadata_bump: None,
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
    pub fn mint(&mut self, mint: &'a solana_program::account_info::AccountInfo<'a>) -> &mut Self {
        self.instruction.mint = Some(mint);
        self
    }
    pub fn mint_authority(
        &mut self,
        mint_authority: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.mint_authority = Some(mint_authority);
        self
    }
    pub fn payer(&mut self, payer: &'a solana_program::account_info::AccountInfo<'a>) -> &mut Self {
        self.instruction.payer = Some(payer);
        self
    }
    pub fn update_authority(
        &mut self,
        update_authority: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.update_authority = Some(update_authority);
        self
    }
    pub fn system_program(
        &mut self,
        system_program: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.system_program = Some(system_program);
        self
    }
    pub fn rent(&mut self, rent: &'a solana_program::account_info::AccountInfo<'a>) -> &mut Self {
        self.instruction.rent = Some(rent);
        self
    }
    pub fn data(&mut self, data: Data) -> &mut Self {
        self.instruction.data = Some(data);
        self
    }
    pub fn is_mutable(&mut self, is_mutable: bool) -> &mut Self {
        self.instruction.is_mutable = Some(is_mutable);
        self
    }
    pub fn metadata_bump(&mut self, metadata_bump: u8) -> &mut Self {
        self.instruction.metadata_bump = Some(metadata_bump);
        self
    }
    #[allow(clippy::clone_on_copy)]
    pub fn build(&self) -> CreateMetadataAccountCpi<'a> {
        CreateMetadataAccountCpi {
            program: self.instruction.program,

            metadata: self.instruction.metadata.expect("metadata is not set"),

            mint: self.instruction.mint.expect("mint is not set"),

            mint_authority: self
                .instruction
                .mint_authority
                .expect("mint_authority is not set"),

            payer: self.instruction.payer.expect("payer is not set"),

            update_authority: self
                .instruction
                .update_authority
                .expect("update_authority is not set"),

            system_program: self
                .instruction
                .system_program
                .expect("system_program is not set"),

            rent: self.instruction.rent.expect("rent is not set"),
            args: CreateMetadataAccountInstructionArgs::new(
                self.instruction.data.clone().expect("data is not set"),
                self.instruction
                    .is_mutable
                    .clone()
                    .expect("is_mutable is not set"),
                self.instruction
                    .metadata_bump
                    .clone()
                    .expect("metadata_bump is not set"),
            ),
        }
    }
}

struct CreateMetadataAccountCpiBuilderInstruction<'a> {
    program: &'a solana_program::account_info::AccountInfo<'a>,
    metadata: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    mint: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    mint_authority: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    payer: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    update_authority: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    system_program: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    rent: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    data: Option<Data>,
    is_mutable: Option<bool>,
    metadata_bump: Option<u8>,
}