import { NodeDictionary } from '../nodes';
import { Visitor } from './visitor';
import { mapVisitor } from './mapVisitor';

export function consoleLogVisitor<
  TNodeKeys extends keyof NodeDictionary = keyof NodeDictionary
>(visitor: Visitor<string, TNodeKeys>): Visitor<void, TNodeKeys> {
  // eslint-disable-next-line no-console
  return mapVisitor(visitor, (value) => console.log(value));
}
