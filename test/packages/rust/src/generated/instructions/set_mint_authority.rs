//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

/// Accounts.
pub struct SetMintAuthority {
    pub candy_machine: solana_program::pubkey::Pubkey,

    pub authority: solana_program::pubkey::Pubkey,

    pub mint_authority: solana_program::pubkey::Pubkey,
}

impl SetMintAuthority {
    pub fn instruction(&self) -> solana_program::instruction::Instruction {
        let args = SetMintAuthorityInstructionArgs::new();
        solana_program::instruction::Instruction {
            program_id: crate::MPL_CANDY_MACHINE_CORE_ID,
            accounts: vec![
                solana_program::instruction::AccountMeta::new(self.candy_machine, false),
                solana_program::instruction::AccountMeta::new_readonly(self.authority, true),
                solana_program::instruction::AccountMeta::new_readonly(self.mint_authority, true),
            ],
            data: args.try_to_vec().unwrap(),
        }
    }
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
struct SetMintAuthorityInstructionArgs {
    discriminator: [u8; 8],
}

impl SetMintAuthorityInstructionArgs {
    pub fn new() -> Self {
        Self {
            discriminator: [67, 127, 155, 187, 100, 174, 103, 121],
        }
    }
}

/// Instruction builder.
#[derive(Default)]
pub struct SetMintAuthorityBuilder {
    candy_machine: Option<solana_program::pubkey::Pubkey>,
    authority: Option<solana_program::pubkey::Pubkey>,
    mint_authority: Option<solana_program::pubkey::Pubkey>,
}

impl SetMintAuthorityBuilder {
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
    pub fn mint_authority(&mut self, mint_authority: solana_program::pubkey::Pubkey) -> &mut Self {
        self.mint_authority = Some(mint_authority);
        self
    }
    pub fn build(&self) -> solana_program::instruction::Instruction {
        let accounts = SetMintAuthority {
            candy_machine: self.candy_machine.expect("candy_machine is not set"),

            authority: self.authority.expect("authority is not set"),

            mint_authority: self.mint_authority.expect("mint_authority is not set"),
        };
        accounts.instruction()
    }
}

pub mod cpi {
    use super::*;

    /// `set_mint_authority` CPI instruction.
    pub struct SetMintAuthority<'a> {
        pub program: &'a solana_program::account_info::AccountInfo<'a>,

        pub candy_machine: &'a solana_program::account_info::AccountInfo<'a>,

        pub authority: &'a solana_program::account_info::AccountInfo<'a>,

        pub mint_authority: &'a solana_program::account_info::AccountInfo<'a>,
    }

    impl<'a> SetMintAuthority<'a> {
        pub fn invoke(&self) -> solana_program::entrypoint::ProgramResult {
            self.invoke_signed(&[])
        }
        #[allow(clippy::vec_init_then_push)]
        pub fn invoke_signed(
            &self,
            signers_seeds: &[&[&[u8]]],
        ) -> solana_program::entrypoint::ProgramResult {
            let args = SetMintAuthorityInstructionArgs::new();
            let instruction = solana_program::instruction::Instruction {
                program_id: crate::MPL_CANDY_MACHINE_CORE_ID,
                accounts: vec![
                    solana_program::instruction::AccountMeta::new(*self.candy_machine.key, false),
                    solana_program::instruction::AccountMeta::new_readonly(
                        *self.authority.key,
                        true,
                    ),
                    solana_program::instruction::AccountMeta::new_readonly(
                        *self.mint_authority.key,
                        true,
                    ),
                ],
                data: args.try_to_vec().unwrap(),
            };
            let mut account_infos = Vec::with_capacity(3 + 1);
            account_infos.push(self.program.clone());
            account_infos.push(self.candy_machine.clone());
            account_infos.push(self.authority.clone());
            account_infos.push(self.mint_authority.clone());

            if signers_seeds.is_empty() {
                solana_program::program::invoke(&instruction, &account_infos)
            } else {
                solana_program::program::invoke_signed(&instruction, &account_infos, signers_seeds)
            }
        }
    }

    /// `set_mint_authority` CPI instruction builder.
    pub struct SetMintAuthorityBuilder<'a> {
        program: &'a solana_program::account_info::AccountInfo<'a>,
        candy_machine: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        authority: Option<&'a solana_program::account_info::AccountInfo<'a>>,
        mint_authority: Option<&'a solana_program::account_info::AccountInfo<'a>>,
    }

    impl<'a> SetMintAuthorityBuilder<'a> {
        pub fn new(program: &'a solana_program::account_info::AccountInfo<'a>) -> Self {
            Self {
                program,
                candy_machine: None,
                authority: None,
                mint_authority: None,
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
        pub fn mint_authority(
            &'a mut self,
            mint_authority: &'a solana_program::account_info::AccountInfo<'a>,
        ) -> &mut Self {
            self.mint_authority = Some(mint_authority);
            self
        }
        pub fn build(&'a self) -> SetMintAuthority {
            SetMintAuthority {
                program: self.program,

                candy_machine: self.candy_machine.expect("candy_machine is not set"),

                authority: self.authority.expect("authority is not set"),

                mint_authority: self.mint_authority.expect("mint_authority is not set"),
            }
        }
    }
}
