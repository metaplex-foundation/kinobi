import type { Visitor } from './Visitor';

export interface Visitable {
  visit(visitor: Visitor): void;
}
