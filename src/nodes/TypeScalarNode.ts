import type { Visitable, Visitor } from '../visitors';

export class TypeScalarNode implements Visitable {
  readonly type: ScalarType;

  constructor(type: ScalarType) {
    this.type = type;
  }

  visit(visitor: Visitor): void {
    visitor.visitTypeScalar(this);
  }
}

export type ScalarType =
  | 'u8'
  | 'u16'
  | 'u32'
  | 'u64'
  | 'u128'
  | 'u256'
  | 'u512'
  | 'i8'
  | 'i16'
  | 'i32'
  | 'i64'
  | 'i128'
  | 'i256'
  | 'i512'
  | 'bool'
  | 'string';
