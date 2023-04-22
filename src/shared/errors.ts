/* eslint-disable max-classes-per-file */
export class KinobiError extends Error {
  readonly name: string = 'KinobiError';
}

export class InvalidKinobiTreeError extends KinobiError {
  readonly name: string = 'InvalidKinobiTreeError';
}
