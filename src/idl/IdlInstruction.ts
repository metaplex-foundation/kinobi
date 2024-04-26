import type { IdlType, IdlDiscriminator } from './IdlType';
import type { IdlInstructionPda } from './IdlPda';

export type IdlInstructionAccountItem =
  | IdlInstructionAccount
  | IdlInstructionNestedAccounts;

export type IdlInstructionAccounts = {
  name: string;
  accounts: IdlInstructionAccount[];
};

export type IdlInstruction = {
  name: string;
  docs?: string[];
  discriminant?: IdlInstructionDiscriminant;
  accounts: IdlInstructionAccountItem[];
  args: IdlInstructionArg[];
  defaultOptionalAccounts?: boolean;
  legacyOptionalAccountsStrategy?: boolean;
  returns?: IdlType;
};

export type IdlInstructionAccount = {
  name: string;
  isMut?: boolean;
  writable?: boolean;
  isSigner?: boolean;
  signer?: boolean;
  isOptionalSigner?: boolean;
  isOptional?: boolean;
  optional?: boolean;
  docs?: string[];
  desc?: string;
  address?: string;
  pda?: IdlInstructionPda;
  relationship?: string[];
};

export type IdlInstructionNestedAccounts = {
  name: string;
  accounts: IdlInstructionAccountItem[];
};

export type IdlInstructionArg = {
  name: string;
  type: IdlType;
  docs?: string[];
};

export type IdlInstructionDiscriminant =
  | IdlDiscriminator
  | {
      type: IdlType;
      value: number;
    };
