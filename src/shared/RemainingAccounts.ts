import { ImportFrom } from './ImportFrom';
import { MainCaseString, mainCase } from './utils';

export type RemainingAccounts =
  | { kind: 'arg'; name: MainCaseString; isWritable: boolean }
  | { kind: 'resolver'; name: MainCaseString; importFrom: ImportFrom };

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
