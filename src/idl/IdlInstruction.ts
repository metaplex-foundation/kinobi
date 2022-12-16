import type { IdlType } from './IdlType';

export type IdlInstruction = {
  name: string;
  accounts: IdlInstructionAccount[];
  args: IdlInstructionArg[];
  defaultOptionalAccounts?: boolean;
  discriminant?: {
    type: IdlType;
    value: number;
  };
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
