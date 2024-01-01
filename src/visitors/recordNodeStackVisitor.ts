import { RegisteredNodes } from '../nodes';
import { NodeStack } from '../shared';
import { interceptVisitor } from './interceptVisitor';
import { Visitor } from './visitor';

export function recordNodeStackVisitor<
  TReturn,
  TNodeKeys extends keyof RegisteredNodes
>(
  visitor: Visitor<TReturn, TNodeKeys>,
  stack: NodeStack
): Visitor<TReturn, TNodeKeys> {
  return interceptVisitor(visitor, (node, next) => {
    stack.push(node);
    const newNode = next(node);
    stack.pop();
    return newNode;
  });
}
