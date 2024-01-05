import {
  INSTRUCTION_INPUT_VALUE_NODE,
  InstructionInputValueNode,
  InstructionNode,
  PdaNode,
  PdaSeedValueNode,
  accountValueNode,
  argumentValueNode,
  assertIsNode,
  getAllInstructionArguments,
  isNode,
  pdaSeedValueNode,
  pdaValueNode,
} from '../nodes';
import { LinkableDictionary, pipe } from '../shared';
import { extendVisitor } from './extendVisitor';
import { identityVisitor } from './identityVisitor';
import { Visitor } from './visitor';

export function fillDefaultPdaSeedValuesVisitor(
  instruction: InstructionNode,
  linkables: LinkableDictionary
) {
  return pipe(identityVisitor(INSTRUCTION_INPUT_VALUE_NODE), (v) =>
    extendVisitor(v, {
      visitPdaValue(node, { next }) {
        const visitedNode = next(node);
        assertIsNode(visitedNode, 'pdaValueNode');
        const foundPda = linkables.get(visitedNode.pda);
        if (!foundPda) return visitedNode;
        return pdaValueNode(
          visitedNode.pda,
          addDefaultSeedValuesFromPdaWhenMissing(
            instruction,
            foundPda,
            visitedNode.seeds
          )
        );
      },
    })
  ) as Visitor<InstructionInputValueNode, InstructionInputValueNode['kind']>;
}

function addDefaultSeedValuesFromPdaWhenMissing(
  instruction: InstructionNode,
  pda: PdaNode,
  existingSeeds: PdaSeedValueNode[]
): PdaSeedValueNode[] {
  const existingSeedNames = new Set(existingSeeds.map((seed) => seed.name));
  const defaultSeeds = getDefaultSeedValuesFromPda(instruction, pda).filter(
    (seed) => !existingSeedNames.has(seed.name)
  );
  return [...existingSeeds, ...defaultSeeds];
}

function getDefaultSeedValuesFromPda(
  instruction: InstructionNode,
  pda: PdaNode
): PdaSeedValueNode[] {
  return pda.seeds.flatMap((seed): PdaSeedValueNode[] => {
    if (!isNode(seed, 'variablePdaSeedNode')) return [];

    const hasMatchingAccount = instruction.accounts.some(
      (a) => a.name === seed.name
    );
    if (isNode(seed.type, 'publicKeyTypeNode') && hasMatchingAccount) {
      return [pdaSeedValueNode(seed.name, accountValueNode(seed.name))];
    }

    const hasMatchingArgument = getAllInstructionArguments(instruction).some(
      (a) => a.name === seed.name
    );
    if (hasMatchingArgument) {
      return [pdaSeedValueNode(seed.name, argumentValueNode(seed.name))];
    }

    return [];
  });
}
