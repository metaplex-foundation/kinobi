import type { IdlPda } from './IdlPda';
import type { IdlAccount } from './IdlAccount';
import type { IdlEvent } from './IdlEvent';
import type { IdlConstant } from './IdlConstant';
import type { IdlDefinedType } from './IdlDefinedType';
import type { IdlError } from './IdlError';
import type { IdlInstruction } from './IdlInstruction';

export type Idl = {
  address?: string;
  version?: string;
  name?: string;
  instructions: IdlInstruction[];
  pdas?: IdlPda[];
  accounts?: IdlAccount[];
  events?: IdlEvent[];
  errors?: IdlError[];
  types?: IdlDefinedType[];
  constants?: IdlConstant[];
  metadata: {
    name: string;
    address?: string;
    version?: string;
    spec?: string;
    description?: string;
    origin?: 'anchor' | 'shank';
    binaryVersion?: string;
    libVersion?: string;
  };
};
