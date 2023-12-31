import {
  assertIsNode,
  instructionDataArgsNode,
  instructionNode,
} from '../nodes';
import { bottomUpTransformerVisitor } from './bottomUpTransformerVisitor';
import { flattenStruct } from './flattenStructVisitor';

export function flattenInstructionArgsStructVisitor() {
  return bottomUpTransformerVisitor([
    {
      select: '[instructionNode]',
      transform: (instruction) => {
        assertIsNode(instruction, 'instructionNode');
        return instructionNode({
          ...instruction,
          dataArgs: instructionDataArgsNode({
            ...instruction.dataArgs,
            struct: flattenStruct(instruction.dataArgs.struct),
          }),
        });
      },
    },
  ]);
}
