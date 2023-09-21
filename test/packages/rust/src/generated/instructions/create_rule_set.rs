//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

use crate::generated::types::TaCreateArgs;
use borsh::BorshDeserialize;
use borsh::BorshSerialize;

/// Accounts.
pub struct CreateRuleSet {
    /// Payer and creator of the RuleSet
    pub payer: solana_program::pubkey::Pubkey,
    /// The PDA account where the RuleSet is stored
    pub rule_set_pda: solana_program::pubkey::Pubkey,
    /// System program
    pub system_program: solana_program::pubkey::Pubkey,
}

impl CreateRuleSet {
    pub fn instruction(
        &self,
        args: CreateRuleSetInstructionArgs,
    ) -> solana_program::instruction::Instruction {
        self.instruction_with_remaining_accounts(args, &[])
    }
    #[allow(clippy::vec_init_then_push)]
    pub fn instruction_with_remaining_accounts(
        &self,
        args: CreateRuleSetInstructionArgs,
        remaining_accounts: &[solana_program::instruction::AccountMeta],
    ) -> solana_program::instruction::Instruction {
        let mut accounts = Vec::with_capacity(3 + remaining_accounts.len());
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.payer, true,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.rule_set_pda,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.system_program,
            false,
        ));
        accounts.extend_from_slice(remaining_accounts);
        let mut data = CreateRuleSetInstructionData::new().try_to_vec().unwrap();
        let mut args = args.try_to_vec().unwrap();
        data.append(&mut args);

        solana_program::instruction::Instruction {
            program_id: crate::MPL_TOKEN_AUTH_RULES_ID,
            accounts,
            data,
        }
    }
}

#[derive(BorshDeserialize, BorshSerialize)]
struct CreateRuleSetInstructionData {
    discriminator: u8,
}

impl CreateRuleSetInstructionData {
    fn new() -> Self {
        Self { discriminator: 0 }
    }
}

#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, Eq, PartialEq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct CreateRuleSetInstructionArgs {
    pub create_args: TaCreateArgs,
    pub rule_set_bump: u8,
}

/// Instruction builder.
#[derive(Default)]
pub struct CreateRuleSetBuilder {
    payer: Option<solana_program::pubkey::Pubkey>,
    rule_set_pda: Option<solana_program::pubkey::Pubkey>,
    system_program: Option<solana_program::pubkey::Pubkey>,
    create_args: Option<TaCreateArgs>,
    rule_set_bump: Option<u8>,
    __remaining_accounts: Vec<solana_program::instruction::AccountMeta>,
}

impl CreateRuleSetBuilder {
    pub fn new() -> Self {
        Self::default()
    }
    /// Payer and creator of the RuleSet
    #[inline(always)]
    pub fn payer(&mut self, payer: solana_program::pubkey::Pubkey) -> &mut Self {
        self.payer = Some(payer);
        self
    }
    /// The PDA account where the RuleSet is stored
    #[inline(always)]
    pub fn rule_set_pda(&mut self, rule_set_pda: solana_program::pubkey::Pubkey) -> &mut Self {
        self.rule_set_pda = Some(rule_set_pda);
        self
    }
    /// `[optional account, default to '11111111111111111111111111111111']`
    /// System program
    #[inline(always)]
    pub fn system_program(&mut self, system_program: solana_program::pubkey::Pubkey) -> &mut Self {
        self.system_program = Some(system_program);
        self
    }
    #[inline(always)]
    pub fn create_args(&mut self, create_args: TaCreateArgs) -> &mut Self {
        self.create_args = Some(create_args);
        self
    }
    #[inline(always)]
    pub fn rule_set_bump(&mut self, rule_set_bump: u8) -> &mut Self {
        self.rule_set_bump = Some(rule_set_bump);
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
        let accounts = CreateRuleSet {
            payer: self.payer.expect("payer is not set"),
            rule_set_pda: self.rule_set_pda.expect("rule_set_pda is not set"),
            system_program: self
                .system_program
                .unwrap_or(solana_program::pubkey!("11111111111111111111111111111111")),
        };
        let args = CreateRuleSetInstructionArgs {
            create_args: self.create_args.clone().expect("create_args is not set"),
            rule_set_bump: self
                .rule_set_bump
                .clone()
                .expect("rule_set_bump is not set"),
        };

        accounts.instruction_with_remaining_accounts(args, &self.__remaining_accounts)
    }
}

/// `create_rule_set` CPI accounts.
pub struct CreateRuleSetCpiAccounts<'a, 'b> {
    /// Payer and creator of the RuleSet
    pub payer: &'b solana_program::account_info::AccountInfo<'a>,
    /// The PDA account where the RuleSet is stored
    pub rule_set_pda: &'b solana_program::account_info::AccountInfo<'a>,
    /// System program
    pub system_program: &'b solana_program::account_info::AccountInfo<'a>,
}

/// `create_rule_set` CPI instruction.
pub struct CreateRuleSetCpi<'a, 'b> {
    /// The program to invoke.
    pub __program: &'b solana_program::account_info::AccountInfo<'a>,
    /// Payer and creator of the RuleSet
    pub payer: &'b solana_program::account_info::AccountInfo<'a>,
    /// The PDA account where the RuleSet is stored
    pub rule_set_pda: &'b solana_program::account_info::AccountInfo<'a>,
    /// System program
    pub system_program: &'b solana_program::account_info::AccountInfo<'a>,
    /// The arguments for the instruction.
    pub __args: CreateRuleSetInstructionArgs,
}

impl<'a, 'b> CreateRuleSetCpi<'a, 'b> {
    pub fn new(
        program: &'b solana_program::account_info::AccountInfo<'a>,
        accounts: CreateRuleSetCpiAccounts<'a, 'b>,
        args: CreateRuleSetInstructionArgs,
    ) -> Self {
        Self {
            __program: program,
            payer: accounts.payer,
            rule_set_pda: accounts.rule_set_pda,
            system_program: accounts.system_program,
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
        let mut accounts = Vec::with_capacity(3 + remaining_accounts.len());
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.payer.key,
            true,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.rule_set_pda.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.system_program.key,
            false,
        ));
        remaining_accounts.iter().for_each(|remaining_account| {
            accounts.push(solana_program::instruction::AccountMeta {
                pubkey: *remaining_account.0.key,
                is_signer: remaining_account.1,
                is_writable: remaining_account.2,
            })
        });
        let mut data = CreateRuleSetInstructionData::new().try_to_vec().unwrap();
        let mut args = self.__args.try_to_vec().unwrap();
        data.append(&mut args);

        let instruction = solana_program::instruction::Instruction {
            program_id: crate::MPL_TOKEN_AUTH_RULES_ID,
            accounts,
            data,
        };
        let mut account_infos = Vec::with_capacity(3 + 1 + remaining_accounts.len());
        account_infos.push(self.__program.clone());
        account_infos.push(self.payer.clone());
        account_infos.push(self.rule_set_pda.clone());
        account_infos.push(self.system_program.clone());
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

/// `create_rule_set` CPI instruction builder.
pub struct CreateRuleSetCpiBuilder<'a, 'b> {
    instruction: Box<CreateRuleSetCpiBuilderInstruction<'a, 'b>>,
}

impl<'a, 'b> CreateRuleSetCpiBuilder<'a, 'b> {
    pub fn new(program: &'b solana_program::account_info::AccountInfo<'a>) -> Self {
        let instruction = Box::new(CreateRuleSetCpiBuilderInstruction {
            __program: program,
            payer: None,
            rule_set_pda: None,
            system_program: None,
            create_args: None,
            rule_set_bump: None,
            __remaining_accounts: Vec::new(),
        });
        Self { instruction }
    }
    /// Payer and creator of the RuleSet
    #[inline(always)]
    pub fn payer(&mut self, payer: &'b solana_program::account_info::AccountInfo<'a>) -> &mut Self {
        self.instruction.payer = Some(payer);
        self
    }
    /// The PDA account where the RuleSet is stored
    #[inline(always)]
    pub fn rule_set_pda(
        &mut self,
        rule_set_pda: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.rule_set_pda = Some(rule_set_pda);
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
    #[inline(always)]
    pub fn create_args(&mut self, create_args: TaCreateArgs) -> &mut Self {
        self.instruction.create_args = Some(create_args);
        self
    }
    #[inline(always)]
    pub fn rule_set_bump(&mut self, rule_set_bump: u8) -> &mut Self {
        self.instruction.rule_set_bump = Some(rule_set_bump);
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
        let args = CreateRuleSetInstructionArgs {
            create_args: self
                .instruction
                .create_args
                .clone()
                .expect("create_args is not set"),
            rule_set_bump: self
                .instruction
                .rule_set_bump
                .clone()
                .expect("rule_set_bump is not set"),
        };
        let instruction = CreateRuleSetCpi {
            __program: self.instruction.__program,

            payer: self.instruction.payer.expect("payer is not set"),

            rule_set_pda: self
                .instruction
                .rule_set_pda
                .expect("rule_set_pda is not set"),

            system_program: self
                .instruction
                .system_program
                .expect("system_program is not set"),
            __args: args,
        };
        instruction.invoke_signed_with_remaining_accounts(
            signers_seeds,
            &self.instruction.__remaining_accounts,
        )
    }
}

struct CreateRuleSetCpiBuilderInstruction<'a, 'b> {
    __program: &'b solana_program::account_info::AccountInfo<'a>,
    payer: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    rule_set_pda: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    system_program: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    create_args: Option<TaCreateArgs>,
    rule_set_bump: Option<u8>,
    /// Additional instruction accounts `(AccountInfo, is_writable, is_signer)`.
    __remaining_accounts: Vec<(
        &'b solana_program::account_info::AccountInfo<'a>,
        bool,
        bool,
    )>,
}
