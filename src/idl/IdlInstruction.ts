import type { IdlType } from './IdlType';

export type IdlInstruction = {
  name: string;
  accounts: IdlInstructionAccount[];
  args: IdlInstructionArg[];
  defaultOptionalAccounts?: boolean;
  discriminant?: IdlInstructionDiscriminant;
};

export type IdlInstructionAccount = {
  name: string;
  isMut: boolean;
  isSigner: boolean;
  desc?: string;
  optional?: boolean;
};

export type IdlInstructionArg = {
  name: string;
  type: IdlType;
};

export type IdlInstructionDiscriminant = {
  type: IdlType;
  value: number;
};
