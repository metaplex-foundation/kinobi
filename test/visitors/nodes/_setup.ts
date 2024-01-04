import test from 'ava';
import {
  Node,
  NodeSelector,
  deleteNodesVisitor,
  getDebugStringVisitor,
  identityVisitor,
  mergeVisitor,
  visit,
} from '../../../src';

export const mergeVisitorMacro = test.macro({
  title: () => 'mergeVisitor',
  exec(t, node: Node, expectedNodeCount: number) {
    const visitor = mergeVisitor(
      () => 1,
      (_, values) => values.reduce((a, b) => a + b, 1)
    );
    const result = visit(node, visitor);
    t.is(result, expectedNodeCount);
  },
});

export const identityVisitorMacro = test.macro({
  title: () => 'identityVisitor',
  exec(t, node: Node) {
    const visitor = identityVisitor();
    const result = visit(node, visitor);
    t.deepEqual(result, node);
    t.not(result, node);
  },
});

export const deleteNodesVisitorMacro = test.macro({
  title(_, _node, selector: NodeSelector | NodeSelector[]) {
    const selectors = Array.isArray(selector) ? selector : [selector];
    return `deleteNodesVisitor: ${selectors.join(', ')}`;
  },
  exec(
    t,
    node: Node,
    selector: NodeSelector | NodeSelector[],
    expectedResult: Node | null
  ) {
    const selectors = Array.isArray(selector) ? selector : [selector];
    const visitor = deleteNodesVisitor(selectors);
    const result = visit(node, visitor);
    t.deepEqual(result, expectedResult);
    t.not(result, node);
  },
});

export const getDebugStringVisitorMacro = test.macro({
  title: () => 'getDebugStringVisitor',
  exec(t, node: Node, expectedIndentedString: string) {
    const visitor = getDebugStringVisitor({ indent: true });
    const result = visit(node, visitor);
    t.is(result, expectedIndentedString.trim());
  },
});
