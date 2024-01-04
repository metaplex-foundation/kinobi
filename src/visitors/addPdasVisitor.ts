import { KinobiError, mainCase } from '../shared';
import { PdaSeedNode, assertIsNode, pdaNode, programNode } from '../nodes';
import { bottomUpTransformerVisitor } from './bottomUpTransformerVisitor';

export function addPdasVisitor(
  pdas: Record<string, { name: string; seeds: PdaSeedNode[] }[]>
) {
  return bottomUpTransformerVisitor(
    Object.entries(pdas).map(([uncasedProgramName, newPdas]) => {
      const programName = mainCase(uncasedProgramName);
      return {
        select: `[programNode]${programName}`,
        transform: (node) => {
          assertIsNode(node, 'programNode');
          const existingPdaNames = new Set(node.pdas.map((pda) => pda.name));
          const newPdaNames = new Set(newPdas.map((pda) => pda.name));
          const overlappingPdaNames = new Set(
            [...existingPdaNames].filter((name) => newPdaNames.has(name))
          );
          if (overlappingPdaNames.size > 0) {
            throw new KinobiError(
              `Cannot add PDAs to program "${programName}" because the following PDA names ` +
                `already exist: ${[...overlappingPdaNames].join(', ')}.`
            );
          }
          return programNode({
            ...node,
            pdas: [
              ...node.pdas,
              ...newPdas.map((pda) => pdaNode(pda.name, pda.seeds)),
            ],
          });
        },
      };
    })
  );
}
