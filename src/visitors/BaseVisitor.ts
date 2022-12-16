/* eslint-disable class-methods-use-this */
import type { Visitor } from './Visitor';

export abstract class BaseVisitor implements Visitor {
  visitRoot(): void {}

  visitAccount(): void {}

  visitInstruction(): void {}

  visitTypeScalar(): void {}

  visitTypeDefined(): void {}
}
