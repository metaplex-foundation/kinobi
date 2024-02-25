/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { Address } from '@solana/addresses';
import {
  Codec,
  Decoder,
  Encoder,
  combineCodec,
  mapEncoder,
} from '@solana/codecs-core';
import {
  getStructDecoder,
  getStructEncoder,
} from '@solana/codecs-data-structures';
import { getU8Decoder, getU8Encoder } from '@solana/codecs-numbers';
import { getStringDecoder, getStringEncoder } from '@solana/codecs-strings';
import {
  AccountRole,
  IAccountMeta,
  IInstruction,
  IInstructionWithAccounts,
  IInstructionWithData,
  ReadonlyAccount,
  ReadonlySignerAccount,
  WritableAccount,
  WritableSignerAccount,
} from '@solana/instructions';
import { IAccountSignerMeta, TransactionSigner } from '@solana/signers';
import {
  ResolvedAccount,
  accountMetaWithDefault,
  getAccountMetasWithSigners,
} from '../shared';
import {
  Operation,
  OperationArgs,
  Payload,
  PayloadArgs,
  getOperationDecoder,
  getOperationEncoder,
  getPayloadDecoder,
  getPayloadEncoder,
} from '../types';

export type ValidateInstruction<
  TProgram extends string = 'auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg',
  TAccountPayer extends string | IAccountMeta<string> = string,
  TAccountRuleSet extends string | IAccountMeta<string> = string,
  TAccountSystemProgram extends
    | string
    | IAccountMeta<string> = '11111111111111111111111111111111',
  TAccountOptRuleSigner1 extends
    | string
    | IAccountMeta<string>
    | undefined = undefined,
  TAccountOptRuleSigner2 extends
    | string
    | IAccountMeta<string>
    | undefined = undefined,
  TAccountOptRuleSigner3 extends
    | string
    | IAccountMeta<string>
    | undefined = undefined,
  TAccountOptRuleSigner4 extends
    | string
    | IAccountMeta<string>
    | undefined = undefined,
  TAccountOptRuleSigner5 extends
    | string
    | IAccountMeta<string>
    | undefined = undefined,
  TAccountOptRuleNonsigner1 extends
    | string
    | IAccountMeta<string>
    | undefined = undefined,
  TAccountOptRuleNonsigner2 extends
    | string
    | IAccountMeta<string>
    | undefined = undefined,
  TAccountOptRuleNonsigner3 extends
    | string
    | IAccountMeta<string>
    | undefined = undefined,
  TAccountOptRuleNonsigner4 extends
    | string
    | IAccountMeta<string>
    | undefined = undefined,
  TAccountOptRuleNonsigner5 extends
    | string
    | IAccountMeta<string>
    | undefined = undefined,
  TRemainingAccounts extends Array<IAccountMeta<string>> = []
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountPayer extends string
        ? WritableSignerAccount<TAccountPayer>
        : TAccountPayer,
      TAccountRuleSet extends string
        ? WritableAccount<TAccountRuleSet>
        : TAccountRuleSet,
      TAccountSystemProgram extends string
        ? ReadonlyAccount<TAccountSystemProgram>
        : TAccountSystemProgram,
      ...(TAccountOptRuleSigner1 extends undefined
        ? []
        : [
            TAccountOptRuleSigner1 extends string
              ? ReadonlyAccount<TAccountOptRuleSigner1>
              : TAccountOptRuleSigner1
          ]),
      ...(TAccountOptRuleSigner2 extends undefined
        ? []
        : [
            TAccountOptRuleSigner2 extends string
              ? ReadonlySignerAccount<TAccountOptRuleSigner2>
              : TAccountOptRuleSigner2
          ]),
      ...(TAccountOptRuleSigner3 extends undefined
        ? []
        : [
            TAccountOptRuleSigner3 extends string
              ? ReadonlySignerAccount<TAccountOptRuleSigner3>
              : TAccountOptRuleSigner3
          ]),
      ...(TAccountOptRuleSigner4 extends undefined
        ? []
        : [
            TAccountOptRuleSigner4 extends string
              ? ReadonlySignerAccount<TAccountOptRuleSigner4>
              : TAccountOptRuleSigner4
          ]),
      ...(TAccountOptRuleSigner5 extends undefined
        ? []
        : [
            TAccountOptRuleSigner5 extends string
              ? ReadonlySignerAccount<TAccountOptRuleSigner5>
              : TAccountOptRuleSigner5
          ]),
      ...(TAccountOptRuleNonsigner1 extends undefined
        ? []
        : [
            TAccountOptRuleNonsigner1 extends string
              ? ReadonlyAccount<TAccountOptRuleNonsigner1>
              : TAccountOptRuleNonsigner1
          ]),
      ...(TAccountOptRuleNonsigner2 extends undefined
        ? []
        : [
            TAccountOptRuleNonsigner2 extends string
              ? ReadonlyAccount<TAccountOptRuleNonsigner2>
              : TAccountOptRuleNonsigner2
          ]),
      ...(TAccountOptRuleNonsigner3 extends undefined
        ? []
        : [
            TAccountOptRuleNonsigner3 extends string
              ? ReadonlyAccount<TAccountOptRuleNonsigner3>
              : TAccountOptRuleNonsigner3
          ]),
      ...(TAccountOptRuleNonsigner4 extends undefined
        ? []
        : [
            TAccountOptRuleNonsigner4 extends string
              ? ReadonlyAccount<TAccountOptRuleNonsigner4>
              : TAccountOptRuleNonsigner4
          ]),
      ...(TAccountOptRuleNonsigner5 extends undefined
        ? []
        : [
            TAccountOptRuleNonsigner5 extends string
              ? ReadonlyAccount<TAccountOptRuleNonsigner5>
              : TAccountOptRuleNonsigner5
          ]),
      ...TRemainingAccounts
    ]
  >;

export type ValidateInstructionWithSigners<
  TProgram extends string = 'auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg',
  TAccountPayer extends string | IAccountMeta<string> = string,
  TAccountRuleSet extends string | IAccountMeta<string> = string,
  TAccountSystemProgram extends
    | string
    | IAccountMeta<string> = '11111111111111111111111111111111',
  TAccountOptRuleSigner1 extends
    | string
    | IAccountMeta<string>
    | undefined = undefined,
  TAccountOptRuleSigner2 extends
    | string
    | IAccountMeta<string>
    | undefined = undefined,
  TAccountOptRuleSigner3 extends
    | string
    | IAccountMeta<string>
    | undefined = undefined,
  TAccountOptRuleSigner4 extends
    | string
    | IAccountMeta<string>
    | undefined = undefined,
  TAccountOptRuleSigner5 extends
    | string
    | IAccountMeta<string>
    | undefined = undefined,
  TAccountOptRuleNonsigner1 extends
    | string
    | IAccountMeta<string>
    | undefined = undefined,
  TAccountOptRuleNonsigner2 extends
    | string
    | IAccountMeta<string>
    | undefined = undefined,
  TAccountOptRuleNonsigner3 extends
    | string
    | IAccountMeta<string>
    | undefined = undefined,
  TAccountOptRuleNonsigner4 extends
    | string
    | IAccountMeta<string>
    | undefined = undefined,
  TAccountOptRuleNonsigner5 extends
    | string
    | IAccountMeta<string>
    | undefined = undefined,
  TRemainingAccounts extends Array<IAccountMeta<string>> = []
> = IInstruction<TProgram> &
  IInstructionWithData<Uint8Array> &
  IInstructionWithAccounts<
    [
      TAccountPayer extends string
        ? WritableSignerAccount<TAccountPayer> &
            IAccountSignerMeta<TAccountPayer>
        : TAccountPayer,
      TAccountRuleSet extends string
        ? WritableAccount<TAccountRuleSet>
        : TAccountRuleSet,
      TAccountSystemProgram extends string
        ? ReadonlyAccount<TAccountSystemProgram>
        : TAccountSystemProgram,
      ...(TAccountOptRuleSigner1 extends undefined
        ? []
        : [
            TAccountOptRuleSigner1 extends string
              ? ReadonlyAccount<TAccountOptRuleSigner1>
              : TAccountOptRuleSigner1
          ]),
      ...(TAccountOptRuleSigner2 extends undefined
        ? []
        : [
            TAccountOptRuleSigner2 extends string
              ? ReadonlySignerAccount<TAccountOptRuleSigner2> &
                  IAccountSignerMeta<TAccountOptRuleSigner2>
              : TAccountOptRuleSigner2
          ]),
      ...(TAccountOptRuleSigner3 extends undefined
        ? []
        : [
            TAccountOptRuleSigner3 extends string
              ? ReadonlySignerAccount<TAccountOptRuleSigner3> &
                  IAccountSignerMeta<TAccountOptRuleSigner3>
              : TAccountOptRuleSigner3
          ]),
      ...(TAccountOptRuleSigner4 extends undefined
        ? []
        : [
            TAccountOptRuleSigner4 extends string
              ? ReadonlySignerAccount<TAccountOptRuleSigner4> &
                  IAccountSignerMeta<TAccountOptRuleSigner4>
              : TAccountOptRuleSigner4
          ]),
      ...(TAccountOptRuleSigner5 extends undefined
        ? []
        : [
            TAccountOptRuleSigner5 extends string
              ? ReadonlySignerAccount<TAccountOptRuleSigner5> &
                  IAccountSignerMeta<TAccountOptRuleSigner5>
              : TAccountOptRuleSigner5
          ]),
      ...(TAccountOptRuleNonsigner1 extends undefined
        ? []
        : [
            TAccountOptRuleNonsigner1 extends string
              ? ReadonlyAccount<TAccountOptRuleNonsigner1>
              : TAccountOptRuleNonsigner1
          ]),
      ...(TAccountOptRuleNonsigner2 extends undefined
        ? []
        : [
            TAccountOptRuleNonsigner2 extends string
              ? ReadonlyAccount<TAccountOptRuleNonsigner2>
              : TAccountOptRuleNonsigner2
          ]),
      ...(TAccountOptRuleNonsigner3 extends undefined
        ? []
        : [
            TAccountOptRuleNonsigner3 extends string
              ? ReadonlyAccount<TAccountOptRuleNonsigner3>
              : TAccountOptRuleNonsigner3
          ]),
      ...(TAccountOptRuleNonsigner4 extends undefined
        ? []
        : [
            TAccountOptRuleNonsigner4 extends string
              ? ReadonlyAccount<TAccountOptRuleNonsigner4>
              : TAccountOptRuleNonsigner4
          ]),
      ...(TAccountOptRuleNonsigner5 extends undefined
        ? []
        : [
            TAccountOptRuleNonsigner5 extends string
              ? ReadonlyAccount<TAccountOptRuleNonsigner5>
              : TAccountOptRuleNonsigner5
          ]),
      ...TRemainingAccounts
    ]
  >;

export type ValidateInstructionData = {
  discriminator: number;
  ruleSetName: string;
  operation: Operation;
  payload: Payload;
};

export type ValidateInstructionDataArgs = {
  ruleSetName: string;
  operation: OperationArgs;
  payload: PayloadArgs;
};

export function getValidateInstructionDataEncoder(): Encoder<ValidateInstructionDataArgs> {
  return mapEncoder(
    getStructEncoder([
      ['discriminator', getU8Encoder()],
      ['ruleSetName', getStringEncoder()],
      ['operation', getOperationEncoder()],
      ['payload', getPayloadEncoder()],
    ]),
    (value) => ({ ...value, discriminator: 1 })
  );
}

export function getValidateInstructionDataDecoder(): Decoder<ValidateInstructionData> {
  return getStructDecoder([
    ['discriminator', getU8Decoder()],
    ['ruleSetName', getStringDecoder()],
    ['operation', getOperationDecoder()],
    ['payload', getPayloadDecoder()],
  ]);
}

export function getValidateInstructionDataCodec(): Codec<
  ValidateInstructionDataArgs,
  ValidateInstructionData
> {
  return combineCodec(
    getValidateInstructionDataEncoder(),
    getValidateInstructionDataDecoder()
  );
}

export type ValidateInput<
  TAccountPayer extends string,
  TAccountRuleSet extends string,
  TAccountSystemProgram extends string,
  TAccountOptRuleSigner1 extends string,
  TAccountOptRuleSigner2 extends string,
  TAccountOptRuleSigner3 extends string,
  TAccountOptRuleSigner4 extends string,
  TAccountOptRuleSigner5 extends string,
  TAccountOptRuleNonsigner1 extends string,
  TAccountOptRuleNonsigner2 extends string,
  TAccountOptRuleNonsigner3 extends string,
  TAccountOptRuleNonsigner4 extends string,
  TAccountOptRuleNonsigner5 extends string
> = {
  /** Payer and creator of the RuleSet */
  payer: Address<TAccountPayer>;
  /** The PDA account where the RuleSet is stored */
  ruleSet: Address<TAccountRuleSet>;
  /** System program */
  systemProgram?: Address<TAccountSystemProgram>;
  optRuleSigner1?: Address<TAccountOptRuleSigner1>;
  /** Optional rule validation signer 2 */
  optRuleSigner2?: Address<TAccountOptRuleSigner2>;
  /** Optional rule validation signer 3 */
  optRuleSigner3?: Address<TAccountOptRuleSigner3>;
  /** Optional rule validation signer 4 */
  optRuleSigner4?: Address<TAccountOptRuleSigner4>;
  /** Optional rule validation signer 5 */
  optRuleSigner5?: Address<TAccountOptRuleSigner5>;
  /** Optional rule validation non-signer 1 */
  optRuleNonsigner1?: Address<TAccountOptRuleNonsigner1>;
  /** Optional rule validation non-signer 2 */
  optRuleNonsigner2?: Address<TAccountOptRuleNonsigner2>;
  /** Optional rule validation non-signer 3 */
  optRuleNonsigner3?: Address<TAccountOptRuleNonsigner3>;
  /** Optional rule validation non-signer 4 */
  optRuleNonsigner4?: Address<TAccountOptRuleNonsigner4>;
  /** Optional rule validation non-signer 5 */
  optRuleNonsigner5?: Address<TAccountOptRuleNonsigner5>;
  ruleSetName: ValidateInstructionDataArgs['ruleSetName'];
  operation: ValidateInstructionDataArgs['operation'];
  payload: ValidateInstructionDataArgs['payload'];
};

export type ValidateInputWithSigners<
  TAccountPayer extends string,
  TAccountRuleSet extends string,
  TAccountSystemProgram extends string,
  TAccountOptRuleSigner1 extends string,
  TAccountOptRuleSigner2 extends string,
  TAccountOptRuleSigner3 extends string,
  TAccountOptRuleSigner4 extends string,
  TAccountOptRuleSigner5 extends string,
  TAccountOptRuleNonsigner1 extends string,
  TAccountOptRuleNonsigner2 extends string,
  TAccountOptRuleNonsigner3 extends string,
  TAccountOptRuleNonsigner4 extends string,
  TAccountOptRuleNonsigner5 extends string
> = {
  /** Payer and creator of the RuleSet */
  payer: TransactionSigner<TAccountPayer>;
  /** The PDA account where the RuleSet is stored */
  ruleSet: Address<TAccountRuleSet>;
  /** System program */
  systemProgram?: Address<TAccountSystemProgram>;
  optRuleSigner1?:
    | Address<TAccountOptRuleSigner1>
    | TransactionSigner<TAccountOptRuleSigner1>;
  /** Optional rule validation signer 2 */
  optRuleSigner2?: TransactionSigner<TAccountOptRuleSigner2>;
  /** Optional rule validation signer 3 */
  optRuleSigner3?: TransactionSigner<TAccountOptRuleSigner3>;
  /** Optional rule validation signer 4 */
  optRuleSigner4?: TransactionSigner<TAccountOptRuleSigner4>;
  /** Optional rule validation signer 5 */
  optRuleSigner5?: TransactionSigner<TAccountOptRuleSigner5>;
  /** Optional rule validation non-signer 1 */
  optRuleNonsigner1?: Address<TAccountOptRuleNonsigner1>;
  /** Optional rule validation non-signer 2 */
  optRuleNonsigner2?: Address<TAccountOptRuleNonsigner2>;
  /** Optional rule validation non-signer 3 */
  optRuleNonsigner3?: Address<TAccountOptRuleNonsigner3>;
  /** Optional rule validation non-signer 4 */
  optRuleNonsigner4?: Address<TAccountOptRuleNonsigner4>;
  /** Optional rule validation non-signer 5 */
  optRuleNonsigner5?: Address<TAccountOptRuleNonsigner5>;
  ruleSetName: ValidateInstructionDataArgs['ruleSetName'];
  operation: ValidateInstructionDataArgs['operation'];
  payload: ValidateInstructionDataArgs['payload'];
};

export function getValidateInstruction<
  TAccountPayer extends string,
  TAccountRuleSet extends string,
  TAccountSystemProgram extends string,
  TAccountOptRuleSigner1 extends string,
  TAccountOptRuleSigner2 extends string,
  TAccountOptRuleSigner3 extends string,
  TAccountOptRuleSigner4 extends string,
  TAccountOptRuleSigner5 extends string,
  TAccountOptRuleNonsigner1 extends string,
  TAccountOptRuleNonsigner2 extends string,
  TAccountOptRuleNonsigner3 extends string,
  TAccountOptRuleNonsigner4 extends string,
  TAccountOptRuleNonsigner5 extends string,
  TProgram extends string = 'auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg'
>(
  input: ValidateInputWithSigners<
    TAccountPayer,
    TAccountRuleSet,
    TAccountSystemProgram,
    TAccountOptRuleSigner1,
    TAccountOptRuleSigner2,
    TAccountOptRuleSigner3,
    TAccountOptRuleSigner4,
    TAccountOptRuleSigner5,
    TAccountOptRuleNonsigner1,
    TAccountOptRuleNonsigner2,
    TAccountOptRuleNonsigner3,
    TAccountOptRuleNonsigner4,
    TAccountOptRuleNonsigner5
  >
): ValidateInstructionWithSigners<
  TProgram,
  TAccountPayer,
  TAccountRuleSet,
  TAccountSystemProgram,
  typeof input['optRuleSigner1'] extends TransactionSigner<TAccountOptRuleSigner1>
    ? ReadonlySignerAccount<TAccountOptRuleSigner1> &
        IAccountSignerMeta<TAccountOptRuleSigner1>
    : TAccountOptRuleSigner1,
  TAccountOptRuleSigner2,
  TAccountOptRuleSigner3,
  TAccountOptRuleSigner4,
  TAccountOptRuleSigner5,
  TAccountOptRuleNonsigner1,
  TAccountOptRuleNonsigner2,
  TAccountOptRuleNonsigner3,
  TAccountOptRuleNonsigner4,
  TAccountOptRuleNonsigner5
>;
export function getValidateInstruction<
  TAccountPayer extends string,
  TAccountRuleSet extends string,
  TAccountSystemProgram extends string,
  TAccountOptRuleSigner1 extends string,
  TAccountOptRuleSigner2 extends string,
  TAccountOptRuleSigner3 extends string,
  TAccountOptRuleSigner4 extends string,
  TAccountOptRuleSigner5 extends string,
  TAccountOptRuleNonsigner1 extends string,
  TAccountOptRuleNonsigner2 extends string,
  TAccountOptRuleNonsigner3 extends string,
  TAccountOptRuleNonsigner4 extends string,
  TAccountOptRuleNonsigner5 extends string,
  TProgram extends string = 'auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg'
>(
  input: ValidateInput<
    TAccountPayer,
    TAccountRuleSet,
    TAccountSystemProgram,
    TAccountOptRuleSigner1,
    TAccountOptRuleSigner2,
    TAccountOptRuleSigner3,
    TAccountOptRuleSigner4,
    TAccountOptRuleSigner5,
    TAccountOptRuleNonsigner1,
    TAccountOptRuleNonsigner2,
    TAccountOptRuleNonsigner3,
    TAccountOptRuleNonsigner4,
    TAccountOptRuleNonsigner5
  >
): ValidateInstruction<
  TProgram,
  TAccountPayer,
  TAccountRuleSet,
  TAccountSystemProgram,
  TAccountOptRuleSigner1,
  TAccountOptRuleSigner2,
  TAccountOptRuleSigner3,
  TAccountOptRuleSigner4,
  TAccountOptRuleSigner5,
  TAccountOptRuleNonsigner1,
  TAccountOptRuleNonsigner2,
  TAccountOptRuleNonsigner3,
  TAccountOptRuleNonsigner4,
  TAccountOptRuleNonsigner5
>;
export function getValidateInstruction<
  TAccountPayer extends string,
  TAccountRuleSet extends string,
  TAccountSystemProgram extends string,
  TAccountOptRuleSigner1 extends string,
  TAccountOptRuleSigner2 extends string,
  TAccountOptRuleSigner3 extends string,
  TAccountOptRuleSigner4 extends string,
  TAccountOptRuleSigner5 extends string,
  TAccountOptRuleNonsigner1 extends string,
  TAccountOptRuleNonsigner2 extends string,
  TAccountOptRuleNonsigner3 extends string,
  TAccountOptRuleNonsigner4 extends string,
  TAccountOptRuleNonsigner5 extends string,
  TProgram extends string = 'auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg'
>(
  input: ValidateInput<
    TAccountPayer,
    TAccountRuleSet,
    TAccountSystemProgram,
    TAccountOptRuleSigner1,
    TAccountOptRuleSigner2,
    TAccountOptRuleSigner3,
    TAccountOptRuleSigner4,
    TAccountOptRuleSigner5,
    TAccountOptRuleNonsigner1,
    TAccountOptRuleNonsigner2,
    TAccountOptRuleNonsigner3,
    TAccountOptRuleNonsigner4,
    TAccountOptRuleNonsigner5
  >
): IInstruction {
  // Program address.
  const programAddress =
    'auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg' as Address<'auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg'>;

  // Original accounts.
  type AccountMetas = Parameters<
    typeof getValidateInstructionRaw<
      TProgram,
      TAccountPayer,
      TAccountRuleSet,
      TAccountSystemProgram,
      TAccountOptRuleSigner1,
      TAccountOptRuleSigner2,
      TAccountOptRuleSigner3,
      TAccountOptRuleSigner4,
      TAccountOptRuleSigner5,
      TAccountOptRuleNonsigner1,
      TAccountOptRuleNonsigner2,
      TAccountOptRuleNonsigner3,
      TAccountOptRuleNonsigner4,
      TAccountOptRuleNonsigner5
    >
  >[0];
  const accounts: Record<keyof AccountMetas, ResolvedAccount> = {
    payer: { value: input.payer ?? null, isWritable: true },
    ruleSet: { value: input.ruleSet ?? null, isWritable: true },
    systemProgram: { value: input.systemProgram ?? null, isWritable: false },
    optRuleSigner1: { value: input.optRuleSigner1 ?? null, isWritable: false },
    optRuleSigner2: { value: input.optRuleSigner2 ?? null, isWritable: false },
    optRuleSigner3: { value: input.optRuleSigner3 ?? null, isWritable: false },
    optRuleSigner4: { value: input.optRuleSigner4 ?? null, isWritable: false },
    optRuleSigner5: { value: input.optRuleSigner5 ?? null, isWritable: false },
    optRuleNonsigner1: {
      value: input.optRuleNonsigner1 ?? null,
      isWritable: false,
    },
    optRuleNonsigner2: {
      value: input.optRuleNonsigner2 ?? null,
      isWritable: false,
    },
    optRuleNonsigner3: {
      value: input.optRuleNonsigner3 ?? null,
      isWritable: false,
    },
    optRuleNonsigner4: {
      value: input.optRuleNonsigner4 ?? null,
      isWritable: false,
    },
    optRuleNonsigner5: {
      value: input.optRuleNonsigner5 ?? null,
      isWritable: false,
    },
  };

  // Original args.
  const args = { ...input };

  // Resolve default values.
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value =
      '11111111111111111111111111111111' as Address<'11111111111111111111111111111111'>;
  }

  // Get account metas and signers.
  const accountMetas = getAccountMetasWithSigners(
    accounts,
    'programId',
    programAddress
  );

  const instruction = getValidateInstructionRaw(
    accountMetas as Record<keyof AccountMetas, IAccountMeta>,
    args as ValidateInstructionDataArgs,
    programAddress
  );

  return instruction;
}

export function getValidateInstructionRaw<
  TProgram extends string = 'auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg',
  TAccountPayer extends string | IAccountMeta<string> = string,
  TAccountRuleSet extends string | IAccountMeta<string> = string,
  TAccountSystemProgram extends
    | string
    | IAccountMeta<string> = '11111111111111111111111111111111',
  TAccountOptRuleSigner1 extends
    | string
    | IAccountMeta<string>
    | undefined = undefined,
  TAccountOptRuleSigner2 extends
    | string
    | IAccountMeta<string>
    | undefined = undefined,
  TAccountOptRuleSigner3 extends
    | string
    | IAccountMeta<string>
    | undefined = undefined,
  TAccountOptRuleSigner4 extends
    | string
    | IAccountMeta<string>
    | undefined = undefined,
  TAccountOptRuleSigner5 extends
    | string
    | IAccountMeta<string>
    | undefined = undefined,
  TAccountOptRuleNonsigner1 extends
    | string
    | IAccountMeta<string>
    | undefined = undefined,
  TAccountOptRuleNonsigner2 extends
    | string
    | IAccountMeta<string>
    | undefined = undefined,
  TAccountOptRuleNonsigner3 extends
    | string
    | IAccountMeta<string>
    | undefined = undefined,
  TAccountOptRuleNonsigner4 extends
    | string
    | IAccountMeta<string>
    | undefined = undefined,
  TAccountOptRuleNonsigner5 extends
    | string
    | IAccountMeta<string>
    | undefined = undefined,
  TRemainingAccounts extends Array<IAccountMeta<string>> = []
>(
  accounts: {
    payer: TAccountPayer extends string
      ? Address<TAccountPayer>
      : TAccountPayer;
    ruleSet: TAccountRuleSet extends string
      ? Address<TAccountRuleSet>
      : TAccountRuleSet;
    systemProgram?: TAccountSystemProgram extends string
      ? Address<TAccountSystemProgram>
      : TAccountSystemProgram;
    optRuleSigner1?: TAccountOptRuleSigner1 extends string
      ? Address<TAccountOptRuleSigner1>
      : TAccountOptRuleSigner1;
    optRuleSigner2?: TAccountOptRuleSigner2 extends string
      ? Address<TAccountOptRuleSigner2>
      : TAccountOptRuleSigner2;
    optRuleSigner3?: TAccountOptRuleSigner3 extends string
      ? Address<TAccountOptRuleSigner3>
      : TAccountOptRuleSigner3;
    optRuleSigner4?: TAccountOptRuleSigner4 extends string
      ? Address<TAccountOptRuleSigner4>
      : TAccountOptRuleSigner4;
    optRuleSigner5?: TAccountOptRuleSigner5 extends string
      ? Address<TAccountOptRuleSigner5>
      : TAccountOptRuleSigner5;
    optRuleNonsigner1?: TAccountOptRuleNonsigner1 extends string
      ? Address<TAccountOptRuleNonsigner1>
      : TAccountOptRuleNonsigner1;
    optRuleNonsigner2?: TAccountOptRuleNonsigner2 extends string
      ? Address<TAccountOptRuleNonsigner2>
      : TAccountOptRuleNonsigner2;
    optRuleNonsigner3?: TAccountOptRuleNonsigner3 extends string
      ? Address<TAccountOptRuleNonsigner3>
      : TAccountOptRuleNonsigner3;
    optRuleNonsigner4?: TAccountOptRuleNonsigner4 extends string
      ? Address<TAccountOptRuleNonsigner4>
      : TAccountOptRuleNonsigner4;
    optRuleNonsigner5?: TAccountOptRuleNonsigner5 extends string
      ? Address<TAccountOptRuleNonsigner5>
      : TAccountOptRuleNonsigner5;
  },
  args: ValidateInstructionDataArgs,
  programAddress: Address<TProgram> = 'auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg' as Address<TProgram>,
  remainingAccounts?: TRemainingAccounts
) {
  return {
    accounts: [
      accountMetaWithDefault(accounts.payer, AccountRole.WRITABLE_SIGNER),
      accountMetaWithDefault(accounts.ruleSet, AccountRole.WRITABLE),
      accountMetaWithDefault(
        accounts.systemProgram ??
          ('11111111111111111111111111111111' as Address<'11111111111111111111111111111111'>),
        AccountRole.READONLY
      ),
      accountMetaWithDefault(accounts.optRuleSigner1, AccountRole.READONLY),
      accountMetaWithDefault(
        accounts.optRuleSigner2,
        AccountRole.READONLY_SIGNER
      ),
      accountMetaWithDefault(
        accounts.optRuleSigner3,
        AccountRole.READONLY_SIGNER
      ),
      accountMetaWithDefault(
        accounts.optRuleSigner4,
        AccountRole.READONLY_SIGNER
      ),
      accountMetaWithDefault(
        accounts.optRuleSigner5,
        AccountRole.READONLY_SIGNER
      ),
      accountMetaWithDefault(accounts.optRuleNonsigner1, AccountRole.READONLY),
      accountMetaWithDefault(accounts.optRuleNonsigner2, AccountRole.READONLY),
      accountMetaWithDefault(accounts.optRuleNonsigner3, AccountRole.READONLY),
      accountMetaWithDefault(accounts.optRuleNonsigner4, AccountRole.READONLY),
      accountMetaWithDefault(accounts.optRuleNonsigner5, AccountRole.READONLY),
      ...(remainingAccounts ?? []),
    ].filter(<T>(x: T | undefined): x is T => x !== undefined),
    data: getValidateInstructionDataEncoder().encode(args),
    programAddress,
  } as ValidateInstruction<
    TProgram,
    TAccountPayer,
    TAccountRuleSet,
    TAccountSystemProgram,
    TAccountOptRuleSigner1,
    TAccountOptRuleSigner2,
    TAccountOptRuleSigner3,
    TAccountOptRuleSigner4,
    TAccountOptRuleSigner5,
    TAccountOptRuleNonsigner1,
    TAccountOptRuleNonsigner2,
    TAccountOptRuleNonsigner3,
    TAccountOptRuleNonsigner4,
    TAccountOptRuleNonsigner5,
    TRemainingAccounts
  >;
}

export type ParsedValidateInstruction<
  TProgram extends string = 'auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg',
  TAccountMetas extends readonly IAccountMeta[] = readonly IAccountMeta[]
> = {
  programAddress: Address<TProgram>;
  accounts: {
    /** Payer and creator of the RuleSet */
    payer: TAccountMetas[0];
    /** The PDA account where the RuleSet is stored */
    ruleSet: TAccountMetas[1];
    /** System program */
    systemProgram: TAccountMetas[2];
    optRuleSigner1?: TAccountMetas[3] | undefined;
    /** Optional rule validation signer 2 */
    optRuleSigner2?: TAccountMetas[4] | undefined;
    /** Optional rule validation signer 3 */
    optRuleSigner3?: TAccountMetas[5] | undefined;
    /** Optional rule validation signer 4 */
    optRuleSigner4?: TAccountMetas[6] | undefined;
    /** Optional rule validation signer 5 */
    optRuleSigner5?: TAccountMetas[7] | undefined;
    /** Optional rule validation non-signer 1 */
    optRuleNonsigner1?: TAccountMetas[8] | undefined;
    /** Optional rule validation non-signer 2 */
    optRuleNonsigner2?: TAccountMetas[9] | undefined;
    /** Optional rule validation non-signer 3 */
    optRuleNonsigner3?: TAccountMetas[10] | undefined;
    /** Optional rule validation non-signer 4 */
    optRuleNonsigner4?: TAccountMetas[11] | undefined;
    /** Optional rule validation non-signer 5 */
    optRuleNonsigner5?: TAccountMetas[12] | undefined;
  };
  data: ValidateInstructionData;
};

export function parseValidateInstruction<
  TProgram extends string,
  TAccountMetas extends readonly IAccountMeta[]
>(
  instruction: IInstruction<TProgram> &
    IInstructionWithAccounts<TAccountMetas> &
    IInstructionWithData<Uint8Array>
): ParsedValidateInstruction<TProgram, TAccountMetas> {
  if (instruction.accounts.length < 3) {
    // TODO: Coded error.
    throw new Error('Not enough accounts');
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts![accountIndex]!;
    accountIndex += 1;
    return accountMeta;
  };
  let optionalAccountsRemaining = instruction.accounts.length - 3;
  const getNextOptionalAccount = () => {
    if (optionalAccountsRemaining === 0) return undefined;
    optionalAccountsRemaining -= 1;
    return getNextAccount();
  };
  return {
    programAddress: instruction.programAddress,
    accounts: {
      payer: getNextAccount(),
      ruleSet: getNextAccount(),
      systemProgram: getNextAccount(),
      optRuleSigner1: getNextOptionalAccount(),
      optRuleSigner2: getNextOptionalAccount(),
      optRuleSigner3: getNextOptionalAccount(),
      optRuleSigner4: getNextOptionalAccount(),
      optRuleSigner5: getNextOptionalAccount(),
      optRuleNonsigner1: getNextOptionalAccount(),
      optRuleNonsigner2: getNextOptionalAccount(),
      optRuleNonsigner3: getNextOptionalAccount(),
      optRuleNonsigner4: getNextOptionalAccount(),
      optRuleNonsigner5: getNextOptionalAccount(),
    },
    data: getValidateInstructionDataDecoder().decode(instruction.data),
  };
}
