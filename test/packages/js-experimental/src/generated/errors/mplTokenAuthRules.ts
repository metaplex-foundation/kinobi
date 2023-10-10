/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { Program, ProgramError } from '@metaplex-foundation/umi';

type ProgramErrorConstructor = new (
  program: Program,
  cause?: Error
) => ProgramError;
const codeToErrorMap: Map<number, ProgramErrorConstructor> = new Map();
const nameToErrorMap: Map<string, ProgramErrorConstructor> = new Map();

/** NumericalOverflow: Numerical Overflow */
export class TaNumericalOverflowError extends ProgramError {
  override readonly name: string = 'NumericalOverflow';

  readonly code: number = 0x0; // 0

  constructor(program: Program, cause?: Error) {
    super('Numerical Overflow', program, cause);
  }
}
codeToErrorMap.set(0x0, TaNumericalOverflowError);
nameToErrorMap.set('NumericalOverflow', TaNumericalOverflowError);

/** DataTypeMismatch: Data type mismatch */
export class TaDataTypeMismatchError extends ProgramError {
  override readonly name: string = 'DataTypeMismatch';

  readonly code: number = 0x1; // 1

  constructor(program: Program, cause?: Error) {
    super('Data type mismatch', program, cause);
  }
}
codeToErrorMap.set(0x1, TaDataTypeMismatchError);
nameToErrorMap.set('DataTypeMismatch', TaDataTypeMismatchError);

/** IncorrectOwner: Incorrect account owner */
export class TaIncorrectOwnerError extends ProgramError {
  override readonly name: string = 'IncorrectOwner';

  readonly code: number = 0x2; // 2

  constructor(program: Program, cause?: Error) {
    super('Incorrect account owner', program, cause);
  }
}
codeToErrorMap.set(0x2, TaIncorrectOwnerError);
nameToErrorMap.set('IncorrectOwner', TaIncorrectOwnerError);

/** PayloadVecIndexError: Could not index into PayloadVec */
export class TaPayloadVecIndexErrorError extends ProgramError {
  override readonly name: string = 'PayloadVecIndexError';

  readonly code: number = 0x3; // 3

  constructor(program: Program, cause?: Error) {
    super('Could not index into PayloadVec', program, cause);
  }
}
codeToErrorMap.set(0x3, TaPayloadVecIndexErrorError);
nameToErrorMap.set('PayloadVecIndexError', TaPayloadVecIndexErrorError);

/** DerivedKeyInvalid: Derived key invalid */
export class TaDerivedKeyInvalidError extends ProgramError {
  override readonly name: string = 'DerivedKeyInvalid';

  readonly code: number = 0x4; // 4

  constructor(program: Program, cause?: Error) {
    super('Derived key invalid', program, cause);
  }
}
codeToErrorMap.set(0x4, TaDerivedKeyInvalidError);
nameToErrorMap.set('DerivedKeyInvalid', TaDerivedKeyInvalidError);

/** AdditionalSignerCheckFailed: Additional Signer check failed */
export class TaAdditionalSignerCheckFailedError extends ProgramError {
  override readonly name: string = 'AdditionalSignerCheckFailed';

  readonly code: number = 0x5; // 5

  constructor(program: Program, cause?: Error) {
    super('Additional Signer check failed', program, cause);
  }
}
codeToErrorMap.set(0x5, TaAdditionalSignerCheckFailedError);
nameToErrorMap.set(
  'AdditionalSignerCheckFailed',
  TaAdditionalSignerCheckFailedError
);

/** PubkeyMatchCheckFailed: Pubkey Match check failed */
export class TaPubkeyMatchCheckFailedError extends ProgramError {
  override readonly name: string = 'PubkeyMatchCheckFailed';

  readonly code: number = 0x6; // 6

  constructor(program: Program, cause?: Error) {
    super('Pubkey Match check failed', program, cause);
  }
}
codeToErrorMap.set(0x6, TaPubkeyMatchCheckFailedError);
nameToErrorMap.set('PubkeyMatchCheckFailed', TaPubkeyMatchCheckFailedError);

/** DerivedKeyMatchCheckFailed: Derived Key Match check failed */
export class TaDerivedKeyMatchCheckFailedError extends ProgramError {
  override readonly name: string = 'DerivedKeyMatchCheckFailed';

  readonly code: number = 0x7; // 7

  constructor(program: Program, cause?: Error) {
    super('Derived Key Match check failed', program, cause);
  }
}
codeToErrorMap.set(0x7, TaDerivedKeyMatchCheckFailedError);
nameToErrorMap.set(
  'DerivedKeyMatchCheckFailed',
  TaDerivedKeyMatchCheckFailedError
);

/** ProgramOwnedCheckFailed: Program Owned check failed */
export class TaProgramOwnedCheckFailedError extends ProgramError {
  override readonly name: string = 'ProgramOwnedCheckFailed';

  readonly code: number = 0x8; // 8

  constructor(program: Program, cause?: Error) {
    super('Program Owned check failed', program, cause);
  }
}
codeToErrorMap.set(0x8, TaProgramOwnedCheckFailedError);
nameToErrorMap.set('ProgramOwnedCheckFailed', TaProgramOwnedCheckFailedError);

/** AmountCheckFailed: Amount checked failed */
export class TaAmountCheckFailedError extends ProgramError {
  override readonly name: string = 'AmountCheckFailed';

  readonly code: number = 0x9; // 9

  constructor(program: Program, cause?: Error) {
    super('Amount checked failed', program, cause);
  }
}
codeToErrorMap.set(0x9, TaAmountCheckFailedError);
nameToErrorMap.set('AmountCheckFailed', TaAmountCheckFailedError);

/** FrequencyCheckFailed: Frequency check failed */
export class TaFrequencyCheckFailedError extends ProgramError {
  override readonly name: string = 'FrequencyCheckFailed';

  readonly code: number = 0xa; // 10

  constructor(program: Program, cause?: Error) {
    super('Frequency check failed', program, cause);
  }
}
codeToErrorMap.set(0xa, TaFrequencyCheckFailedError);
nameToErrorMap.set('FrequencyCheckFailed', TaFrequencyCheckFailedError);

/** PubkeyTreeMatchCheckFailed: Pubkey Tree Match check failed */
export class TaPubkeyTreeMatchCheckFailedError extends ProgramError {
  override readonly name: string = 'PubkeyTreeMatchCheckFailed';

  readonly code: number = 0xb; // 11

  constructor(program: Program, cause?: Error) {
    super('Pubkey Tree Match check failed', program, cause);
  }
}
codeToErrorMap.set(0xb, TaPubkeyTreeMatchCheckFailedError);
nameToErrorMap.set(
  'PubkeyTreeMatchCheckFailed',
  TaPubkeyTreeMatchCheckFailedError
);

/** PayerIsNotSigner: Payer is not a signer */
export class TaPayerIsNotSignerError extends ProgramError {
  override readonly name: string = 'PayerIsNotSigner';

  readonly code: number = 0xc; // 12

  constructor(program: Program, cause?: Error) {
    super('Payer is not a signer', program, cause);
  }
}
codeToErrorMap.set(0xc, TaPayerIsNotSignerError);
nameToErrorMap.set('PayerIsNotSigner', TaPayerIsNotSignerError);

/** NotImplemented */
export class TaNotImplementedError extends ProgramError {
  override readonly name: string = 'NotImplemented';

  readonly code: number = 0xd; // 13

  constructor(program: Program, cause?: Error) {
    super('', program, cause);
  }
}
codeToErrorMap.set(0xd, TaNotImplementedError);
nameToErrorMap.set('NotImplemented', TaNotImplementedError);

/** BorshSerializationError: Borsh Serialization Error */
export class TaBorshSerializationErrorError extends ProgramError {
  override readonly name: string = 'BorshSerializationError';

  readonly code: number = 0xe; // 14

  constructor(program: Program, cause?: Error) {
    super('Borsh Serialization Error', program, cause);
  }
}
codeToErrorMap.set(0xe, TaBorshSerializationErrorError);
nameToErrorMap.set('BorshSerializationError', TaBorshSerializationErrorError);

/**
 * Attempts to resolve a custom program error from the provided error code.
 * @category Errors
 */
export function getMplTokenAuthRulesErrorFromCode(
  code: number,
  program: Program,
  cause?: Error
): ProgramError | null {
  const constructor = codeToErrorMap.get(code);
  return constructor ? new constructor(program, cause) : null;
}

/**
 * Attempts to resolve a custom program error from the provided error name, i.e. 'Unauthorized'.
 * @category Errors
 */
export function getMplTokenAuthRulesErrorFromName(
  name: string,
  program: Program,
  cause?: Error
): ProgramError | null {
  const constructor = nameToErrorMap.get(name);
  return constructor ? new constructor(program, cause) : null;
}
