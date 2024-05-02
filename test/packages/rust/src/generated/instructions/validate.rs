//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

use crate::generated::types::Operation;
use crate::generated::types::Payload;
use borsh::BorshDeserialize;
use borsh::BorshSerialize;

/// Accounts.
pub struct Validate {
    /// Payer and creator of the RuleSet
    pub payer: solana_program::pubkey::Pubkey,
    /// The PDA account where the RuleSet is stored
    pub rule_set: solana_program::pubkey::Pubkey,
    /// System program
    pub system_program: solana_program::pubkey::Pubkey,

    pub opt_rule_signer1: Option<(solana_program::pubkey::Pubkey, bool)>,
    /// Optional rule validation signer 2
    pub opt_rule_signer2: Option<solana_program::pubkey::Pubkey>,
    /// Optional rule validation signer 3
    pub opt_rule_signer3: Option<solana_program::pubkey::Pubkey>,
    /// Optional rule validation signer 4
    pub opt_rule_signer4: Option<solana_program::pubkey::Pubkey>,
    /// Optional rule validation signer 5
    pub opt_rule_signer5: Option<solana_program::pubkey::Pubkey>,
    /// Optional rule validation non-signer 1
    pub opt_rule_nonsigner1: Option<solana_program::pubkey::Pubkey>,
    /// Optional rule validation non-signer 2
    pub opt_rule_nonsigner2: Option<solana_program::pubkey::Pubkey>,
    /// Optional rule validation non-signer 3
    pub opt_rule_nonsigner3: Option<solana_program::pubkey::Pubkey>,
    /// Optional rule validation non-signer 4
    pub opt_rule_nonsigner4: Option<solana_program::pubkey::Pubkey>,
    /// Optional rule validation non-signer 5
    pub opt_rule_nonsigner5: Option<solana_program::pubkey::Pubkey>,
}

impl Validate {
    pub fn instruction(
        &self,
        args: ValidateInstructionArgs,
    ) -> solana_program::instruction::Instruction {
        self.instruction_with_remaining_accounts(args, &[])
    }
    #[allow(clippy::vec_init_then_push)]
    pub fn instruction_with_remaining_accounts(
        &self,
        args: ValidateInstructionArgs,
        remaining_accounts: &[solana_program::instruction::AccountMeta],
    ) -> solana_program::instruction::Instruction {
        let mut accounts = Vec::with_capacity(13 + remaining_accounts.len());
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.payer, true,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.rule_set,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.system_program,
            false,
        ));
        if let Some((opt_rule_signer1, signer)) = self.opt_rule_signer1 {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                opt_rule_signer1,
                signer,
            ));
        }
        if let Some(opt_rule_signer2) = self.opt_rule_signer2 {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                opt_rule_signer2,
                true,
            ));
        }
        if let Some(opt_rule_signer3) = self.opt_rule_signer3 {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                opt_rule_signer3,
                true,
            ));
        }
        if let Some(opt_rule_signer4) = self.opt_rule_signer4 {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                opt_rule_signer4,
                true,
            ));
        }
        if let Some(opt_rule_signer5) = self.opt_rule_signer5 {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                opt_rule_signer5,
                true,
            ));
        }
        if let Some(opt_rule_nonsigner1) = self.opt_rule_nonsigner1 {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                opt_rule_nonsigner1,
                false,
            ));
        }
        if let Some(opt_rule_nonsigner2) = self.opt_rule_nonsigner2 {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                opt_rule_nonsigner2,
                false,
            ));
        }
        if let Some(opt_rule_nonsigner3) = self.opt_rule_nonsigner3 {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                opt_rule_nonsigner3,
                false,
            ));
        }
        if let Some(opt_rule_nonsigner4) = self.opt_rule_nonsigner4 {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                opt_rule_nonsigner4,
                false,
            ));
        }
        if let Some(opt_rule_nonsigner5) = self.opt_rule_nonsigner5 {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                opt_rule_nonsigner5,
                false,
            ));
        }
        accounts.extend_from_slice(remaining_accounts);
        let mut data = ValidateInstructionData::new().try_to_vec().unwrap();
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
pub struct ValidateInstructionData {
    discriminator: u8,
}

impl ValidateInstructionData {
    pub fn new() -> Self {
        Self { discriminator: 1 }
    }
}

#[derive(Clone, Debug, Eq, PartialEq)]
#[cfg_attr(not(feature = "anchor"), derive(BorshSerialize, BorshDeserialize))]
#[cfg_attr(
    feature = "anchor",
    derive(anchor_lang::AnchorSerialize, anchor_lang::AnchorDeserialize)
)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct ValidateInstructionArgs {
    pub rule_set_name: String,
    pub operation: Operation,
    pub payload: Payload,
}

/// Instruction builder for `Validate`.
///
/// ### Accounts:
///
///   0. `[writable, signer]` payer
///   1. `[writable]` rule_set
///   2. `[optional]` system_program (default to `11111111111111111111111111111111`)
///   3. `[signer, optional]` opt_rule_signer1
///   4. `[signer, optional]` opt_rule_signer2
///   5. `[signer, optional]` opt_rule_signer3
///   6. `[signer, optional]` opt_rule_signer4
///   7. `[signer, optional]` opt_rule_signer5
///   8. `[optional]` opt_rule_nonsigner1
///   9. `[optional]` opt_rule_nonsigner2
///   10. `[optional]` opt_rule_nonsigner3
///   11. `[optional]` opt_rule_nonsigner4
///   12. `[optional]` opt_rule_nonsigner5
#[derive(Default)]
pub struct ValidateBuilder {
    payer: Option<solana_program::pubkey::Pubkey>,
    rule_set: Option<solana_program::pubkey::Pubkey>,
    system_program: Option<solana_program::pubkey::Pubkey>,
    opt_rule_signer1: Option<(solana_program::pubkey::Pubkey, bool)>,
    opt_rule_signer2: Option<solana_program::pubkey::Pubkey>,
    opt_rule_signer3: Option<solana_program::pubkey::Pubkey>,
    opt_rule_signer4: Option<solana_program::pubkey::Pubkey>,
    opt_rule_signer5: Option<solana_program::pubkey::Pubkey>,
    opt_rule_nonsigner1: Option<solana_program::pubkey::Pubkey>,
    opt_rule_nonsigner2: Option<solana_program::pubkey::Pubkey>,
    opt_rule_nonsigner3: Option<solana_program::pubkey::Pubkey>,
    opt_rule_nonsigner4: Option<solana_program::pubkey::Pubkey>,
    opt_rule_nonsigner5: Option<solana_program::pubkey::Pubkey>,
    rule_set_name: Option<String>,
    operation: Option<Operation>,
    payload: Option<Payload>,
    __remaining_accounts: Vec<solana_program::instruction::AccountMeta>,
}

impl ValidateBuilder {
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
    pub fn rule_set(&mut self, rule_set: solana_program::pubkey::Pubkey) -> &mut Self {
        self.rule_set = Some(rule_set);
        self
    }
    /// `[optional account, default to '11111111111111111111111111111111']`
    /// System program
    #[inline(always)]
    pub fn system_program(&mut self, system_program: solana_program::pubkey::Pubkey) -> &mut Self {
        self.system_program = Some(system_program);
        self
    }
    /// `[optional account]`
    #[inline(always)]
    pub fn opt_rule_signer1(
        &mut self,
        opt_rule_signer1: Option<solana_program::pubkey::Pubkey>,
        as_signer: bool,
    ) -> &mut Self {
        if let Some(opt_rule_signer1) = opt_rule_signer1 {
            self.opt_rule_signer1 = Some((opt_rule_signer1, as_signer));
        } else {
            self.opt_rule_signer1 = None;
        }
        self
    }
    /// `[optional account]`
    /// Optional rule validation signer 2
    #[inline(always)]
    pub fn opt_rule_signer2(
        &mut self,
        opt_rule_signer2: Option<solana_program::pubkey::Pubkey>,
    ) -> &mut Self {
        self.opt_rule_signer2 = opt_rule_signer2;
        self
    }
    /// `[optional account]`
    /// Optional rule validation signer 3
    #[inline(always)]
    pub fn opt_rule_signer3(
        &mut self,
        opt_rule_signer3: Option<solana_program::pubkey::Pubkey>,
    ) -> &mut Self {
        self.opt_rule_signer3 = opt_rule_signer3;
        self
    }
    /// `[optional account]`
    /// Optional rule validation signer 4
    #[inline(always)]
    pub fn opt_rule_signer4(
        &mut self,
        opt_rule_signer4: Option<solana_program::pubkey::Pubkey>,
    ) -> &mut Self {
        self.opt_rule_signer4 = opt_rule_signer4;
        self
    }
    /// `[optional account]`
    /// Optional rule validation signer 5
    #[inline(always)]
    pub fn opt_rule_signer5(
        &mut self,
        opt_rule_signer5: Option<solana_program::pubkey::Pubkey>,
    ) -> &mut Self {
        self.opt_rule_signer5 = opt_rule_signer5;
        self
    }
    /// `[optional account]`
    /// Optional rule validation non-signer 1
    #[inline(always)]
    pub fn opt_rule_nonsigner1(
        &mut self,
        opt_rule_nonsigner1: Option<solana_program::pubkey::Pubkey>,
    ) -> &mut Self {
        self.opt_rule_nonsigner1 = opt_rule_nonsigner1;
        self
    }
    /// `[optional account]`
    /// Optional rule validation non-signer 2
    #[inline(always)]
    pub fn opt_rule_nonsigner2(
        &mut self,
        opt_rule_nonsigner2: Option<solana_program::pubkey::Pubkey>,
    ) -> &mut Self {
        self.opt_rule_nonsigner2 = opt_rule_nonsigner2;
        self
    }
    /// `[optional account]`
    /// Optional rule validation non-signer 3
    #[inline(always)]
    pub fn opt_rule_nonsigner3(
        &mut self,
        opt_rule_nonsigner3: Option<solana_program::pubkey::Pubkey>,
    ) -> &mut Self {
        self.opt_rule_nonsigner3 = opt_rule_nonsigner3;
        self
    }
    /// `[optional account]`
    /// Optional rule validation non-signer 4
    #[inline(always)]
    pub fn opt_rule_nonsigner4(
        &mut self,
        opt_rule_nonsigner4: Option<solana_program::pubkey::Pubkey>,
    ) -> &mut Self {
        self.opt_rule_nonsigner4 = opt_rule_nonsigner4;
        self
    }
    /// `[optional account]`
    /// Optional rule validation non-signer 5
    #[inline(always)]
    pub fn opt_rule_nonsigner5(
        &mut self,
        opt_rule_nonsigner5: Option<solana_program::pubkey::Pubkey>,
    ) -> &mut Self {
        self.opt_rule_nonsigner5 = opt_rule_nonsigner5;
        self
    }
    #[inline(always)]
    pub fn rule_set_name(&mut self, rule_set_name: String) -> &mut Self {
        self.rule_set_name = Some(rule_set_name);
        self
    }
    #[inline(always)]
    pub fn operation(&mut self, operation: Operation) -> &mut Self {
        self.operation = Some(operation);
        self
    }
    #[inline(always)]
    pub fn payload(&mut self, payload: Payload) -> &mut Self {
        self.payload = Some(payload);
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
        let accounts = Validate {
            payer: self.payer.expect("payer is not set"),
            rule_set: self.rule_set.expect("rule_set is not set"),
            system_program: self
                .system_program
                .unwrap_or(solana_program::pubkey!("11111111111111111111111111111111")),
            opt_rule_signer1: self.opt_rule_signer1,
            opt_rule_signer2: self.opt_rule_signer2,
            opt_rule_signer3: self.opt_rule_signer3,
            opt_rule_signer4: self.opt_rule_signer4,
            opt_rule_signer5: self.opt_rule_signer5,
            opt_rule_nonsigner1: self.opt_rule_nonsigner1,
            opt_rule_nonsigner2: self.opt_rule_nonsigner2,
            opt_rule_nonsigner3: self.opt_rule_nonsigner3,
            opt_rule_nonsigner4: self.opt_rule_nonsigner4,
            opt_rule_nonsigner5: self.opt_rule_nonsigner5,
        };
        let args = ValidateInstructionArgs {
            rule_set_name: self
                .rule_set_name
                .clone()
                .expect("rule_set_name is not set"),
            operation: self.operation.clone().expect("operation is not set"),
            payload: self.payload.clone().expect("payload is not set"),
        };

        accounts.instruction_with_remaining_accounts(args, &self.__remaining_accounts)
    }
}

/// `validate` CPI accounts.
pub struct ValidateCpiAccounts<'a, 'b> {
    /// Payer and creator of the RuleSet
    pub payer: &'b solana_program::account_info::AccountInfo<'a>,
    /// The PDA account where the RuleSet is stored
    pub rule_set: &'b solana_program::account_info::AccountInfo<'a>,
    /// System program
    pub system_program: &'b solana_program::account_info::AccountInfo<'a>,

    pub opt_rule_signer1: Option<(&'b solana_program::account_info::AccountInfo<'a>, bool)>,
    /// Optional rule validation signer 2
    pub opt_rule_signer2: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    /// Optional rule validation signer 3
    pub opt_rule_signer3: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    /// Optional rule validation signer 4
    pub opt_rule_signer4: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    /// Optional rule validation signer 5
    pub opt_rule_signer5: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    /// Optional rule validation non-signer 1
    pub opt_rule_nonsigner1: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    /// Optional rule validation non-signer 2
    pub opt_rule_nonsigner2: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    /// Optional rule validation non-signer 3
    pub opt_rule_nonsigner3: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    /// Optional rule validation non-signer 4
    pub opt_rule_nonsigner4: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    /// Optional rule validation non-signer 5
    pub opt_rule_nonsigner5: Option<&'b solana_program::account_info::AccountInfo<'a>>,
}

/// `validate` CPI instruction.
pub struct ValidateCpi<'a, 'b> {
    /// The program to invoke.
    pub __program: &'b solana_program::account_info::AccountInfo<'a>,
    /// Payer and creator of the RuleSet
    pub payer: &'b solana_program::account_info::AccountInfo<'a>,
    /// The PDA account where the RuleSet is stored
    pub rule_set: &'b solana_program::account_info::AccountInfo<'a>,
    /// System program
    pub system_program: &'b solana_program::account_info::AccountInfo<'a>,

    pub opt_rule_signer1: Option<(&'b solana_program::account_info::AccountInfo<'a>, bool)>,
    /// Optional rule validation signer 2
    pub opt_rule_signer2: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    /// Optional rule validation signer 3
    pub opt_rule_signer3: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    /// Optional rule validation signer 4
    pub opt_rule_signer4: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    /// Optional rule validation signer 5
    pub opt_rule_signer5: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    /// Optional rule validation non-signer 1
    pub opt_rule_nonsigner1: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    /// Optional rule validation non-signer 2
    pub opt_rule_nonsigner2: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    /// Optional rule validation non-signer 3
    pub opt_rule_nonsigner3: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    /// Optional rule validation non-signer 4
    pub opt_rule_nonsigner4: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    /// Optional rule validation non-signer 5
    pub opt_rule_nonsigner5: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    /// The arguments for the instruction.
    pub __args: ValidateInstructionArgs,
}

impl<'a, 'b> ValidateCpi<'a, 'b> {
    pub fn new(
        program: &'b solana_program::account_info::AccountInfo<'a>,
        accounts: ValidateCpiAccounts<'a, 'b>,
        args: ValidateInstructionArgs,
    ) -> Self {
        Self {
            __program: program,
            payer: accounts.payer,
            rule_set: accounts.rule_set,
            system_program: accounts.system_program,
            opt_rule_signer1: accounts.opt_rule_signer1,
            opt_rule_signer2: accounts.opt_rule_signer2,
            opt_rule_signer3: accounts.opt_rule_signer3,
            opt_rule_signer4: accounts.opt_rule_signer4,
            opt_rule_signer5: accounts.opt_rule_signer5,
            opt_rule_nonsigner1: accounts.opt_rule_nonsigner1,
            opt_rule_nonsigner2: accounts.opt_rule_nonsigner2,
            opt_rule_nonsigner3: accounts.opt_rule_nonsigner3,
            opt_rule_nonsigner4: accounts.opt_rule_nonsigner4,
            opt_rule_nonsigner5: accounts.opt_rule_nonsigner5,
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
        let mut accounts = Vec::with_capacity(13 + remaining_accounts.len());
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.payer.key,
            true,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.rule_set.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.system_program.key,
            false,
        ));
        if let Some((opt_rule_signer1, signer)) = self.opt_rule_signer1 {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                *opt_rule_signer1.key,
                signer,
            ));
        }
        if let Some(opt_rule_signer2) = self.opt_rule_signer2 {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                *opt_rule_signer2.key,
                true,
            ));
        }
        if let Some(opt_rule_signer3) = self.opt_rule_signer3 {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                *opt_rule_signer3.key,
                true,
            ));
        }
        if let Some(opt_rule_signer4) = self.opt_rule_signer4 {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                *opt_rule_signer4.key,
                true,
            ));
        }
        if let Some(opt_rule_signer5) = self.opt_rule_signer5 {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                *opt_rule_signer5.key,
                true,
            ));
        }
        if let Some(opt_rule_nonsigner1) = self.opt_rule_nonsigner1 {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                *opt_rule_nonsigner1.key,
                false,
            ));
        }
        if let Some(opt_rule_nonsigner2) = self.opt_rule_nonsigner2 {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                *opt_rule_nonsigner2.key,
                false,
            ));
        }
        if let Some(opt_rule_nonsigner3) = self.opt_rule_nonsigner3 {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                *opt_rule_nonsigner3.key,
                false,
            ));
        }
        if let Some(opt_rule_nonsigner4) = self.opt_rule_nonsigner4 {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                *opt_rule_nonsigner4.key,
                false,
            ));
        }
        if let Some(opt_rule_nonsigner5) = self.opt_rule_nonsigner5 {
            accounts.push(solana_program::instruction::AccountMeta::new_readonly(
                *opt_rule_nonsigner5.key,
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
        let mut data = ValidateInstructionData::new().try_to_vec().unwrap();
        let mut args = self.__args.try_to_vec().unwrap();
        data.append(&mut args);

        let instruction = solana_program::instruction::Instruction {
            program_id: crate::MPL_TOKEN_AUTH_RULES_ID,
            accounts,
            data,
        };
        let mut account_infos = Vec::with_capacity(13 + 1 + remaining_accounts.len());
        account_infos.push(self.__program.clone());
        account_infos.push(self.payer.clone());
        account_infos.push(self.rule_set.clone());
        account_infos.push(self.system_program.clone());
        if let Some(opt_rule_signer1) = self.opt_rule_signer1 {
            account_infos.push(opt_rule_signer1.0.clone());
        }
        if let Some(opt_rule_signer2) = self.opt_rule_signer2 {
            account_infos.push(opt_rule_signer2.clone());
        }
        if let Some(opt_rule_signer3) = self.opt_rule_signer3 {
            account_infos.push(opt_rule_signer3.clone());
        }
        if let Some(opt_rule_signer4) = self.opt_rule_signer4 {
            account_infos.push(opt_rule_signer4.clone());
        }
        if let Some(opt_rule_signer5) = self.opt_rule_signer5 {
            account_infos.push(opt_rule_signer5.clone());
        }
        if let Some(opt_rule_nonsigner1) = self.opt_rule_nonsigner1 {
            account_infos.push(opt_rule_nonsigner1.clone());
        }
        if let Some(opt_rule_nonsigner2) = self.opt_rule_nonsigner2 {
            account_infos.push(opt_rule_nonsigner2.clone());
        }
        if let Some(opt_rule_nonsigner3) = self.opt_rule_nonsigner3 {
            account_infos.push(opt_rule_nonsigner3.clone());
        }
        if let Some(opt_rule_nonsigner4) = self.opt_rule_nonsigner4 {
            account_infos.push(opt_rule_nonsigner4.clone());
        }
        if let Some(opt_rule_nonsigner5) = self.opt_rule_nonsigner5 {
            account_infos.push(opt_rule_nonsigner5.clone());
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

/// Instruction builder for `Validate` via CPI.
///
/// ### Accounts:
///
///   0. `[writable, signer]` payer
///   1. `[writable]` rule_set
///   2. `[]` system_program
///   3. `[signer, optional]` opt_rule_signer1
///   4. `[signer, optional]` opt_rule_signer2
///   5. `[signer, optional]` opt_rule_signer3
///   6. `[signer, optional]` opt_rule_signer4
///   7. `[signer, optional]` opt_rule_signer5
///   8. `[optional]` opt_rule_nonsigner1
///   9. `[optional]` opt_rule_nonsigner2
///   10. `[optional]` opt_rule_nonsigner3
///   11. `[optional]` opt_rule_nonsigner4
///   12. `[optional]` opt_rule_nonsigner5
pub struct ValidateCpiBuilder<'a, 'b> {
    instruction: Box<ValidateCpiBuilderInstruction<'a, 'b>>,
}

impl<'a, 'b> ValidateCpiBuilder<'a, 'b> {
    pub fn new(program: &'b solana_program::account_info::AccountInfo<'a>) -> Self {
        let instruction = Box::new(ValidateCpiBuilderInstruction {
            __program: program,
            payer: None,
            rule_set: None,
            system_program: None,
            opt_rule_signer1: None,
            opt_rule_signer2: None,
            opt_rule_signer3: None,
            opt_rule_signer4: None,
            opt_rule_signer5: None,
            opt_rule_nonsigner1: None,
            opt_rule_nonsigner2: None,
            opt_rule_nonsigner3: None,
            opt_rule_nonsigner4: None,
            opt_rule_nonsigner5: None,
            rule_set_name: None,
            operation: None,
            payload: None,
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
    pub fn rule_set(
        &mut self,
        rule_set: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.rule_set = Some(rule_set);
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
    /// `[optional account]`
    #[inline(always)]
    pub fn opt_rule_signer1(
        &mut self,
        opt_rule_signer1: Option<&'b solana_program::account_info::AccountInfo<'a>>,
        as_signer: bool,
    ) -> &mut Self {
        if let Some(opt_rule_signer1) = opt_rule_signer1 {
            self.instruction.opt_rule_signer1 = Some((opt_rule_signer1, as_signer));
        } else {
            self.instruction.opt_rule_signer1 = None;
        }
        self
    }
    /// `[optional account]`
    /// Optional rule validation signer 2
    #[inline(always)]
    pub fn opt_rule_signer2(
        &mut self,
        opt_rule_signer2: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    ) -> &mut Self {
        self.instruction.opt_rule_signer2 = opt_rule_signer2;
        self
    }
    /// `[optional account]`
    /// Optional rule validation signer 3
    #[inline(always)]
    pub fn opt_rule_signer3(
        &mut self,
        opt_rule_signer3: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    ) -> &mut Self {
        self.instruction.opt_rule_signer3 = opt_rule_signer3;
        self
    }
    /// `[optional account]`
    /// Optional rule validation signer 4
    #[inline(always)]
    pub fn opt_rule_signer4(
        &mut self,
        opt_rule_signer4: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    ) -> &mut Self {
        self.instruction.opt_rule_signer4 = opt_rule_signer4;
        self
    }
    /// `[optional account]`
    /// Optional rule validation signer 5
    #[inline(always)]
    pub fn opt_rule_signer5(
        &mut self,
        opt_rule_signer5: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    ) -> &mut Self {
        self.instruction.opt_rule_signer5 = opt_rule_signer5;
        self
    }
    /// `[optional account]`
    /// Optional rule validation non-signer 1
    #[inline(always)]
    pub fn opt_rule_nonsigner1(
        &mut self,
        opt_rule_nonsigner1: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    ) -> &mut Self {
        self.instruction.opt_rule_nonsigner1 = opt_rule_nonsigner1;
        self
    }
    /// `[optional account]`
    /// Optional rule validation non-signer 2
    #[inline(always)]
    pub fn opt_rule_nonsigner2(
        &mut self,
        opt_rule_nonsigner2: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    ) -> &mut Self {
        self.instruction.opt_rule_nonsigner2 = opt_rule_nonsigner2;
        self
    }
    /// `[optional account]`
    /// Optional rule validation non-signer 3
    #[inline(always)]
    pub fn opt_rule_nonsigner3(
        &mut self,
        opt_rule_nonsigner3: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    ) -> &mut Self {
        self.instruction.opt_rule_nonsigner3 = opt_rule_nonsigner3;
        self
    }
    /// `[optional account]`
    /// Optional rule validation non-signer 4
    #[inline(always)]
    pub fn opt_rule_nonsigner4(
        &mut self,
        opt_rule_nonsigner4: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    ) -> &mut Self {
        self.instruction.opt_rule_nonsigner4 = opt_rule_nonsigner4;
        self
    }
    /// `[optional account]`
    /// Optional rule validation non-signer 5
    #[inline(always)]
    pub fn opt_rule_nonsigner5(
        &mut self,
        opt_rule_nonsigner5: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    ) -> &mut Self {
        self.instruction.opt_rule_nonsigner5 = opt_rule_nonsigner5;
        self
    }
    #[inline(always)]
    pub fn rule_set_name(&mut self, rule_set_name: String) -> &mut Self {
        self.instruction.rule_set_name = Some(rule_set_name);
        self
    }
    #[inline(always)]
    pub fn operation(&mut self, operation: Operation) -> &mut Self {
        self.instruction.operation = Some(operation);
        self
    }
    #[inline(always)]
    pub fn payload(&mut self, payload: Payload) -> &mut Self {
        self.instruction.payload = Some(payload);
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
        let args = ValidateInstructionArgs {
            rule_set_name: self
                .instruction
                .rule_set_name
                .clone()
                .expect("rule_set_name is not set"),
            operation: self
                .instruction
                .operation
                .clone()
                .expect("operation is not set"),
            payload: self
                .instruction
                .payload
                .clone()
                .expect("payload is not set"),
        };
        let instruction = ValidateCpi {
            __program: self.instruction.__program,

            payer: self.instruction.payer.expect("payer is not set"),

            rule_set: self.instruction.rule_set.expect("rule_set is not set"),

            system_program: self
                .instruction
                .system_program
                .expect("system_program is not set"),

            opt_rule_signer1: self.instruction.opt_rule_signer1,

            opt_rule_signer2: self.instruction.opt_rule_signer2,

            opt_rule_signer3: self.instruction.opt_rule_signer3,

            opt_rule_signer4: self.instruction.opt_rule_signer4,

            opt_rule_signer5: self.instruction.opt_rule_signer5,

            opt_rule_nonsigner1: self.instruction.opt_rule_nonsigner1,

            opt_rule_nonsigner2: self.instruction.opt_rule_nonsigner2,

            opt_rule_nonsigner3: self.instruction.opt_rule_nonsigner3,

            opt_rule_nonsigner4: self.instruction.opt_rule_nonsigner4,

            opt_rule_nonsigner5: self.instruction.opt_rule_nonsigner5,
            __args: args,
        };
        instruction.invoke_signed_with_remaining_accounts(
            signers_seeds,
            &self.instruction.__remaining_accounts,
        )
    }
}

struct ValidateCpiBuilderInstruction<'a, 'b> {
    __program: &'b solana_program::account_info::AccountInfo<'a>,
    payer: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    rule_set: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    system_program: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    opt_rule_signer1: Option<(&'b solana_program::account_info::AccountInfo<'a>, bool)>,
    opt_rule_signer2: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    opt_rule_signer3: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    opt_rule_signer4: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    opt_rule_signer5: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    opt_rule_nonsigner1: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    opt_rule_nonsigner2: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    opt_rule_nonsigner3: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    opt_rule_nonsigner4: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    opt_rule_nonsigner5: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    rule_set_name: Option<String>,
    operation: Option<Operation>,
    payload: Option<Payload>,
    /// Additional instruction accounts `(AccountInfo, is_writable, is_signer)`.
    __remaining_accounts: Vec<(
        &'b solana_program::account_info::AccountInfo<'a>,
        bool,
        bool,
    )>,
}
