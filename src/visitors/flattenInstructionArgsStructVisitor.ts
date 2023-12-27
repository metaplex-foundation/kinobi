import {
  assertInstructionNode,
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
        assertInstructionNode(instruction);
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
