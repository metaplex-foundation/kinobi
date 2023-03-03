import * as nodes from '../../nodes';
import { TransformNodesVisitor } from './TransformNodesVisitor';
import { flattenStruct } from './FlattenStructVisitor';

export class UnwrapInstructionArgsStructVisitor extends TransformNodesVisitor {
  constructor() {
    super([
      {
        selector: { type: 'instruction' },
        transformer: (instruction) => {
          nodes.assertInstructionNode(instruction);
          return new nodes.InstructionNode(
            instruction.metadata,
            instruction.accounts,
            flattenStruct(instruction.args),
            instruction.subInstructions
          );
        },
      },
    ]);
  }
}
