/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

export const enum SplTokenProgramErrorCode {
  /** NotRentExempt: Lamport balance below rent-exempt threshold */
  NOT_RENT_EXEMPT = 0x0, // 0
  /** InsufficientFunds: Insufficient funds */
  INSUFFICIENT_FUNDS = 0x1, // 1
  /** InvalidMint: Invalid Mint */
  INVALID_MINT = 0x2, // 2
  /** MintMismatch: Account not associated with this Mint */
  MINT_MISMATCH = 0x3, // 3
  /** OwnerMismatch: Owner does not match */
  OWNER_MISMATCH = 0x4, // 4
  /** FixedSupply: Fixed supply */
  FIXED_SUPPLY = 0x5, // 5
  /** AlreadyInUse: Already in use */
  ALREADY_IN_USE = 0x6, // 6
  /** InvalidNumberOfProvidedSigners: Invalid number of provided signers */
  INVALID_NUMBER_OF_PROVIDED_SIGNERS = 0x7, // 7
  /** InvalidNumberOfRequiredSigners: Invalid number of required signers */
  INVALID_NUMBER_OF_REQUIRED_SIGNERS = 0x8, // 8
  /** UninitializedState: State is unititialized */
  UNINITIALIZED_STATE = 0x9, // 9
  /** NativeNotSupported: Instruction does not support native tokens */
  NATIVE_NOT_SUPPORTED = 0xa, // 10
  /** NonNativeHasBalance: Non-native account can only be closed if its balance is zero */
  NON_NATIVE_HAS_BALANCE = 0xb, // 11
  /** InvalidInstruction: Invalid instruction */
  INVALID_INSTRUCTION = 0xc, // 12
  /** InvalidState: State is invalid for requested operation */
  INVALID_STATE = 0xd, // 13
  /** Overflow: Operation overflowed */
  OVERFLOW = 0xe, // 14
  /** AuthorityTypeNotSupported: Account does not support specified authority type */
  AUTHORITY_TYPE_NOT_SUPPORTED = 0xf, // 15
  /** MintCannotFreeze: This token mint cannot freeze accounts */
  MINT_CANNOT_FREEZE = 0x10, // 16
  /** AccountFrozen: Account is frozen */
  ACCOUNT_FROZEN = 0x11, // 17
  /** MintDecimalsMismatch: The provided decimals value different from the Mint decimals */
  MINT_DECIMALS_MISMATCH = 0x12, // 18
  /** NonNativeNotSupported: Instruction does not support non-native tokens */
  NON_NATIVE_NOT_SUPPORTED = 0x13, // 19
}

const splTokenProgramErrorCodeMap: Record<
  SplTokenProgramErrorCode,
  [string, string]
> = {
  [SplTokenProgramErrorCode.NOT_RENT_EXEMPT]: [
    'NotRentExempt',
    `Lamport balance below rent-exempt threshold`,
  ],
  [SplTokenProgramErrorCode.INSUFFICIENT_FUNDS]: [
    'InsufficientFunds',
    `Insufficient funds`,
  ],
  [SplTokenProgramErrorCode.INVALID_MINT]: ['InvalidMint', `Invalid Mint`],
  [SplTokenProgramErrorCode.MINT_MISMATCH]: [
    'MintMismatch',
    `Account not associated with this Mint`,
  ],
  [SplTokenProgramErrorCode.OWNER_MISMATCH]: [
    'OwnerMismatch',
    `Owner does not match`,
  ],
  [SplTokenProgramErrorCode.FIXED_SUPPLY]: ['FixedSupply', `Fixed supply`],
  [SplTokenProgramErrorCode.ALREADY_IN_USE]: ['AlreadyInUse', `Already in use`],
  [SplTokenProgramErrorCode.INVALID_NUMBER_OF_PROVIDED_SIGNERS]: [
    'InvalidNumberOfProvidedSigners',
    `Invalid number of provided signers`,
  ],
  [SplTokenProgramErrorCode.INVALID_NUMBER_OF_REQUIRED_SIGNERS]: [
    'InvalidNumberOfRequiredSigners',
    `Invalid number of required signers`,
  ],
  [SplTokenProgramErrorCode.UNINITIALIZED_STATE]: [
    'UninitializedState',
    `State is unititialized`,
  ],
  [SplTokenProgramErrorCode.NATIVE_NOT_SUPPORTED]: [
    'NativeNotSupported',
    `Instruction does not support native tokens`,
  ],
  [SplTokenProgramErrorCode.NON_NATIVE_HAS_BALANCE]: [
    'NonNativeHasBalance',
    `Non-native account can only be closed if its balance is zero`,
  ],
  [SplTokenProgramErrorCode.INVALID_INSTRUCTION]: [
    'InvalidInstruction',
    `Invalid instruction`,
  ],
  [SplTokenProgramErrorCode.INVALID_STATE]: [
    'InvalidState',
    `State is invalid for requested operation`,
  ],
  [SplTokenProgramErrorCode.OVERFLOW]: ['Overflow', `Operation overflowed`],
  [SplTokenProgramErrorCode.AUTHORITY_TYPE_NOT_SUPPORTED]: [
    'AuthorityTypeNotSupported',
    `Account does not support specified authority type`,
  ],
  [SplTokenProgramErrorCode.MINT_CANNOT_FREEZE]: [
    'MintCannotFreeze',
    `This token mint cannot freeze accounts`,
  ],
  [SplTokenProgramErrorCode.ACCOUNT_FROZEN]: [
    'AccountFrozen',
    `Account is frozen`,
  ],
  [SplTokenProgramErrorCode.MINT_DECIMALS_MISMATCH]: [
    'MintDecimalsMismatch',
    `The provided decimals value different from the Mint decimals`,
  ],
  [SplTokenProgramErrorCode.NON_NATIVE_NOT_SUPPORTED]: [
    'NonNativeNotSupported',
    `Instruction does not support non-native tokens`,
  ],
};

export class SplTokenProgramError extends Error {
  override readonly name = 'SplTokenProgramError';
  readonly code: SplTokenProgramErrorCode;
  readonly cause: Error | undefined;

  constructor(
    code: SplTokenProgramErrorCode,
    name: string,
    message: string,
    cause?: Error
  ) {
    super(`${name} (${code}): ${message}`);
    Error.captureStackTrace(this, this.constructor);
    this.code = code;
    this.cause = cause;
  }
}

export function getSplTokenProgramErrorFromCode(
  code: SplTokenProgramErrorCode,
  cause?: Error
): SplTokenProgramError {
  return new SplTokenProgramError(
    code,
    ...splTokenProgramErrorCodeMap[code],
    cause
  );
}
