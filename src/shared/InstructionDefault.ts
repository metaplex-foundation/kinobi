import { AccountNode, ValueNode, isPublicKeyTypeNode } from '../nodes';
import { ImportFrom } from './ImportFrom';
import { mainCase } from './utils';

export type InstructionDefault =
  | { kind: 'identity' }
  | { kind: 'payer' }
  | { kind: 'programId' }
  | { kind: 'program'; program: { name: string; publicKey: string } }
  | { kind: 'publicKey'; publicKey: string }
  | { kind: 'account'; name: string }
  | { kind: 'accountBump'; name: string }
  | { kind: 'arg'; name: string }
  | { kind: 'value'; value: ValueNode }
  | {
      kind: 'pda';
      pdaAccount: string;
      importFrom: ImportFrom;
      seeds: Record<string, InstructionSeedDefault>;
    }
  | {
      kind: 'resolver';
      name: string;
      importFrom: ImportFrom;
      dependsOn: InstructionDependency[];
      resolvedIsSigner?: boolean | 'either';
      resolvedIsOptional?: boolean;
    };

export type ExtractInstructionDefault<T extends InstructionDefault['kind']> =
  Extract<InstructionDefault, { kind: T }>;

export type InstructionAccountDefault = ExtractInstructionDefault<
  | 'programId'
  | 'program'
  | 'publicKey'
  | 'account'
  | 'identity'
  | 'payer'
  | 'pda'
  | 'resolver'
>;

export type InstructionArgDefault = InstructionDefault;

export type InstructionSeedDefault = ExtractInstructionDefault<
  'arg' | 'account' | 'value'
>;

export const identityDefault = (): ExtractInstructionDefault<'identity'> => ({
  kind: 'identity',
});

export const payerDefault = (): ExtractInstructionDefault<'payer'> => ({
  kind: 'payer',
});

export const programIdDefault = (): ExtractInstructionDefault<'programId'> => ({
  kind: 'programId',
});

export const programDefault = (
  name: string,
  publicKey: string
): ExtractInstructionDefault<'program'> => ({
  kind: 'program',
  program: { name: mainCase(name), publicKey },
});

export const publicKeyDefault = (
  publicKey: string
): ExtractInstructionDefault<'publicKey'> => ({
  kind: 'publicKey',
  publicKey,
});

export const accountDefault = (
  account: string
): ExtractInstructionDefault<'account'> => ({
  kind: 'account',
  name: mainCase(account),
});

export const accountBumpDefault = (
  account: string
): ExtractInstructionDefault<'accountBump'> => ({
  kind: 'accountBump',
  name: mainCase(account),
});

export const argDefault = (arg: string): ExtractInstructionDefault<'arg'> => ({
  kind: 'arg',
  name: mainCase(arg),
});

export const valueDefault = (
  value: ValueNode
): ExtractInstructionDefault<'value'> => ({ kind: 'value', value });

export const pdaDefault = (
  pdaAccount: string,
  options: {
    importFrom?: ImportFrom;
    seeds?: Record<string, InstructionSeedDefault>;
  } = {}
): ExtractInstructionDefault<'pda'> => ({
  kind: 'pda',
  pdaAccount: mainCase(pdaAccount),
  importFrom: options.importFrom ?? 'generated',
  seeds: options.seeds ?? {},
});

export const resolverDefault = (
  name: string,
  dependsOn: InstructionDependency[],
  options: {
    importFrom?: ImportFrom;
    resolvedIsSigner?: boolean | 'either';
    resolvedIsOptional?: boolean;
  } = {}
): ExtractInstructionDefault<'resolver'> => ({
  kind: 'resolver',
  name: mainCase(name),
  importFrom: options.importFrom ?? 'hooked',
  dependsOn,
  resolvedIsSigner: options.resolvedIsSigner,
  resolvedIsOptional: options.resolvedIsOptional,
});

export type InstructionDependency = { kind: 'account' | 'arg'; name: string };

export const dependsOnAccount = (account: string): InstructionDependency => ({
  kind: 'account',
  name: mainCase(account),
});

export const dependsOnArg = (arg: string): InstructionDependency => ({
  kind: 'arg',
  name: mainCase(arg),
});

export const getDefaultSeedsFromAccount = (
  node: AccountNode
): Record<string, InstructionSeedDefault> =>
  node.seeds.reduce((acc, seed) => {
    if (seed.kind !== 'variable') return acc;
    if (isPublicKeyTypeNode(seed.type)) {
      acc[seed.name] = { kind: 'account', name: seed.name };
    } else {
      acc[seed.name] = { kind: 'arg', name: seed.name };
    }
    return acc;
  }, {} as Record<string, InstructionSeedDefault>);
