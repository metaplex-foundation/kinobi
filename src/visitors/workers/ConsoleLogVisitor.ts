import { BaseDelegateVisitor } from '../BaseDelegateVisitor';

export class ConsoleLogVisitor extends BaseDelegateVisitor<any, void> {
  map(value: any): void {
    // eslint-disable-next-line no-console
    console.log(value);
  }
}
