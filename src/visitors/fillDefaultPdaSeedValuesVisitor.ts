import {
  INSTRUCTION_INPUT_VALUE_NODE,
  InstructionInputValueNode,
  addDefaultSeedValuesFromPdaWhenMissing,
  assertIsNode,
  pdaValueNode,
} from '../nodes';
import { LinkableDictionary, pipe } from '../shared';
import { extendVisitor } from './extendVisitor';
import { identityVisitor } from './identityVisitor';
import { Visitor } from './visitor';

export function fillDefaultPdaSeedValuesVisitor(linkables: LinkableDictionary) {
  return pipe(identityVisitor(INSTRUCTION_INPUT_VALUE_NODE), (v) =>
    extendVisitor(v, {
      visitPdaValue(node, { next }) {
        const visitedNode = next(node);
        assertIsNode(visitedNode, 'pdaValueNode');
        const foundPda = linkables.get(visitedNode.pda);
        if (!foundPda) return visitedNode;
        return pdaValueNode(
          visitedNode.pda,
          addDefaultSeedValuesFromPdaWhenMissing(foundPda, visitedNode.seeds)
        );
      },
    })
  ) as Visitor<InstructionInputValueNode, InstructionInputValueNode['kind']>;
}
