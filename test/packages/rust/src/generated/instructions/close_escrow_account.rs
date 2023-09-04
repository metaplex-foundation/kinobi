//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

use borsh::BorshDeserialize;
use borsh::BorshSerialize;

/// Accounts.
pub struct CloseEscrowAccount {
    /// Escrow account
    pub escrow: solana_program::pubkey::Pubkey,
    /// Metadata account
    pub metadata: solana_program::pubkey::Pubkey,
    /// Mint account
    pub mint: solana_program::pubkey::Pubkey,
    /// Token account
    pub token_account: solana_program::pubkey::Pubkey,
    /// Edition account
    pub edition: solana_program::pubkey::Pubkey,
    /// Wallet paying for the transaction and new account
    pub payer: solana_program::pubkey::Pubkey,
    /// System program
    pub system_program: solana_program::pubkey::Pubkey,
    /// Instructions sysvar account
    pub sysvar_instructions: solana_program::pubkey::Pubkey,
    /// Additional instruction accounts.
    pub __remaining_accounts: Vec<super::InstructionAccount>,
}

impl CloseEscrowAccount {
    #[allow(clippy::vec_init_then_push)]
    pub fn instruction(&self) -> solana_program::instruction::Instruction {
        let mut accounts = Vec::with_capacity(8 + self.__remaining_accounts.len());
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.escrow,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.metadata,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.mint, false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.token_account,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.edition,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.payer, true,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.system_program,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.sysvar_instructions,
            false,
        ));
        self.__remaining_accounts
            .iter()
            .for_each(|remaining_account| accounts.push(remaining_account.to_account_meta()));
        let data = CloseEscrowAccountInstructionData::new()
            .try_to_vec()
            .unwrap();

        solana_program::instruction::Instruction {
            program_id: crate::MPL_TOKEN_METADATA_ID,
            accounts,
            data,
        }
    }
}

#[derive(BorshDeserialize, BorshSerialize)]
struct CloseEscrowAccountInstructionData {
    discriminator: u8,
}

impl CloseEscrowAccountInstructionData {
    fn new() -> Self {
        Self { discriminator: 39 }
    }
}

/// Instruction builder.
#[derive(Default)]
pub struct CloseEscrowAccountBuilder {
    escrow: Option<solana_program::pubkey::Pubkey>,
    metadata: Option<solana_program::pubkey::Pubkey>,
    mint: Option<solana_program::pubkey::Pubkey>,
    token_account: Option<solana_program::pubkey::Pubkey>,
    edition: Option<solana_program::pubkey::Pubkey>,
    payer: Option<solana_program::pubkey::Pubkey>,
    system_program: Option<solana_program::pubkey::Pubkey>,
    sysvar_instructions: Option<solana_program::pubkey::Pubkey>,
    __remaining_accounts: Vec<super::InstructionAccount>,
}

impl CloseEscrowAccountBuilder {
    pub fn new() -> Self {
        Self::default()
    }
    /// Escrow account
    #[inline(always)]
    pub fn escrow(&mut self, escrow: solana_program::pubkey::Pubkey) -> &mut Self {
        self.escrow = Some(escrow);
        self
    }
    /// Metadata account
    #[inline(always)]
    pub fn metadata(&mut self, metadata: solana_program::pubkey::Pubkey) -> &mut Self {
        self.metadata = Some(metadata);
        self
    }
    /// Mint account
    #[inline(always)]
    pub fn mint(&mut self, mint: solana_program::pubkey::Pubkey) -> &mut Self {
        self.mint = Some(mint);
        self
    }
    /// Token account
    #[inline(always)]
    pub fn token_account(&mut self, token_account: solana_program::pubkey::Pubkey) -> &mut Self {
        self.token_account = Some(token_account);
        self
    }
    /// Edition account
    #[inline(always)]
    pub fn edition(&mut self, edition: solana_program::pubkey::Pubkey) -> &mut Self {
        self.edition = Some(edition);
        self
    }
    /// Wallet paying for the transaction and new account
    #[inline(always)]
    pub fn payer(&mut self, payer: solana_program::pubkey::Pubkey) -> &mut Self {
        self.payer = Some(payer);
        self
    }
    /// System program
    #[inline(always)]
    pub fn system_program(&mut self, system_program: solana_program::pubkey::Pubkey) -> &mut Self {
        self.system_program = Some(system_program);
        self
    }
    /// Instructions sysvar account
    #[inline(always)]
    pub fn sysvar_instructions(
        &mut self,
        sysvar_instructions: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.sysvar_instructions = Some(sysvar_instructions);
        self
    }
    #[inline(always)]
    pub fn remaining_account(&mut self, account: super::InstructionAccount) -> &mut Self {
        self.__remaining_accounts.push(account);
        self
    }
    #[inline(always)]
    pub fn remaining_accounts(&mut self, accounts: &[super::InstructionAccount]) -> &mut Self {
        self.__remaining_accounts.extend_from_slice(accounts);
        self
    }
    #[allow(clippy::clone_on_copy)]
    pub fn build(&self) -> solana_program::instruction::Instruction {
        let accounts = CloseEscrowAccount {
            escrow: self.escrow.expect("escrow is not set"),
            metadata: self.metadata.expect("metadata is not set"),
            mint: self.mint.expect("mint is not set"),
            token_account: self.token_account.expect("token_account is not set"),
            edition: self.edition.expect("edition is not set"),
            payer: self.payer.expect("payer is not set"),
            system_program: self
                .system_program
                .unwrap_or(solana_program::pubkey!("11111111111111111111111111111111")),
            sysvar_instructions: self.sysvar_instructions.unwrap_or(solana_program::pubkey!(
                "Sysvar1nstructions1111111111111111111111111"
            )),
            __remaining_accounts: self.__remaining_accounts.clone(),
        };

        accounts.instruction()
    }
}

/// `close_escrow_account` CPI instruction.
pub struct CloseEscrowAccountCpi<'a> {
    /// The program to invoke.
    pub __program: &'a solana_program::account_info::AccountInfo<'a>,
    /// Escrow account
    pub escrow: &'a solana_program::account_info::AccountInfo<'a>,
    /// Metadata account
    pub metadata: &'a solana_program::account_info::AccountInfo<'a>,
    /// Mint account
    pub mint: &'a solana_program::account_info::AccountInfo<'a>,
    /// Token account
    pub token_account: &'a solana_program::account_info::AccountInfo<'a>,
    /// Edition account
    pub edition: &'a solana_program::account_info::AccountInfo<'a>,
    /// Wallet paying for the transaction and new account
    pub payer: &'a solana_program::account_info::AccountInfo<'a>,
    /// System program
    pub system_program: &'a solana_program::account_info::AccountInfo<'a>,
    /// Instructions sysvar account
    pub sysvar_instructions: &'a solana_program::account_info::AccountInfo<'a>,
    /// Additional instruction accounts.
    pub __remaining_accounts: Vec<super::InstructionAccountInfo<'a>>,
}

impl<'a> CloseEscrowAccountCpi<'a> {
    pub fn invoke(&self) -> solana_program::entrypoint::ProgramResult {
        self.invoke_signed(&[])
    }
    #[allow(clippy::clone_on_copy)]
    #[allow(clippy::vec_init_then_push)]
    pub fn invoke_signed(
        &self,
        signers_seeds: &[&[&[u8]]],
    ) -> solana_program::entrypoint::ProgramResult {
        let mut accounts = Vec::with_capacity(8 + self.__remaining_accounts.len());
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.escrow.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.metadata.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.mint.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.token_account.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.edition.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.payer.key,
            true,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.system_program.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.sysvar_instructions.key,
            false,
        ));
        self.__remaining_accounts
            .iter()
            .for_each(|remaining_account| accounts.push(remaining_account.to_account_meta()));
        let data = CloseEscrowAccountInstructionData::new()
            .try_to_vec()
            .unwrap();

        let instruction = solana_program::instruction::Instruction {
            program_id: crate::MPL_TOKEN_METADATA_ID,
            accounts,
            data,
        };
        let mut account_infos = Vec::with_capacity(8 + 1);
        account_infos.push(self.__program.clone());
        account_infos.push(self.escrow.clone());
        account_infos.push(self.metadata.clone());
        account_infos.push(self.mint.clone());
        account_infos.push(self.token_account.clone());
        account_infos.push(self.edition.clone());
        account_infos.push(self.payer.clone());
        account_infos.push(self.system_program.clone());
        account_infos.push(self.sysvar_instructions.clone());

        if signers_seeds.is_empty() {
            solana_program::program::invoke(&instruction, &account_infos)
        } else {
            solana_program::program::invoke_signed(&instruction, &account_infos, signers_seeds)
        }
    }
}

/// `close_escrow_account` CPI instruction builder.
pub struct CloseEscrowAccountCpiBuilder<'a> {
    instruction: Box<CloseEscrowAccountCpiBuilderInstruction<'a>>,
}

impl<'a> CloseEscrowAccountCpiBuilder<'a> {
    pub fn new(program: &'a solana_program::account_info::AccountInfo<'a>) -> Self {
        let instruction = Box::new(CloseEscrowAccountCpiBuilderInstruction {
            __program: program,
            escrow: None,
            metadata: None,
            mint: None,
            token_account: None,
            edition: None,
            payer: None,
            system_program: None,
            sysvar_instructions: None,
            __remaining_accounts: Vec::new(),
        });
        Self { instruction }
    }
    /// Escrow account
    #[inline(always)]
    pub fn escrow(
        &mut self,
        escrow: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.escrow = Some(escrow);
        self
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
    /// Mint account
    #[inline(always)]
    pub fn mint(&mut self, mint: &'a solana_program::account_info::AccountInfo<'a>) -> &mut Self {
        self.instruction.mint = Some(mint);
        self
    }
    /// Token account
    #[inline(always)]
    pub fn token_account(
        &mut self,
        token_account: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.token_account = Some(token_account);
        self
    }
    /// Edition account
    #[inline(always)]
    pub fn edition(
        &mut self,
        edition: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.edition = Some(edition);
        self
    }
    /// Wallet paying for the transaction and new account
    #[inline(always)]
    pub fn payer(&mut self, payer: &'a solana_program::account_info::AccountInfo<'a>) -> &mut Self {
        self.instruction.payer = Some(payer);
        self
    }
    /// System program
    #[inline(always)]
    pub fn system_program(
        &mut self,
        system_program: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.system_program = Some(system_program);
        self
    }
    /// Instructions sysvar account
    #[inline(always)]
    pub fn sysvar_instructions(
        &mut self,
        sysvar_instructions: &'a solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.sysvar_instructions = Some(sysvar_instructions);
        self
    }
    #[inline(always)]
    pub fn remaining_account(&mut self, account: super::InstructionAccountInfo<'a>) -> &mut Self {
        self.instruction.__remaining_accounts.push(account);
        self
    }
    #[inline(always)]
    pub fn remaining_accounts(
        &mut self,
        accounts: &[super::InstructionAccountInfo<'a>],
    ) -> &mut Self {
        self.instruction
            .__remaining_accounts
            .extend_from_slice(accounts);
        self
    }
    #[allow(clippy::clone_on_copy)]
    pub fn build(&self) -> CloseEscrowAccountCpi<'a> {
        CloseEscrowAccountCpi {
            __program: self.instruction.__program,

            escrow: self.instruction.escrow.expect("escrow is not set"),

            metadata: self.instruction.metadata.expect("metadata is not set"),

            mint: self.instruction.mint.expect("mint is not set"),

            token_account: self
                .instruction
                .token_account
                .expect("token_account is not set"),

            edition: self.instruction.edition.expect("edition is not set"),

            payer: self.instruction.payer.expect("payer is not set"),

            system_program: self
                .instruction
                .system_program
                .expect("system_program is not set"),

            sysvar_instructions: self
                .instruction
                .sysvar_instructions
                .expect("sysvar_instructions is not set"),
            __remaining_accounts: self.instruction.__remaining_accounts.clone(),
        }
    }
}

struct CloseEscrowAccountCpiBuilderInstruction<'a> {
    __program: &'a solana_program::account_info::AccountInfo<'a>,
    escrow: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    metadata: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    mint: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    token_account: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    edition: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    payer: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    system_program: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    sysvar_instructions: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    __remaining_accounts: Vec<super::InstructionAccountInfo<'a>>,
}
