import type { Visitor } from './Visitor';

export interface Visitable {
  accept<T>(visitor: Visitor<T>): T;
}
