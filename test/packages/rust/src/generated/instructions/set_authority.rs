//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

use borsh::BorshDeserialize;
use borsh::BorshSerialize;
use solana_program::pubkey::Pubkey;

/// Accounts.
pub struct SetAuthority {
    pub candy_machine: solana_program::pubkey::Pubkey,

    pub authority: solana_program::pubkey::Pubkey,
}

impl SetAuthority {
    pub fn instruction(
        &self,
        args: SetAuthorityInstructionArgs,
    ) -> solana_program::instruction::Instruction {
        solana_program::instruction::Instruction {
            program_id: crate::MPL_CANDY_MACHINE_CORE_ID,
            accounts: vec![
                solana_program::instruction::AccountMeta::new(self.candy_machine, false),
                solana_program::instruction::AccountMeta::new_readonly(self.authority, true),
            ],
            data: args.try_to_vec().unwrap(),
        }
    }
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct SetAuthorityInstructionArgs {
    discriminator: [u8; 8],
    pub new_authority: Pubkey,
}

impl SetAuthorityInstructionArgs {
    pub fn new(new_authority: Pubkey) -> Self {
        Self {
            discriminator: [133, 250, 37, 21, 110, 163, 26, 121],
            new_authority,
        }
    }
}

/// Instruction builder.
#[derive(Default)]
pub struct SetAuthorityBuilder {
    candy_machine: Option<solana_program::pubkey::Pubkey>,
    authority: Option<solana_program::pubkey::Pubkey>,
    new_authority: Option<Pubkey>,
}

impl SetAuthorityBuilder {
    pub fn new() -> Self {
        Self::default()
    }
    pub fn candy_machine(&mut self, candy_machine: solana_program::pubkey::Pubkey) -> &mut Self {
        self.candy_machine = Some(candy_machine);
        self
    }
    pub fn authority(&mut self, authority: solana_program::pubkey::Pubkey) -> &mut Self {
        self.authority = Some(authority);
        self
    }
    pub fn new_authority(&mut self, new_authority: Pubkey) -> &mut Self {
        self.new_authority = Some(new_authority);
        self
    }
    pub fn build(&self) -> solana_program::instruction::Instruction {
        let accounts = SetAuthority {
            candy_machine: self.candy_machine.expect("candy_machine is not set"),

            authority: self.authority.expect("authority is not set"),
        };
        let args =
            SetAuthorityInstructionArgs::new(self.new_authority.expect("new_authority is not set"));
        accounts.instruction(args)
    }
}

pub mod cpi {
    use super::*;

    /// `set_authority` CPI instruction.
    pub struct SetAuthority<'a> {
        pub program: &'a solana_program::account_info::AccountInfo<'a>,

        pub candy_machine: &'a solana_program::account_info::AccountInfo<'a>,

        pub authority: &'a solana_program::account_info::AccountInfo<'a>,
        pub args: SetAuthorityInstructionArgs,
    }

    impl<'a> SetAuthority<'a> {
        pub fn invoke(&self) -> solana_program::entrypoint::ProgramResult {
            self.invoke_signed(&[])
        }
        #[allow(clippy::vec_init_then_push)]
        pub fn invoke_signed(
            &self,
            signers_seeds: &[&[&[u8]]],
        ) -> solana_program::entrypoint::ProgramResult {
            let instruction = solana_program::instruction::Instruction {
                program_id: crate::MPL_CANDY_MACHINE_CORE_ID,
                accounts: vec![
                    solana_program::instruction::AccountMeta::new(*self.candy_machine.key, false),
                    solana_program::instruction::AccountMeta::new_readonly(
                        *self.authority.key,
                        true,
                    ),
                ],
                data: self.args.try_to_vec().unwrap(),
            };
            let mut account_infos = Vec::with_capacity(2 + 1);
            account_infos.push(self.program.clone());
            account_infos.push(self.candy_machine.clone());
            account_infos.push(self.authority.clone());

            if signers_seeds.is_empty() {
                solana_program::program::invoke(&instruction, &account_infos)
            } else {
                solana_program::program::invoke_signed(&instruction, &account_infos, signers_seeds)
            }
        }
    }

    /// `set_authority` CPI instruction builder.
    pub struct SetAuthorityBuilder<'a> {
        program: &'a solana_program::account_info::AccountInfo<'a>,
        candy_machine: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        authority: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        new_authority: Option<Pubkey>,
    }

    impl<'a> SetAuthorityBuilder<'a> {
        pub fn new(program: &'a solana_program::account_info::AccountInfo<'a>) -> Self {
            Self {
                program,
                candy_machine: None,
                authority: None,
                new_authority: None,
            }
        }
        pub fn candy_machine(
            &'a mut self,
            candy_machine: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.candy_machine = Some(candy_machine);
            self
        }
        pub fn authority(
            &'a mut self,
            authority: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.authority = Some(authority);
            self
        }
        pub fn new_authority(&'a mut self, new_authority: Pubkey) -> &mut Self {
            self.new_authority = Some(new_authority);
            self
        }
        pub fn build(&'a self) -> SetAuthority {
            SetAuthority {
                program: self.program,

                candy_machine: self.candy_machine.expect("candy_machine is not set"),

                authority: self.authority.expect("authority is not set"),
                args: SetAuthorityInstructionArgs::new(
                    self.new_authority.expect("new_authority is not set"),
                ),
            }
        }
    }
}
