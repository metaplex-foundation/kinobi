import {
  DefinedTypeNode,
  REGISTERED_TYPE_NODE_KEYS,
  RegisteredTypeNodes,
} from '../nodes';
import { Visitor } from './Visitor';
import { mergeVisitor } from './mergeVisitor';

type SupportedNodeKeys =
  | keyof RegisteredTypeNodes
  | 'accountDataNode'
  | 'instructionDataArgsNode'
  | 'instructionExtraArgsNode';

export function getByteSizeVisitor(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  availableDefinedTypes: Map<string, DefinedTypeNode>
): Visitor<number | null, SupportedNodeKeys> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const visitedDefinedTypes = new Map<string, number | null>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const definedTypeStack: string[] = [];

  const visitor = mergeVisitor(
    () => null as number | null,
    (_, values) =>
      values.reduce(
        (all, one) => (all === null || one === null ? null : all + one),
        0 as number | null
      ),
    {
      nodeKeys: [
        ...REGISTERED_TYPE_NODE_KEYS,
        'accountDataNode',
        'instructionDataArgsNode',
        'instructionExtraArgsNode',
      ],
    }
  );

  return visitor;
}
