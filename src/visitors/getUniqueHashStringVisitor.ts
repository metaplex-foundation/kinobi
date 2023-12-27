import stringify from 'json-stable-stringify';
import { staticVisitor } from './staticVisitor';
import { removeDocsVisitor } from './removeDocsVisitor';
import { mapVisitor } from './mapVisitor';
import { Visitor } from './visitor2';

export function getUniqueHashStringVisitor(
  options: { removeDocs?: boolean } = {}
): Visitor<string> {
  const removeDocs = options.removeDocs ?? false;
  if (!removeDocs) {
    return staticVisitor((node) => stringify(node));
  }
  return mapVisitor(removeDocsVisitor(), (node) => stringify(node));
}
