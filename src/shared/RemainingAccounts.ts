import { ImportFrom } from './ImportFrom';
import { InstructionAccountDefault } from './InstructionDefault';
import { mainCase } from './utils';

export type RemainingAccounts =
  | {
      kind: 'list';
      accounts: {
        value: InstructionAccountDefault;
        isSigner: boolean | 'either';
        isWritable: boolean;
      }[];
    }
  | { kind: 'arg'; name: string; isWritable: boolean }
  | { kind: 'resolver'; name: string; importFrom: ImportFrom };

export const remainingAccountsFromList = (
  accounts: {
    value: InstructionAccountDefault;
    isSigner: boolean | 'either';
    isWritable: boolean;
  }[]
): RemainingAccounts => ({ kind: 'list', accounts });

export const remainingAccountsFromArg = (
  arg: string,
  isWritable: boolean = false
): RemainingAccounts => ({ kind: 'arg', name: mainCase(arg), isWritable });

export const remainingAccountsFromResolver = (
  name: string,
  importFrom: ImportFrom = 'hooked'
): RemainingAccounts => ({
  kind: 'resolver',
  name: mainCase(name),
  importFrom,
});
