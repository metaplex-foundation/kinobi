//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

use crate::generated::types::Reservation;
use borsh::BorshDeserialize;
use borsh::BorshSerialize;

/// Accounts.
pub struct DeprecatedSetReservationList {
    /// Master Edition V1 key (pda of ['metadata', program id, mint id, 'edition'])
    pub master_edition: solana_program::pubkey::Pubkey,
    /// PDA for ReservationList of ['metadata', program id, master edition key, 'reservation', resource-key]
    pub reservation_list: solana_program::pubkey::Pubkey,
    /// The resource you tied the reservation list too
    pub resource: solana_program::pubkey::Pubkey,
}

impl DeprecatedSetReservationList {
    pub fn instruction(
        &self,
        args: DeprecatedSetReservationListInstructionArgs,
    ) -> solana_program::instruction::Instruction {
        self.instruction_with_remaining_accounts(args, &[])
    }
    #[allow(clippy::vec_init_then_push)]
    pub fn instruction_with_remaining_accounts(
        &self,
        args: DeprecatedSetReservationListInstructionArgs,
        remaining_accounts: &[solana_program::instruction::AccountMeta],
    ) -> solana_program::instruction::Instruction {
        let mut accounts = Vec::with_capacity(3 + remaining_accounts.len());
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.master_edition,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            self.reservation_list,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.resource,
            true,
        ));
        accounts.extend_from_slice(remaining_accounts);
        let mut data = DeprecatedSetReservationListInstructionData::new()
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
pub struct DeprecatedSetReservationListInstructionData {
    discriminator: u8,
}

impl DeprecatedSetReservationListInstructionData {
    pub fn new() -> Self {
        Self { discriminator: 5 }
    }
}

#[derive(Clone, Debug, Eq, PartialEq)]
#[cfg_attr(not(feature = "anchor"), derive(BorshSerialize, BorshDeserialize))]
#[cfg_attr(
    feature = "anchor",
    derive(anchor_lang::AnchorSerialize, anchor_lang::AnchorDeserialize)
)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct DeprecatedSetReservationListInstructionArgs {
    pub reservations: Vec<Reservation>,
    pub total_reservation_spots: Option<u64>,
    pub offset: u64,
    pub total_spot_offset: u64,
}

/// Instruction builder for `DeprecatedSetReservationList`.
///
/// ### Accounts:
///
///   0. `[writable]` master_edition
///   1. `[writable]` reservation_list
///   2. `[signer]` resource
#[derive(Default)]
pub struct DeprecatedSetReservationListBuilder {
    master_edition: Option<solana_program::pubkey::Pubkey>,
    reservation_list: Option<solana_program::pubkey::Pubkey>,
    resource: Option<solana_program::pubkey::Pubkey>,
    reservations: Option<Vec<Reservation>>,
    total_reservation_spots: Option<u64>,
    offset: Option<u64>,
    total_spot_offset: Option<u64>,
    __remaining_accounts: Vec<solana_program::instruction::AccountMeta>,
}

impl DeprecatedSetReservationListBuilder {
    pub fn new() -> Self {
        Self::default()
    }
    /// Master Edition V1 key (pda of ['metadata', program id, mint id, 'edition'])
    #[inline(always)]
    pub fn master_edition(&mut self, master_edition: solana_program::pubkey::Pubkey) -> &mut Self {
        self.master_edition = Some(master_edition);
        self
    }
    /// PDA for ReservationList of ['metadata', program id, master edition key, 'reservation', resource-key]
    #[inline(always)]
    pub fn reservation_list(
        &mut self,
        reservation_list: solana_program::pubkey::Pubkey,
    ) -> &mut Self {
        self.reservation_list = Some(reservation_list);
        self
    }
    /// The resource you tied the reservation list too
    #[inline(always)]
    pub fn resource(&mut self, resource: solana_program::pubkey::Pubkey) -> &mut Self {
        self.resource = Some(resource);
        self
    }
    #[inline(always)]
    pub fn reservations(&mut self, reservations: Vec<Reservation>) -> &mut Self {
        self.reservations = Some(reservations);
        self
    }
    /// `[optional argument]`
    #[inline(always)]
    pub fn total_reservation_spots(&mut self, total_reservation_spots: u64) -> &mut Self {
        self.total_reservation_spots = Some(total_reservation_spots);
        self
    }
    #[inline(always)]
    pub fn offset(&mut self, offset: u64) -> &mut Self {
        self.offset = Some(offset);
        self
    }
    #[inline(always)]
    pub fn total_spot_offset(&mut self, total_spot_offset: u64) -> &mut Self {
        self.total_spot_offset = Some(total_spot_offset);
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
        let accounts = DeprecatedSetReservationList {
            master_edition: self.master_edition.expect("master_edition is not set"),
            reservation_list: self.reservation_list.expect("reservation_list is not set"),
            resource: self.resource.expect("resource is not set"),
        };
        let args = DeprecatedSetReservationListInstructionArgs {
            reservations: self.reservations.clone().expect("reservations is not set"),
            total_reservation_spots: self.total_reservation_spots.clone(),
            offset: self.offset.clone().expect("offset is not set"),
            total_spot_offset: self
                .total_spot_offset
                .clone()
                .expect("total_spot_offset is not set"),
        };

        accounts.instruction_with_remaining_accounts(args, &self.__remaining_accounts)
    }
}

/// `deprecated_set_reservation_list` CPI accounts.
pub struct DeprecatedSetReservationListCpiAccounts<'a, 'b> {
    /// Master Edition V1 key (pda of ['metadata', program id, mint id, 'edition'])
    pub master_edition: &'b solana_program::account_info::AccountInfo<'a>,
    /// PDA for ReservationList of ['metadata', program id, master edition key, 'reservation', resource-key]
    pub reservation_list: &'b solana_program::account_info::AccountInfo<'a>,
    /// The resource you tied the reservation list too
    pub resource: &'b solana_program::account_info::AccountInfo<'a>,
}

/// `deprecated_set_reservation_list` CPI instruction.
pub struct DeprecatedSetReservationListCpi<'a, 'b> {
    /// The program to invoke.
    pub __program: &'b solana_program::account_info::AccountInfo<'a>,
    /// Master Edition V1 key (pda of ['metadata', program id, mint id, 'edition'])
    pub master_edition: &'b solana_program::account_info::AccountInfo<'a>,
    /// PDA for ReservationList of ['metadata', program id, master edition key, 'reservation', resource-key]
    pub reservation_list: &'b solana_program::account_info::AccountInfo<'a>,
    /// The resource you tied the reservation list too
    pub resource: &'b solana_program::account_info::AccountInfo<'a>,
    /// The arguments for the instruction.
    pub __args: DeprecatedSetReservationListInstructionArgs,
}

impl<'a, 'b> DeprecatedSetReservationListCpi<'a, 'b> {
    pub fn new(
        program: &'b solana_program::account_info::AccountInfo<'a>,
        accounts: DeprecatedSetReservationListCpiAccounts<'a, 'b>,
        args: DeprecatedSetReservationListInstructionArgs,
    ) -> Self {
        Self {
            __program: program,
            master_edition: accounts.master_edition,
            reservation_list: accounts.reservation_list,
            resource: accounts.resource,
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
            *self.master_edition.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new(
            *self.reservation_list.key,
            false,
        ));
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.resource.key,
            true,
        ));
        remaining_accounts.iter().for_each(|remaining_account| {
            accounts.push(solana_program::instruction::AccountMeta {
                pubkey: *remaining_account.0.key,
                is_signer: remaining_account.1,
                is_writable: remaining_account.2,
            })
        });
        let mut data = DeprecatedSetReservationListInstructionData::new()
            .try_to_vec()
            .unwrap();
        let mut args = self.__args.try_to_vec().unwrap();
        data.append(&mut args);

        let instruction = solana_program::instruction::Instruction {
            program_id: crate::MPL_TOKEN_METADATA_ID,
            accounts,
            data,
        };
        let mut account_infos = Vec::with_capacity(3 + 1 + remaining_accounts.len());
        account_infos.push(self.__program.clone());
        account_infos.push(self.master_edition.clone());
        account_infos.push(self.reservation_list.clone());
        account_infos.push(self.resource.clone());
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

/// Instruction builder for `DeprecatedSetReservationList` via CPI.
///
/// ### Accounts:
///
///   0. `[writable]` master_edition
///   1. `[writable]` reservation_list
///   2. `[signer]` resource
pub struct DeprecatedSetReservationListCpiBuilder<'a, 'b> {
    instruction: Box<DeprecatedSetReservationListCpiBuilderInstruction<'a, 'b>>,
}

impl<'a, 'b> DeprecatedSetReservationListCpiBuilder<'a, 'b> {
    pub fn new(program: &'b solana_program::account_info::AccountInfo<'a>) -> Self {
        let instruction = Box::new(DeprecatedSetReservationListCpiBuilderInstruction {
            __program: program,
            master_edition: None,
            reservation_list: None,
            resource: None,
            reservations: None,
            total_reservation_spots: None,
            offset: None,
            total_spot_offset: None,
            __remaining_accounts: Vec::new(),
        });
        Self { instruction }
    }
    /// Master Edition V1 key (pda of ['metadata', program id, mint id, 'edition'])
    #[inline(always)]
    pub fn master_edition(
        &mut self,
        master_edition: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.master_edition = Some(master_edition);
        self
    }
    /// PDA for ReservationList of ['metadata', program id, master edition key, 'reservation', resource-key]
    #[inline(always)]
    pub fn reservation_list(
        &mut self,
        reservation_list: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.reservation_list = Some(reservation_list);
        self
    }
    /// The resource you tied the reservation list too
    #[inline(always)]
    pub fn resource(
        &mut self,
        resource: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.resource = Some(resource);
        self
    }
    #[inline(always)]
    pub fn reservations(&mut self, reservations: Vec<Reservation>) -> &mut Self {
        self.instruction.reservations = Some(reservations);
        self
    }
    /// `[optional argument]`
    #[inline(always)]
    pub fn total_reservation_spots(&mut self, total_reservation_spots: u64) -> &mut Self {
        self.instruction.total_reservation_spots = Some(total_reservation_spots);
        self
    }
    #[inline(always)]
    pub fn offset(&mut self, offset: u64) -> &mut Self {
        self.instruction.offset = Some(offset);
        self
    }
    #[inline(always)]
    pub fn total_spot_offset(&mut self, total_spot_offset: u64) -> &mut Self {
        self.instruction.total_spot_offset = Some(total_spot_offset);
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
        let args = DeprecatedSetReservationListInstructionArgs {
            reservations: self
                .instruction
                .reservations
                .clone()
                .expect("reservations is not set"),
            total_reservation_spots: self.instruction.total_reservation_spots.clone(),
            offset: self.instruction.offset.clone().expect("offset is not set"),
            total_spot_offset: self
                .instruction
                .total_spot_offset
                .clone()
                .expect("total_spot_offset is not set"),
        };
        let instruction = DeprecatedSetReservationListCpi {
            __program: self.instruction.__program,

            master_edition: self
                .instruction
                .master_edition
                .expect("master_edition is not set"),

            reservation_list: self
                .instruction
                .reservation_list
                .expect("reservation_list is not set"),

            resource: self.instruction.resource.expect("resource is not set"),
            __args: args,
        };
        instruction.invoke_signed_with_remaining_accounts(
            signers_seeds,
            &self.instruction.__remaining_accounts,
        )
    }
}

struct DeprecatedSetReservationListCpiBuilderInstruction<'a, 'b> {
    __program: &'b solana_program::account_info::AccountInfo<'a>,
    master_edition: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    reservation_list: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    resource: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    reservations: Option<Vec<Reservation>>,
    total_reservation_spots: Option<u64>,
    offset: Option<u64>,
    total_spot_offset: Option<u64>,
    /// Additional instruction accounts `(AccountInfo, is_writable, is_signer)`.
    __remaining_accounts: Vec<(
        &'b solana_program::account_info::AccountInfo<'a>,
        bool,
        bool,
    )>,
}
